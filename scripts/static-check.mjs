import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const htmlFiles = readdirSync(root).filter((file) => file.endsWith('.html'));
const analyticsFile = 'analytics-events.js';
const sourceFiles = [...htmlFiles, 'shared.js', analyticsFile];
const failures = [];

function source(name) {
  return readFileSync(join(root, name), 'utf8');
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

for (const required of ['terms.html', 'privacy.html', 'XSS_RISK_REGISTER.md', analyticsFile]) {
  assert(existsSync(join(root, required)), `required P0 artifact is missing: ${required}`);
}

const combined = sourceFiles.map((file) => `\n/* ${file} */\n${source(file)}`).join('');
const forbidden = [
  [/ADMIN_(EMAIL|ID|KEY|PW)/, 'administrator credential or client-side role identifier remains'],
  [/hairtruth_(admin_session|session|users)/, 'client-side authentication storage key remains'],
  [/(HOSPITALS_KEY|ht_admin_hospitals)/, 'browser-based administrator hospital CRUD key remains'],
  [/rich0412/, 'previous hard-coded administrator password remains']
];

for (const [pattern, message] of forbidden) {
  assert(!pattern.test(combined), message);
}

for (const [name, pattern] of [
  ['login', /function doLogin\(\)\s*\{\s*showToast\(BETA_COLLECTION_NOTICE[\s\S]{0,100}?\s*return;/],
  ['registration', /function doRegister\(\)\s*\{\s*showToast\(BETA_COLLECTION_NOTICE[\s\S]{0,100}?\s*return;/],
  ['receipt upload', /function handleReceiptUpload\(input\)\s*\{\s*showToast\(BETA_COLLECTION_NOTICE[\s\S]{0,100}?\s*return;/],
  ['review submission', /function submitReview\(\)\s*\{\s*showToast\(BETA_COLLECTION_NOTICE[\s\S]{0,100}?\s*return;/],
  ['review approval', /function approveReview\(id\)\s*\{\s*showToast\(BETA_COLLECTION_NOTICE/],
  ['review rejection', /function rejectReview\(id\)\s*\{\s*showToast\(BETA_COLLECTION_NOTICE/],
  ['hospital form', /function openHospitalForm\(id\)\s*\{\s*showToast\(BETA_COLLECTION_NOTICE[\s\S]{0,100}?\s*return;/],
  ['hospital save', /function saveHospital\(\)\s*\{\s*showToast\(BETA_COLLECTION_NOTICE[\s\S]{0,100}?\s*return;/],
  ['hospital delete', /function deleteHospital\(id\)\s*\{\s*showToast\(BETA_COLLECTION_NOTICE[\s\S]{0,100}?\s*return;/]
]) {
  assert(pattern.test(combined), `${name} is not disabled with the beta notice`);
}

const index = source('index.html');
assert(index.includes('href="terms.html"'), 'terms link is not connected');
assert(index.includes('href="privacy.html"'), 'privacy link is not connected');

const analytics = source(analyticsFile);
for (const eventName of ['blog_click', 'survey_click', 'openchat_click']) {
  assert(analytics.includes(eventName), `analytics event is missing: ${eventName}`);
}
for (const blogUrl of ['https://blog.naver.com/hair_truth', 'https://blog.naver.com/ghl0412']) {
  assert(analytics.includes(blogUrl), `official blog URL is missing from analytics: ${blogUrl}`);
}
assert(analytics.includes("'blog_click'"), 'blog click event mapping is missing');
for (const parameter of ['link_url', 'link_text', 'page_path']) {
  assert(analytics.includes(parameter), `analytics parameter is missing: ${parameter}`);
}
for (const page of ['index.html', 'guide.html', 'hospitals.html', 'price.html', 'qa.html', 'ranking.html', 'reviews.html']) {
  assert(source(page).includes('src="analytics-events.js"'), `analytics script is not loaded by ${page}`);
}
try {
  new vm.Script(analytics, { filename: analyticsFile });
} catch (error) {
  failures.push(`JavaScript syntax error in ${analyticsFile}: ${error.message}`);
}

for (const file of htmlFiles) {
  const html = source(file);
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
  for (const [index, match] of scripts.entries()) {
    const code = match[1].trim();
    if (!code) continue;
    try {
      new vm.Script(code, { filename: `${file}:inline-script-${index + 1}` });
    } catch (error) {
      failures.push(`JavaScript syntax error in ${file} inline script ${index + 1}: ${error.message}`);
    }
  }
}

if (failures.length) {
  console.error('Static security checks failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Static security checks passed for ${htmlFiles.length} HTML files and shared.js.`);
}
