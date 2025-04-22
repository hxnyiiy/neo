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

// 1.현재 위치 파악
// let option1 = 'http://192.168.1.39:3000/r_currentloc';
// app.post('/currentloc', async (req, res) => {
//   try {
//     const { latitude, longitude } = req.body;
//     console.log('Location:', { latitude, longitude });
//     const response = await axios.post(option1, {
//       latitude,longitude
//     });
//     console.log(response.data)
//     res.send({
//       result: response.data,
//       status: 'success'
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send({
//       error: error.message,
//       status: 'error'
//     });
//   }
// });

// 2.싱크홀 위치정보
let option2 = 'http://192.168.1.39:3000/r_aptsinkhole';
app.get('/sinkhole', async (req, res) => {
  const { sido, sigungu } = req.query;

  try {
    const response = await axios.get(option2, {
      params: { sido, sigungu }
    });

    res.send(response.data);
  } catch (err) {
    console.error("싱크홀 API 호출 오류:", err.message);
    res.status(500).send({ error: '싱크홀 데이터 불러오기 실패' });
  }
});

// 3.아파트 매매가
let option3 = 'http://192.168.1.39:3000/r_aptsinkholes';
app.get('/aptTrade', async (req, res) => {
  const { sido, sigungu, umdNm, roadNm, aptNm, deal_ym } = req.query;

  try {
    const response = await axios.get(option3, {
      params: {
        sido,
        sigungu,
        umdNm,
        roadNm,
        aptNm,
        deal_ym
      }
    });

    res.send(response.data);
  } catch (err) {
    console.error("아파트 거래 API 호출 오류:", err.message);
    res.status(500).send({ error: '아파트 거래 데이터 불러오기 실패' });
  }
});

// 서버 실행
app.listen(8000, function () {
  console.log("8000 port : Server Started~!!");
});

