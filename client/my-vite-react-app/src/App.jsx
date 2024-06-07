import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [sessionID, setSessionID] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('');
  const isLoginButtonEnabled = username.trim() !== '' && password.trim() !== '';

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/login', { username, password }, { withCredentials: true })
      .then(response => {
        console.log('서버 응답:', response.data);
        if (response.data.sessionID) {
          console.log('Session ID:', response.data.sessionID);
          setSessionID(response.data.sessionID);

          if (username === 'user1') {
            setLoginStatus('관리자 로그인 성공');
          } else if (username === 'user2') {
            setLoginStatus('이용자 로그인 성공');
          } else {
            setLoginStatus('로그인 성공');
          }
        } else {
          console.error('서버 응답에 sessionID가 없습니다.');
          setLoginStatus('로그인 실패');
        }
      })
      .catch(error => {
        console.error('서버 요청 오류:', error);
        setLoginStatus('로그인 실패');
      });
  };

  const handleLogout = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/logout', null, { withCredentials: true })
      .then(response => {
        console.log('서버 응답:', response.data);
        setSessionID(null);
        setLoginStatus('로그아웃 성공');
      })
      .catch(error => {
        console.error('서버 요청 오류:', error);
      });
  };

  return (
    <div className='final-container'>
      <p className="title1">Network Security Project</p>
      <p className="title2">Session Hijacking🍪</p>
      <div className="container">
        <form onSubmit={handleLogin} className="form">
          <div className="form-group">
            <label className="label">Username</label>
            <input type="text" className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button onClick={handleLogout} className="logout-button" disabled={!isLoginButtonEnabled}>LOGOUT</button>
          <button type="submit" className="login-button" disabled={!isLoginButtonEnabled}>LOGIN</button>
        </form>
        <p className="login-status">{loginStatus}</p>
        {sessionID && <p className="session-id">현재 세션 ID: {sessionID}</p>}
      </div>
    </div>
  );
}

export default App;
