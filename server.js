const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(session({
  secret: 'thisIsSecret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

const users = {
  user1: { password: 'password1', role: 'admin' },
  user2: { password: 'password2', role: 'user' }
};

// 로그인 엔드포인트
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (user && user.password === password) {
    req.session.userID = username;
    req.session.role = user.role;
    res.header('X-Session-ID', req.sessionID);
    res.status(200).json({ success: true, sessionID: req.sessionID, userID: username });
  } else {
    res.status(401).json({ success: false, message: '인증 실패' });
  }
});

// 로그아웃 엔드포인트
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: '로그아웃 실패' });
    }
    res.status(200).json({ success: true, message: '로그아웃 성공' });
  });
});

// 세션 테스트를 위한 경로
app.get('/', (req, res) => {
  if (req.session.viewCount) {
    req.session.viewCount++;
  } else {
    req.session.viewCount = 1;
  }
  res.send(`페이지를 ${req.session.viewCount}번 방문했습니다. 세션 ID: ${req.sessionID}`);
});

// API 라우트 추가
app.get('/api', (req, res) => {
  if (req.session.userID) {
    res.json({ message: 'API 테스트 성공', sessionID: req.sessionID });
  } else {
    res.status(401).json({ message: '로그인 필요' });
  }
});

// 정적 파일 제공 (React 빌드 파일)
app.use(express.static(path.join(__dirname, 'client/build')));

// 모든 GET 요청이 /api로 시작하지 않을 때, React 애플리케이션을 제공합니다.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
