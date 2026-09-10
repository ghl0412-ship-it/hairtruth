
// ── 헤어트루스 공통 JS ──
const USERS_KEY   = 'hairtruth_users';
const SESSION_KEY  = 'hairtruth_session';
const REVIEWS_KEY  = 'hairtruth_reviews';
const ADMIN_EMAIL  = 'ghl0412';
const ADMIN_KEY    = 'hairtruth_admin_session';

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch(e) { return []; }
}
function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch(e) { return null; }
}
function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  updateNavUI();
}
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  updateNavUI();
}
function getReviews() {
  try { return JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]'); } catch(e) { return []; }
}
function hashPw(pw) {
  var h = 0;
  for (var i = 0; i < pw.length; i++) {
    h = ((h << 5) - h) + pw.charCodeAt(i);
    h |= 0;
  }
  return h.toString(36);
}

// 네비 UI 업데이트
function updateNavUI() {
  var user = getCurrentUser();
  var authBtn = document.getElementById('navAuthBtn');
  var mobileAuthBtn = document.getElementById('mobileAuthBtn');
  if (!authBtn) return;
  if (user) {
    authBtn.textContent = user.name + ' ▾';
    authBtn.style.color = 'var(--accent-soft)';
    if (mobileAuthBtn) mobileAuthBtn.textContent = user.name + ' (로그아웃)';
  } else {
    authBtn.textContent = '로그인';
    authBtn.style.color = '#aaa';
    if (mobileAuthBtn) mobileAuthBtn.textContent = '로그인 / 회원가입';
  }
  // 관리자 버튼
  var adminBtn = document.getElementById('navAdminBtn');
  if (user && user.email === ADMIN_EMAIL) {
    if (!adminBtn) {
      var btn = document.createElement('a');
      btn.id = 'navAdminBtn';
      btn.href = 'index.html#admin';
      btn.textContent = '⚙️ 관리';
      btn.style.cssText = 'color:var(--accent-soft);text-decoration:none;font-size:0.85rem;';
      if (authBtn.parentNode) authBtn.parentNode.insertBefore(btn, authBtn);
    }
  } else if (adminBtn) {
    adminBtn.remove();
  }
}

function handleNavAuth() {
  var user = getCurrentUser();
  if (user) {
    if (confirm(user.name + '님, 로그아웃 하시겠어요?')) {
      clearSession();
    }
  } else {
    // auth 모달이 있으면 열기, 없으면 index.html로
    if (document.getElementById('authModal')) {
      openAuthModal('login');
    } else {
      location.href = 'index.html?open=auth';
    }
  }
}

// 후기 모달 열기
function openReviewModal() {
  var user = getCurrentUser();
  if (!user) {
    alert('로그인 후 후기를 작성할 수 있어요!');
    if (document.getElementById('authModal')) {
      openAuthModal('login');
    } else {
      location.href = 'index.html?open=auth';
    }
    return;
  }
  if (document.getElementById('reviewModal')) {
    document.getElementById('reviewModal').classList.add('open');
  } else {
    location.href = 'index.html?open=review';
  }
}

// 자가진단 모달
function openDiag() {
  if (document.getElementById('diagModal')) {
    document.getElementById('diagModal').classList.add('open');
  } else {
    location.href = 'index.html?open=diag';
  }
}

function closeHtModal(id) {
  var modal = document.getElementById(id);
  if (modal) { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); }
}

function openHtModal(id) {
  var modal = document.getElementById(id);
  if (modal) { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); }
}

function openAuthModal(mode) {
  var nameField = document.getElementById('authNameField');
  var title = document.getElementById('authTitle');
  var description = document.getElementById('authDescription');
  var submit = document.getElementById('authSubmit');
  var switcher = document.getElementById('authSwitch');
  if (!nameField || !title || !description || !submit || !switcher) { location.href = 'index.html?open=auth'; return; }
  window.htAuthMode = mode === 'register' ? 'register' : 'login';
  var register = window.htAuthMode === 'register';
  nameField.hidden = !register;
  nameField.querySelector('input').required = register;
  title.textContent = register ? '회원가입' : '로그인';
  description.textContent = register ? '닉네임과 이메일을 등록하면 후기와 Q&A를 이용할 수 있어요.' : '영수증 후기와 Q&A를 이용하려면 로그인해주세요.';
  submit.textContent = register ? '회원가입' : '로그인';
  switcher.textContent = register ? '이미 계정이 있나요? 로그인' : '처음이신가요? 회원가입';
  openHtModal('authModal');
}

function switchAuthMode() { openAuthModal(window.htAuthMode === 'register' ? 'login' : 'register'); }

function submitAuth(event) {
  event.preventDefault();
  var email = document.getElementById('authEmail').value.trim().toLowerCase();
  var password = document.getElementById('authPassword').value;
  var name = document.getElementById('authName').value.trim();
  var users = getUsers();
  if (window.htAuthMode === 'register') {
    if (!name) { alert('닉네임을 입력해주세요.'); return; }
    if (users.some(function(u){ return u.email === email; })) { alert('이미 가입된 이메일입니다.'); return; }
    var user = { id: Date.now(), name: name, email: email, password: hashPw(password) };
    users.push(user); localStorage.setItem(USERS_KEY, JSON.stringify(users)); setSession({id:user.id,name:user.name,email:user.email});
    closeHtModal('authModal'); alert('회원가입이 완료됐어요!');
  } else {
    var found = users.find(function(u){ return u.email === email && u.password === hashPw(password); });
    if (!found) { alert('이메일 또는 비밀번호를 확인해주세요.'); return; }
    setSession({id:found.id,name:found.name,email:found.email}); closeHtModal('authModal'); alert(found.name + '님, 로그인됐어요!');
  }
}

