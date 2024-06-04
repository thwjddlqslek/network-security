import React, { useEffect } from 'react';
import axios from 'axios';

function App() {
  useEffect(() => {
    // 서버에 요청을 보내고 응답을 콘솔에 출력합니다.
    axios.get('/api')
      .then(response => {
        console.log('서버 응답:', response.data);
      })
      .catch(error => {
        console.error('서버 요청 오류:', error);
      });
  }, []);

  return (
    <div className="App">
      <h1>네트워크 보안</h1>
    </div>
  );
}

export default App;