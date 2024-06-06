import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [sessionID, setSessionID] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/login', { username, password }, { withCredentials: true })
      .then(response => {
        console.log('서버 응답:', response.data);
        setSessionID(response.data.sessionID);
        setLoginStatus('로그인 성공');
      })
      .catch(error => {
        console.error('서버 요청 오류:', error);
        setLoginStatus('로그인 실패');
      });
  };

/*   useEffect(() => {
    axios.get('http://localhost:5000/api', { withCredentials: true })
      .then(response => {
        console.log('서버 응답:', response.data);
        setSessionID(response.data.sessionID);
      })
      .catch(error => {
        console.error('서버 요청 오류:', error);
      });
  }, []); */

  return (
    <div className="App">
      <h1>네트워크 보안</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username: </label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password: </label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">로그인</button>
      </form>
      <p>{loginStatus}</p>
      {sessionID && <p>현재 세션 ID: {sessionID}</p>}
    </div>
  );
}

export default App;
