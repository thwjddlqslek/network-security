const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(session({
  secret: 'thisIsSecret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // HTTPS를 사용하지 않는 경우 false로 설정
}));

app.get('/', (req, res) => {
  if (req.session.viewCount) {
    req.session.viewCount++;
  } else {
    req.session.viewCount = 1;
  }
  res.send(`페이지를 ${req.session.viewCount}번 방문했습니다.`);
});


// API 라우트 추가
app.get('/api', (req, res) => {
  // 클라이언트로 보낼 응답
  res.json({ message: 'API 테스트 성공' });
});

// 정적 파일 제공 (React 빌드 파일)
app.use(express.static(path.join(__dirname, 'client/src')));

// 모든 GET 요청이 /api로 시작하지 않을 때, React 애플리케이션을 제공합니다.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/src', 'App.jsx'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
