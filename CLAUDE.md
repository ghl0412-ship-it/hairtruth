# 헤어트루스 (hairtruth.kr) 작업 안내

이 폴더는 hairtruth.kr 사이트의 원본이다. GitHub 저장소 `ghl0412-ship-it/hairtruth`의 `main` 브랜치에 올리면(push) GitHub Pages가 1~2분 안에 hairtruth.kr에 반영한다. 따로 빌드 과정은 없다.

## 사용자

- 하람. 1인 창업자이고 개발자가 아니다. 반말로 편하게, 초보자 말로 설명한다.
- 어려운 용어는 괄호로 쉬운 설명을 붙인다. 예: 커밋(변경 내용을 저장소에 기록하는 것)
- 모든 화면 문구는 한국어로 쓴다.

## 배포

- 배포는 반드시 `/deploy` 명령으로 한다. 순서와 금지 사항은 `.claude/commands/deploy.md`에 있다.
- `npm.cmd test`가 통과하지 않으면 절대 올리지 않는다.
- 강제 푸시(`git push --force`)와 검사 건너뛰기는 하지 않는다.

## 절대 어기면 안 되는 개발 규칙

1. 다크모드를 추가하지 않는다.
2. CSS 변수(`--ink`, `--teal`, `--accent`, `--cream` 등)를 유지한다.
3. 글꼴은 Noto Sans KR, Noto Serif KR, DM Mono를 유지한다.
4. 병원 카드는 지하철역+거리 / 시술명 / 할인율+가격 / 별점 구성을 유지한다.
5. 기존 기능을 깨뜨리지 않는다.
6. 광고 모델을 넣지 않는다. 모든 후기는 영수증 인증이 원칙이다.

## 보안 (README.md 참고)

- 브라우저 `localStorage`로 회원, 로그인, 관리자 권한을 다루는 코드를 다시 넣지 않는다.
- 관리자 비밀번호나 관리자 판별 값을 코드에 적지 않는다.
- 로그인, 회원가입, 후기 승인 같은 기능은 서버가 준비될 때까지 "베타 데이터 수집 준비 중" 안내 상태로 둔다.
- 사용자 입력을 `innerHTML`로 출력하지 않는다. `XSS_RISK_REGISTER.md`를 먼저 읽는다.
- `scripts/static-check.mjs`가 위 내용을 자동으로 검사한다. 검사를 느슨하게 고쳐서 통과시키지 않는다.

## 파일

- `index.html` 첫 화면. 그 밖에 `hospitals.html`, `ranking.html`, `price.html`, `guide.html`, `reviews.html`, `qa.html`, `terms.html`, `privacy.html`
- `shared.js` 여러 페이지가 함께 쓰는 코드
- `index-redesign.html` 첫 화면 디자인 시안. 배포 대상이 아니다(`.gitignore`에 등록됨). 하람이 "시안 적용해줘"라고 하면 `index.html`을 이 파일 내용으로 바꾸고 `npm.cmd test`를 통과시킨 뒤 `/deploy`로 올린다.
- `CNAME` 도메인 연결 파일. 건드리지 않는다.
