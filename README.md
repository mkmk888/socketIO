# Socket.IO
자바스크립트로 서버와 클라이언트를 세팅하고 실시간 채팅을 구현


# 개발환경
- Node.JS
  - express, babel, nodemon, pug
- Socket.IO


# Socket.IO(WebSocket)
- 웹 환경에서 하나의 연결을 통해 서버와 클라이언트간 양방향 통신을 제공하는 라이브러리
- 최초 http 통신으로 Socket 생성 후 생성된 Socket으로 실시간 무제한 양방향 통신

![wsInfo](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FD7H9g%2FbtrV6dPzOCG%2Fmmz0gCCsxzkbv903ptRX71%2Fimg.png)

# 실행 화면
### 같은 방에 있을 때
![test1](
ㄴ 채팅방에 있는 (왼쪽)1번, 2번 사용자와 채팅방 목록을 확인하고 입장하는 (오른쪽)3번 사용자


![test2](
ㄴ 채팅방 내에서 상대방에게 채팅이 송수신 되는 모습, 본인의 채팅은 You로 표시


![test3](
ㄴ 2번 ,3번 사용자가 방을 나가고 나갈때마다 방 인원수 갱신
### 다른 방에 있을 때


# 느낀 점
- 인터넷 방송이나 유튜브 실시간 방송에 사용되는 채팅방이 어떤 구조로 이루어져있고 어떻게 데이터를 주고 받는지 알 수 있었다.
- socket.on, socket.emit 이벤트가 서버와 클라이언트에서 공통적으로 사용된다는 점이 흥미로웠다.
- Websocket과 Socket.IO를 비교했을 때 Room, Admin UI, Automatic reconnection, HTTP long-polling fallback 등 여러가지 기능을 기본적으로 제공하는 Socket.IO가 더 좋아보였다.
