(function () {
  'use strict';

  var trackedLinks = {
    'https://blog.naver.com/hair_truth': 'blog_click',
    'https://docs.google.com/forms/d/e/1FAIpQLSfzLDILyNgFxTaTLzO3Gt4l86FhPUPzcrwuTO4UfRlKgAgMlQ/viewform': 'survey_click',
    'https://open.kakao.com/o/gSX50zki': 'openchat_click'
  };

  function getTrackedUrl(anchor) {
    try {
      var target = new URL(anchor.href);
      return Object.keys(trackedLinks).find(function (url) {
        return target.href === url;
      }) || null;
    } catch (error) {
      return null;
    }
  }

  document.addEventListener('click', function (event) {
    var anchor = event.target.closest('a[href]');
    if (!anchor || typeof window.gtag !== 'function') return;

    var linkUrl = getTrackedUrl(anchor);
    if (!linkUrl) return;

    window.gtag('event', trackedLinks[linkUrl], {
      link_url: linkUrl,
      link_text: anchor.textContent.replace(/\s+/g, ' ').trim(),
      page_path: window.location.pathname
    });
  });
})();
