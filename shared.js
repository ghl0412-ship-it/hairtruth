
// ── 헤어트루스 공통 JS ──
const BETA_COLLECTION_NOTICE = '베타 데이터 수집 준비 중입니다. 안전한 서버 기반 기능이 준비되면 안내드리겠습니다.';

function getUsers() {
  return [];
}
function getCurrentUser() {
  return null;
}
function setSession() {}
function clearSession() {}
function getReviews() {
  return [];
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
  var betaAuthBtn = document.getElementById('navAuthBtn');
  var betaMobileAuthBtn = document.getElementById('mobileAuthBtn');
  var betaAdminBtn = document.getElementById('navAdminBtn');
  if (betaAuthBtn) betaAuthBtn.textContent = '베타 준비 중';
  if (betaMobileAuthBtn) betaMobileAuthBtn.textContent = '베타 데이터 수집 준비 중';
  if (betaAdminBtn) betaAdminBtn.remove();
  return;
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
  if (false) {
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
  alert(BETA_COLLECTION_NOTICE);
  return;
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
  alert(BETA_COLLECTION_NOTICE);
  return;
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
  alert(BETA_COLLECTION_NOTICE);
  return;
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
  alert(BETA_COLLECTION_NOTICE);
  return;
  event.preventDefault();
  var email = document.getElementById('authEmail').value.trim().toLowerCase();
  var password = document.getElementById('authPassword').value;
  var name = document.getElementById('authName').value.trim();
  var users = getUsers();
  if (window.htAuthMode === 'register') {
    if (!name) { alert('닉네임을 입력해주세요.'); return; }
    if (users.some(function(u){ return u.email === email; })) { alert('이미 가입된 이메일입니다.'); return; }
    var user = { id: Date.now(), name: name, email: email, password: hashPw(password) };
    void user;
    closeHtModal('authModal'); alert('회원가입이 완료됐어요!');
  } else {
    var found = users.find(function(u){ return u.email === email && u.password === hashPw(password); });
    if (!found) { alert('이메일 또는 비밀번호를 확인해주세요.'); return; }
    setSession({id:found.id,name:found.name,email:found.email}); closeHtModal('authModal'); alert(found.name + '님, 로그인됐어요!');
  }
}

function submitReview(event) {
  event.preventDefault();
  alert(BETA_COLLECTION_NOTICE);
  return;
  event.preventDefault();
  var user = getCurrentUser();
  if (!user) { openAuthModal('login'); return; }
  var file = document.getElementById('reviewReceipt').files[0];
  if (!file) { alert('영수증 이미지를 첨부해주세요.'); return; }
  var reader = new FileReader();
  reader.onload = function(){
    var reviews = getReviews();
    reviews.unshift({id:Date.now(),nickname:user.name,region:'',gender:'',hospitalName:document.getElementById('reviewHospital').value.trim(),treatment:document.getElementById('reviewTreatment').value.trim(),amount:Number(document.getElementById('reviewAmount').value),rating:Number(document.getElementById('reviewRating').value),content:document.getElementById('reviewContent').value.trim(),receiptImg:reader.result,status:'pending',date:new Date().toLocaleDateString('ko-KR')});
    void reviews; closeHtModal('reviewModal'); event.target.reset(); alert(BETA_COLLECTION_NOTICE);
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


// ── 공개 데이터 상태 안내 ──
// 실제 영수증 검증 데이터가 축적되기 전에는 예상·예시 수치를 노출하지 않습니다.
document.addEventListener('DOMContentLoaded', function () {
  function replaceExactText(selector, from, to) {
    document.querySelectorAll(selector).forEach(function (el) {
      if (el.textContent.trim() === from) el.textContent = to;
    });
  }

  replaceExactText('.hero-badge', '100% 영수증 검증 기반', '영수증 후기 데이터 수집 중');
  replaceExactText('.hero p', '수많은 광고성 후기 속에서 진짜 영수증으로 검증된 병원 가격과 치료 후기를 공개합니다.', '광고성 정보 대신 공개 자료와 이용자 영수증 제보를 구분해, 검토가 끝난 정보부터 공개합니다.');
  replaceExactText('.section-sub', '헤어트루스는 과장된 광고 대신 실제 방문 고객의 데이터를 기반으로 정직한 정보를 안내합니다.', '헤어트루스는 공개 자료와 이용자 제보를 출처별로 구분해, 확인된 정보부터 투명하게 안내합니다.');

  replaceExactText('.how-section .section-sub', '영수증 기반 3단계 검증 프로세스로 광고성 후기를 완전히 차단합니다.', '영수증 제보는 개인정보를 가린 뒤 운영자 검토를 거쳐 공개합니다.');
  replaceExactText('.how-section .step:nth-child(2) h3', 'AI 진위 검증', '운영자 검토');
  replaceExactText('.how-section .step:nth-child(2) p', 'AI가 영수증의 병원명, 진료일, 금액 등을 자동 분석해 위조 여부를 판별합니다.', '병원명·진료일·결제 정보의 일치 여부와 개인정보 가림 상태를 확인합니다.');
  replaceExactText('.how-section .step:nth-child(3) h3', '투명한 정보 공개', '출처와 함께 공개');
  replaceExactText('.how-section .step:nth-child(3) p', '검증된 후기와 실제 지불 금액이 병원 프로필에 정확히 반영됩니다.', '검토를 마친 제보만 등록하며, 데이터가 쌓이면 병원별 정보로 반영합니다.');
  replaceExactText('.hospitals-section .section-title', '인증 후기 많은 탈모 기관', '탈모 치료 기관 찾기');
  replaceExactText('.hospitals-section .section-sub', '병원·한의원까지, 영수증으로 검증된 실제 방문자 후기 기반 정보입니다.', '영수증 인증 후기 데이터는 현재 수집 중입니다. 검토 완료된 정보부터 순차적으로 공개합니다.');

  document.querySelectorAll('.eff-row').forEach(function (row) {
    if (row.textContent.indexOf('만족도 (후기 기반)') !== -1) row.remove();
  });
  document.querySelectorAll('.gstat-row').forEach(function (row) {
    if (row.textContent.indexOf('영수증 인증 후기') !== -1) row.remove();
  });

  var price = document.querySelector('.price-section');
  if (price) {
    var title = price.querySelector('.section-title');
    var sub = price.querySelector('.section-sub');
    if (title) title.textContent = '영수증 기반 가격 데이터 준비 중';
    if (sub) sub.textContent = '현재는 공개 자료와 이용자 제보를 분리해 확인하고 있습니다. 실제 결제 데이터가 충분히 쌓인 뒤 표본 수·지역·시점과 함께 공개합니다.';
    var charts = price.querySelector('.chart-row');
    var table = price.querySelector('.price-table-wrap');
    if (charts) charts.style.display = 'none';
    if (table) table.style.display = 'none';
  }

  replaceExactText('.price-section .section-title', '실제 지불 금액 & 가격 변동 추이', '영수증 기반 가격 데이터 준비 중');
  replaceExactText('.price-section .section-sub', '영수증 인증 데이터를 집계한 실제 비급여 진료비와 최근 6개월 가격 변동입니다.', '현재는 공개 자료와 이용자 제보를 분리해 확인하고 있습니다. 실제 결제 데이터가 충분히 쌓인 뒤 표본 수·지역·시점과 함께 공개합니다.');
  replaceExactText('.section-sub', '탈모 유형과 진행 단계에 따라 적합한 치료법이 다릅니다. 영수증 후기 데이터를 기반으로 정리했습니다.', '탈모 유형과 진행 단계에 따라 적합한 치료법이 다릅니다. 아래 내용은 일반적인 참고 정보이며, 치료 선택은 의료진과 상담하세요.');
});


// ── 공식 블로그 링크 통일 ──
document.addEventListener('DOMContentLoaded', function () {
  var blogUrl = 'https://blog.naver.com/hair_truth';
  document.querySelectorAll('a').forEach(function (link) {
    var label = link.textContent.trim();
    var href = link.getAttribute('href');
    if (href === 'https://blog.naver.com/ghl0412' || label === '네이버 블로그') {
      link.href = blogUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  });
});
