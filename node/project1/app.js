// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// const path = require('path');

// const app = express();

// // 미들웨어 설정
// app.use(cors());
// app.use(express.json());
// app.use(express.static(path.join(__dirname, 'views')));  // HTML 파일이 있는 디렉토리
// app.use(express.static(path.join(__dirname, 'public'))); // 기타 정적 파일

// // API 엔드포인트
// app.post('/currentloc', async (req, res) => {
//     try {
//         const { latitude, longitude } = req.body;
//         console.log('Location:', { latitude, longitude });
//         res.json({ status: 'success', data: { latitude, longitude }});
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ status: 'error', message: error.message });
//     }
// });

// const PORT = 8000;
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });
const express = require("express");
const axios = require("axios");
const path = require("path");
const cors = require("cors");

const app = express();

// 정적 파일 제공 (예: HTML, CSS, JS)
app.use(express.static(path.resolve(__dirname, "public")));

// CORS 설정
app.use(cors());
app.use(express.json());

const PORT = 8000;

app.get("/", (req, res) => {
  res.send("서버 켜짐!");
});

// 위치(city, district)를 받아서 FastAPI 서버로 GET 요청 보내기
app.post("/aptsinkhole", async (req, res) => {
    const { city, district } = req.body;
  
    try {
      // GET 요청 시, 쿼리 스트링에 넣기
      const response = await axios.get(
        "/r_aptsinkhole",  // FastAPI 서버 주소
        {
          params: {
            sido: city,
            sigungu: district
          }
        }
      );
  
      // FastAPI 응답을 프론트에 그대로 전달
      res.json(response.data);
    } catch (error) {
      console.error("FastAPI 요청 오류:", error.message);
      res.status(500).send("FastAPI 서버 오류");
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
