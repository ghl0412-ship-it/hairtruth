
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
      location.href = 'index.html';
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
      location.href = 'index.html';
    }
    return;
  }
  if (document.getElementById('reviewModal')) {
    document.getElementById('reviewModal').classList.add('open');
  } else {
    location.href = 'index.html';
  }
}

// 자가진단 모달
function openDiag() {
  if (document.getElementById('diagModal')) {
    document.getElementById('diagModal').classList.add('open');
  } else {
    location.href = 'index.html';
  }
}

// 모바일 메뉴
document.addEventListener('DOMContentLoaded', function() {
  updateNavUI();
  // 모바일 메뉴 닫기
  document.querySelectorAll('.mobile-nav a').forEach(function(a) {
    a.addEventListener('click', function() {
      var mn = document.getElementById('mn');
      if (mn) mn.classList.remove('open');
    });
  });
});
