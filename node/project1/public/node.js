const express = require("express");
const axios = require('axios');
const app = express();

app.get('/', (req, res) => {
  res.send("Web Server Started...");
});

app.get('/hello', (req, res) => {
  res.send({ data: 'Hello World!!' });
});

// 싱크홀 정보 가져오기 (FastAPI 서버에서)
let option1 = 'http://192.168.1.39:3000/r_aptsinkhole';
app.get('/sinkhole', async (req, res) => {
  const { sido, sigungu } = req.query;

  try {
    const response = await axios.get(option1, {
      params: { sido, sigungu }
    });

    res.send(response.data);
  } catch (err) {
    console.error("싱크홀 API 호출 오류:", err.message);
    res.status(500).send({ error: '싱크홀 데이터 불러오기 실패' });
  }
});
// 서버 실행
app.listen(8000, function () {
    console.log("8000 port : Server Started~!!");
  });
  