const express = require("express");
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//서버 테스트
app.get('/', (req, res) => {
  res.send("Web Server Started...");
});

app.get('/hello', (req, res) => {
  res.send({ data: 'Hello World!!' });
});

// 2.싱크홀 위치정보
let option2 = 'http://192.168.1.39:3000/r_aptsinkhole';
app.get('/sinkhole', async (req, res) => {
  const { sido, sigungu } = req.query;

  try {
    const response = await axios.get(option2, {
      params: { sido, sigungu }
    });

    // 응답이 배열이면 list로 감싸서 보내기
    if (Array.isArray(response.data)) {
      res.send({ list: response.data });
    } else {
      res.send(response.data);
    }
  } catch (err) {
    console.error("싱크홀 API 호출 오류:", err.message);
    res.status(500).send({ error: '싱크홀 데이터 불러오기 실패' });
  }
});

// 서버 실행
app.listen(8000, function () {
  console.log("8000 port : Server Started~!!");
});

