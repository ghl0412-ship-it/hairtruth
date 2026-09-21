# XSS 위험 목록

작성일: 2026-09-21  
범위: 정적 코드에서 `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`를 검색한 결과

## 판정 기준

- **High**: 사용자 또는 서버 데이터가 HTML 이스케이프 없이 문자열 결합으로 출력되는 지점
- **Medium**: 현재는 정적 데이터이지만 향후 API·DB 연결 시 사용자 데이터가 될 수 있는 지점
- **Low**: 코드 내부 상수만 출력하거나 숫자/선택값으로 강하게 제한된 지점

| 위험도 | 파일 및 위치 | 입력 또는 데이터 원천 | 출력 지점 | 현재 상태 및 필요한 조치 |
|---|---|---|---|---|
| High | `index.html:1408` | Q&A 카테고리, 작성자, 제목, 본문 | Q&A 목록 `innerHTML` | HTML 이스케이프 없이 출력. 서버 기능 재개 전 `textContent` 또는 DOMPurify 기반 sanitizer로 교체 필요. |
| High | `index.html:2381-2440` | 후기와 회원 데이터 | 관리자 후기·회원 목록 `innerHTML` | 관리자 검수 화면에 사용자 입력을 직접 출력. 현재 관리자 기능은 비활성화됨. 서버 기반 관리자 재구축 시 우선 수정 필요. |
| High | `index.html:2524-2550` | 관리자 병원 입력값 | 병원 관리 목록 `innerHTML` | 병원명·전화·메모가 직접 출력됨. 관리자 기능 재개 전 안전한 DOM 생성으로 변경 필요. |
| High | `index.html:3608-3630` | 후기 닉네임, 병원명, 치료명, 금액, 본문, 영수증 URL | 후기 카드 `innerHTML` | 공개 후기의 저장형 XSS 위험. 현재 후기 작성·승인은 비활성화됨. |
| High | `index.html:3641-3700` | 후기에서 집계된 병원명·치료명·지역 | 병원 카드·랭킹 표 `innerHTML` | 후기 입력값이 다시 HTML로 출력됨. API 전환 전에 수정 필요. |
| High | `index.html:4237-4252` | 치료 타임라인 내용·비용·메모 | 개인 치료기록 `innerHTML` | 민감 건강정보를 포함할 수 있음. 서버 전환 시 비공개 권한 검사와 함께 textContent 렌더링 필요. |
| High | `index.html:4384-4405` | 후기 상세 정보와 영수증 URL | 후기 상세 `innerHTML` | 후기 카드와 동일한 저장형 XSS 위험. |
| High | `qa.html:558-605` | 질문·답변 작성자와 본문 | Q&A 상세·목록 `innerHTML` | 현재 Q&A 쓰기는 베타 안내로 비활성화됨. 재개 전 safe rendering 필요. |
| High | `reviews.html:484-535` | 승인 후기 데이터 | 후기 상세·목록 `innerHTML` | 공통 후기 데이터가 서버로 전환되면 저장형 XSS 위험. |
| Medium | `shared.js:279` | 비교 목록 객체 | 병원 비교 표 `innerHTML` | 현재 선택 병원은 정적 목록이지만 localStorage 변조 또는 API 연결 시 위험. |
| Medium | `index.html:2220-2228`, `4563`, `4589`, `4631` | 병원 객체와 지도 정보 | 병원 상세·지도 팝업·목록 | 현재 코드 내 정적 데이터 중심. 병원 CMS/API 연결 전 이스케이프 처리 필요. |
| Low | `price.html:566-581`, `hospitals.html:337-399`, `ranking.html:473` | 코드 내 정적 가격·병원·탭 값 | 페이지 UI `innerHTML` | 현재 외부 사용자 입력이 아님. 데이터 외부화 시 재분류 필요. |
| Low | `index.html:2257`, `2268`, `2786-2852`, `3210`, `3394` | 코드 내부 안내문·제한된 선택값 | 토스트·확인창·지역 선택·자가진단 | 현재 직접 사용자 입력을 출력하지 않음. `showToast` 호출에 외부 오류 원문을 넘기지 않도록 유지 필요. |

## 공통 수정 원칙

1. 일반 텍스트는 문자열 HTML 조합 대신 `textContent`와 `document.createElement()`로 출력한다.
2. 사용자 작성 Markdown/HTML이 꼭 필요하면 DOMPurify 등 검증된 sanitizer에 허용 태그·속성 목록을 적용한다.
3. `href`, `src`, inline event handler, CSS 값은 텍스트 노드와 별도의 allowlist 검증을 적용한다.
4. 서버 재구축 후에는 XSS 회귀 테스트를 후기, Q&A, 병원 CMS, 관리자 검수 흐름에 추가한다.

현재 P0에서는 후기·회원·관리자·업로드 기능을 비활성화했다. 이 목록의 High 항목은 해당 기능을 서버 기반으로 재개하기 전 반드시 수정해야 한다.