function submitReview(event) {
  event.preventDefault();
  var user = getCurrentUser();
  if (!user) { openAuthModal('login'); return; }
  var file = document.getElementById('reviewReceipt').files[0];
  if (!file) { alert('영수증 이미지를 첨부해주세요.'); return; }
  var reader = new FileReader();
  reader.onload = function(){
    var reviews = getReviews();
    reviews.unshift({id:Date.now(),nickname:user.name,region:'',gender:'',hospitalName:document.getElementById('reviewHospital').value.trim(),treatment:document.getElementById('reviewTreatment').value.trim(),amount:Number(document.getElementById('reviewAmount').value),rating:Number(document.getElementById('reviewRating').value),content:document.getElementById('reviewContent').value.trim(),receiptImg:reader.result,status:'pending',date:new Date().toLocaleDateString('ko-KR')});
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews)); closeHtModal('reviewModal'); event.target.reset(); alert('후기 검토 요청이 등록됐어요. 인증 확인 후 공개됩니다.');
  };
  reader.readAsDataURL(file);
}

function runDiagnosis(event) {
  event.preventDefault();
  var score = Number(document.getElementById('diagDuration').value) + Number(document.getElementById('diagShedding').value) + Number(document.getElementById('diagFamily').value);
  var message = score >= 4 ? '최근 변화가 있거나 가족력이 있어 피부과·탈모 전문의 상담을 권장해요.' : score >= 2 ? '생활 습관과 두피 상태를 관찰하면서 필요하면 전문가와 상담해보세요.' : '현재 답변 기준으로 급한 신호는 적어 보여요. 변화가 지속되면 상담을 권장해요.';
  var result = document.getElementById('diagResult');
  result.hidden = false; result.innerHTML = '<strong>참고 결과</strong><br>' + message + '<br><small>이 결과는 의료 진단이 아니며 참고용입니다.</small>';
}

function handleDeepLink() {
  var open = new URLSearchParams(location.search).get('open');
  if (open === 'auth') openAuthModal('login');
  if (open === 'review') openReviewModal();
  if (open === 'diag') openDiag();
}

// 모바일 메뉴
document.addEventListener('DOMContentLoaded', function() {
  updateNavUI();
  handleDeepLink();
  // 모바일 메뉴 닫기
  document.querySelectorAll('.mobile-nav a').forEach(function(a) {
    a.addEventListener('click', function() {
      var mn = document.getElementById('mn');
      if (mn) mn.classList.remove('open');
    });
  });
});
// ── 비교함 (Compare) 스크립트 ──
let compareList = JSON.parse(localStorage.getItem('hairtruth_compare') || '[]');

function toggleCompare(hospitalData) {
  const index = compareList.findIndex(item => item.id === hospitalData.id);
  
  if (index > -1) {
    compareList.splice(index, 1);
  } else {
    if (compareList.length >= 3) {
      alert('비교함에는 최대 3개까지만 담을 수 있습니다.');
      return;
    }
    compareList.push(hospitalData);
  }
  
  localStorage.setItem('hairtruth_compare', JSON.stringify(compareList));
  updateCompareUI();
}

function updateCompareUI() {
  const bar = document.getElementById('compareBar');
  const count = document.getElementById('compareCount');
  if (!bar || !count) return;
  
  if (compareList.length > 0) {
    bar.style.display = 'flex';
    count.textContent = compareList.length;
  } else {
    bar.style.display = 'none';
  }
}

function openCompareModal() {
  if (compareList.length < 2) {
    alert('비교를 위해 최소 2개 이상의 병원을 선택해 주세요.');
    return;
  }
  
  const wrapper = document.getElementById('compareTableWrapper');
  if (!wrapper) return;
  
  let html = `<table class="compare-table">
    <thead>
      <tr>
        <th>구분</th>
        ${compareList.map(h => `<th>${h.name}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>대표 시술/가격</strong></td>
        ${compareList.map(h => `<td><strong style="color:var(--accent);">${h.price}</strong></td>`).join('')}
      </tr>
      <tr>
        <td><strong>평점 / 후기수</strong></td>
        ${compareList.map(h => `<td>★ ${h.rating} (${h.reviews}개)</td>`).join('')}
      </tr>
      <tr>
        <td><strong>위치/지하철</strong></td>
        ${compareList.map(h => `<td>${h.location}</td>`).join('')}
      </tr>
      <tr>
        <td><strong>삭제</strong></td>
        ${compareList.map(h => `<td><button onclick="removeItem('${h.id}')" style="border:none;background:none;color:#aaa;cursor:pointer;">삭제</button></td>`).join('')}
      </tr>
    </tbody>
  </table>`;
  
  wrapper.innerHTML = html;
  document.getElementById('compareModal').style.display = 'flex';
}

function closeCompareModal() {
  const modal = document.getElementById('compareModal');
  if (modal) modal.style.display = 'none';
}

function removeItem(id) {
  compareList = compareList.filter(item => item.id !== id);
  localStorage.setItem('hairtruth_compare', JSON.stringify(compareList));
  updateCompareUI();
  if (compareList.length < 2) {
    closeCompareModal();
  } else {
    openCompareModal();
  }
}

// 기존 shared.js의 DOMContentLoaded와 통합하거나 아래와 같이 추가
document.addEventListener('DOMContentLoaded', updateCompareUI);
