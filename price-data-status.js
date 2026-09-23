(function () {
  'use strict';

  var STATUS_DATE = '2026.09.23';

  function makeStatusCard() {
    var card = document.createElement('div');
    card.className = 'price-data-status';
    card.style.cssText = 'margin-top:18px;padding:18px;background:var(--teal-light);border:1px solid rgba(42,107,110,.28);border-radius:10px;color:var(--ink);';

    var title = document.createElement('strong');
    title.textContent = '가격 데이터 상태';
    title.style.cssText = 'display:block;margin-bottom:10px;color:var(--teal);font-size:.9rem;';
    card.appendChild(title);

    var grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:auto 1fr;gap:7px 14px;font-size:.78rem;line-height:1.55;';
    [
      ['출처', '공개 자료 재검증 및 영수증 제보 수집 중'],
      ['상태 확인일', STATUS_DATE],
      ['표본 수', '0건 (공개 가능한 검토 완료 데이터 기준)'],
      ['실제 영수증 데이터', '아니오 — 데이터 축적 후 출처·지역·시점과 함께 공개']
    ].forEach(function (item) {
      var label = document.createElement('span');
      label.textContent = item[0];
      label.style.cssText = 'color:var(--mid);font-weight:700;';
      var value = document.createElement('span');
      value.textContent = item[1];
      grid.appendChild(label);
      grid.appendChild(value);
    });
    card.appendChild(grid);
    return card;
  }

  function addCard(container) {
    if (container && !container.querySelector('.price-data-status')) container.appendChild(makeStatusCard());
  }

  function hideGuidePriceRows() {
    document.querySelectorAll('.gstat').forEach(function (stats) {
      stats.querySelectorAll('.gstat-row').forEach(function (row) {
        var label = row.querySelector('.gstat-label');
        if (label && /(비용|처방)/.test(label.textContent)) row.hidden = true;
      });
      addCard(stats);
    });
  }

  function replaceHomePriceExamples() {
    var heatmap = document.getElementById('heatmap');
    if (!heatmap || heatmap.dataset.priceStatusApplied) return;
    heatmap.dataset.priceStatusApplied = 'true';
    heatmap.replaceChildren();

    var label = document.createElement('div');
    label.className = 'section-label';
    label.textContent = '가격 데이터 상태';
    var title = document.createElement('div');
    title.className = 'section-title';
    title.textContent = '영수증 기반 가격 데이터 준비 중';
    var description = document.createElement('div');
    description.className = 'section-sub';
    description.textContent = '예시 평균가나 추정 표본은 공개하지 않습니다. 실제 결제 데이터가 충분히 쌓인 뒤 출처와 함께 공개합니다.';
    heatmap.appendChild(label);
    heatmap.appendChild(title);
    heatmap.appendChild(description);
    addCard(heatmap);
  }

  function replacePriceSections() {
    document.querySelectorAll('.price-section').forEach(function (section) {
      var title = section.querySelector('.section-title');
      var description = section.querySelector('.section-sub');
      if (title) title.textContent = '영수증 기반 가격 데이터 준비 중';
      if (description) description.textContent = '현재는 공개 자료와 이용자 제보를 분리해 확인하고 있습니다. 검토 완료된 실제 결제 데이터만 출처·지역·시점과 함께 공개합니다.';
      section.querySelectorAll('.chart-row, .price-table-wrap').forEach(function (element) {
        element.style.display = 'none';
      });
      addCard(section);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    replaceHomePriceExamples();
    replacePriceSections();
    hideGuidePriceRows();
  });
})();
