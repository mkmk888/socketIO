# webRTC
자바스크립트로 서버와 클라이언트를 세팅하고 실시간 채팅을 구현


# 개발환경
- Node.JS
  - express, babel(호환성), nodemon(개발 중 서버 자동 재시작), pug
- Socket.IO(텍스트 채팅)
- webRTC(음성, 비디오)


# Socket.IO(WebSocket)
- 웹 환경에서 하나의 연결을 통해 서버와 클라이언트간 양방향 통신을 제공하는 라이브러리
- http 통신으로 소켓 생성 후 생성된 소켓으로 실시간 양방향 통신

![wsInfo](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FD7H9g%2FbtrV6dPzOCG%2Fmmz0gCCsxzkbv903ptRX71%2Fimg.png)


# webRTC
- 웹 환경에서 음성, 영상, 데이터에 대해 실시간 P2P 통신을 제공하는 웹 API
- 서버에 시그널링을 통해 통신할 상대방과 정보를 교환 후 webRTC를 사용해 PeerConnection을 생성 후 생성된 커넥션으로 실시간 양방향 통신
![rtcInfo](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2F2SdGP%2FbtrV48hpj2T%2FGkvRHyjVUdGUajkhttbFh1%2Fimg.png)

- STUN : 단말이 자신의 공인 IP주소와 포트를 확인하는 과정에 대한 프로토콜
- IceCandidate : P2P간 통신 스트림을 생성하는 프로토콜
