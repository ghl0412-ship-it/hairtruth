---
description: 검사를 통과한 변경만 hairtruth.kr에 배포한다
argument-hint: "[변경 내용 한 줄 설명]"
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git fetch:*), Bash(npm.cmd test), Bash(npm test)
---

hairtruth.kr 배포를 진행한다. 아래 순서를 하나도 건너뛰지 않는다. 하람은 개발자가 아니므로 각 단계 결과를 한두 문장의 쉬운 말로 알려준다.

사용자가 적은 설명: $ARGUMENTS

## 1. 상태 확인

- `git status --short`와 `git diff --stat`으로 바뀐 파일을 확인한다.
- 바뀐 파일이 없으면 "올릴 변경이 없다"고 알리고 끝낸다.
- `git fetch origin` 후 원격(`origin/main`)에 내 컴퓨터에 없는 변경이 있으면 멈추고 하람에게 알린다. 강제로 덮어쓰지 않는다.

## 2. 검사

- `npm.cmd test`를 실행한다(Windows가 아니면 `npm test`).
- 하나라도 실패하면 **여기서 멈춘다.** 실패 항목을 쉬운 말로 설명하고, 어떤 파일의 어떤 부분 때문인지 찾아서 알려준다.
- 검사 스크립트(`scripts/static-check.mjs`)를 고쳐서 통과시키는 것은 금지다.
- 실패 원인이 "예전 버전 파일로 덮어쓴 것"으로 보이면, 고치기 전에 `git diff`로 사라지는 내용을 보여주고 하람에게 되돌릴지 먼저 묻는다.

## 3. 올릴 내용 확인

- 바뀐 파일 목록과 각 파일에서 무엇이 달라졌는지 한 줄씩 정리해서 보여준다.
- 다음 파일은 올리지 않는다: `index-redesign.html`(시안), `_to_delete/`, 비밀번호나 키가 들어간 파일.
- 화면 문구 중 사실과 다른 숫자나 주장(예: 후기 0건인데 "100% 인증")이 새로 들어갔으면 알려준다.
- "이대로 올릴까?"라고 묻고, 하람이 좋다고 해야 다음으로 간다.

## 4. 기록하고 올리기

- 올릴 파일만 이름을 적어서 `git add <파일>`한다. `git add .`는 쓰지 않는다.
- `git commit -m "<종류>: <한국어 설명>"` 형식으로 기록한다. 종류는 `feat`(새 기능), `fix`(고침), `style`(디자인), `docs`(문서) 중 하나.
- `git push origin main`으로 올린다. `--force`는 절대 쓰지 않는다.
- 푸시가 거절되면 멈추고 이유를 설명한다.

## 5. 반영 확인

- 1~2분 기다린 뒤 https://hairtruth.kr 을 열어 바뀐 내용이 보이는지 확인한다.
- 하람에게 올라간 내용, 커밋 번호 앞 7자리, 확인 결과를 알려준다.
- 문제가 생기면 `git revert <커밋번호>`(그 변경만 취소하는 새 기록을 만드는 명령) 후 다시 올리는 방법을 제안한다. `git reset --hard`는 쓰지 않는다.
