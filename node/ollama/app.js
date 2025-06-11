const express = require('express');
const path = require('path');
const app = express();
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// 핵심 수정 부분
app.set('views', path.join(__dirname, 'views')); // views (복수형) 확인!
app.set('view engine', 'html'); // 'html' 확장자를 뷰 엔진으로 사용
app.engine('html', require('ejs').renderFile); // .html 파일은 EJS로 렌더링

const mainRouter = require('./controllers/mainController');
app.use('/', mainRouter);

app.listen(PORT, () => {
    console.log(`Ollama Web Interface server running on http://localhost:${PORT}`);
});