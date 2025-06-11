// routes/main.js
const express = require('express');
const router = express.Router(); // 라우터 인스턴스
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// .env는 app.js에서 로드되므로 여기서 다시 로드할 필요가 없습니다.

const AWS = require('aws-sdk');
const ID = process.env.ID;
const SECRET = process.env.SECRET;
const BUCKET_NAME = 'kibwa-06'; // 사용하는 S3 버킷 이름
const MYREGION = 'ap-northeast-3'; // S3 버킷이 위치한 리전
const s3 = new AWS.S3({ accessKeyId: ID, secretAccessKey: SECRET, region: MYREGION });

// Multer 스토리지 설정: 로컬 디스크에 파일 저장
var storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploadedFiles/');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});
var upload = multer({ storage: storage });

// LLM을 사용하여 오디오 분석을 시뮬레이션하는 함수
// 실제 오디오 분석은 복잡하며, 여기서는 LLM을 사용하여 더미 데이터를 생성합니다.
async function simulateAudioAnalysis(filename) {
    // 실제 LLM 호출 (Gemini 2.0 Flash 예시)
    const prompt = `Given an audio file named '${filename}', simulate an audio analysis for speech rate and filler words. Provide a JSON object with 'speechRate' (integer, words per minute, e.g., 120-180) and 'fillerWordsCount' (integer, e.g., 0-10). Make sure to vary the values slightly for different filenames.`;
    
    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = {
        contents: chatHistory,
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    "speechRate": { "type": "NUMBER" },
                    "fillerWordsCount": { "type": "NUMBER" }
                },
                required: ["speechRate", "fillerWordsCount"]
            }
        }
    };
    const apiKey = ""; // API 키는 Canvas 런타임에서 자동으로 제공됩니다.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const jsonString = result.candidates[0].content.parts[0].text;
            console.log("LLM raw response:", jsonString); // LLM의 원시 응답 로깅
            try {
                const parsedJson = JSON.parse(jsonString);
                // LLM이 숫자를 문자열로 반환할 수 있으므로 숫자로 변환 보장
                parsedJson.speechRate = parseFloat(parsedJson.speechRate);
                parsedJson.fillerWordsCount = parseFloat(parsedJson.fillerWordsCount);
                return parsedJson;
            } catch (parseError) {
                console.error("LLM 응답 파싱 오류:", parseError, "응답:", jsonString);
                // 파싱 실패 시 기본값 또는 오류 반환
                return { speechRate: Math.floor(Math.random() * 60) + 120, fillerWordsCount: Math.floor(Math.random() * 10) };
            }
        } else {
            console.warn("LLM 응답이 예상 구조와 다릅니다.", result);
            return { speechRate: Math.floor(Math.random() * 60) + 120, fillerWordsCount: Math.floor(Math.random() * 10) };
        }
    } catch (error) {
        console.error("LLM 호출 오류:", error);
        // 오류 발생 시 랜덤 더미 데이터 반환
        return { speechRate: Math.floor(Math.random() * 60) + 120, fillerWordsCount: Math.floor(Math.random() * 10) };
    }
}


// --- 라우터 정의 ---

// 기본 경로('/') GET 요청: 파일 업로드 폼을 렌더링
router.get('/', function (req, res) {
    res.render('upload'); // public/upload.ejs 파일을 렌더링
});

// S3 파일 목록 GET 요청 ('/list'): S3 버킷의 객체 목록을 가져와 HTML 테이블로 렌더링
router.get('/list', (req, res) => {
    const params = {
        Bucket: BUCKET_NAME,
        Delimiter: '/',
        Prefix: 'uploadedFiles/', // 'uploadedFiles/' 접두사로 시작하는 객체만 리스팅
    };

    s3.listObjects(params, function (err, data) {
        if (err) {
            console.error("S3 listObjects 오류:", err);
            return res.status(500).send("<h1>Error!</h1><p>S3 객체 목록을 가져오는 데 실패했습니다.</p><pre>" + err.message + "</pre>");
        }

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        let template = `
            <!doctype html>
            <html>
            <head>
                <title>S3 파일 목록</title>
                <meta charset="utf-8">
                <style>
                    body { font-family: sans-serif; margin: 0; padding: 0; }
                    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; word-break: break-all; }
                    th { background-color: #f2f2f2; }
                    .audio-player { width: 100%; max-width: 200px; }
                    button { background-color: #007bff; color: white; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8em; }
                    button:hover { background-color: #0056b3; }
                    form { display: inline; margin: 0; padding: 0; }
                </style>
            </head>
            <body>
                <table border="1">
                    <tr>
                        <th>Key</th>
                        <th>LastModified</th>
                        <th>Size (Bytes)</th>
                        <th>StorageClass</th>
                        <th>재생</th>
                        <th>다운로드</th>
                        <th>삭제</th>
                    </tr>
        `;

        if (data.Contents && data.Contents.length > 0) {
            data.Contents.forEach(item => {
                if (item.Key === params.Prefix || item.Size === 0) {
                    return; // 폴더 자체이거나 빈 파일은 건너뛰기
                }
                const filename = item.Key;
                const fileurl = `https://${BUCKET_NAME}.s3.${MYREGION}.amazonaws.com/${encodeURIComponent(filename)}`;

                template += `
                    <tr>
                        <td>${filename}</td>
                        <td>${item['LastModified']}</td>
                        <td>${item['Size']}</td>
                        <td>${item['StorageClass']}</td>
                        <td>
                            <audio controls class="audio-player">
                                <source src="${fileurl}" type="audio/mpeg">
                                Your browser does not support the audio element.
                            </audio>
                        </td>
                        <td>
                            <form method='post' action='/downloadFile'>
                                <button type='submit' name='dlKey' value="${filename}">Down</button>
                            </form>
                        </td>
                        <td>
                            <form method='post' action='/deleteFile'>
                                <button type='submit' name='dlKey' value="${filename}">Del</button>
                            </form>
                        </td>
                    </tr>
                `;
            });
        } else {
            template += `<tr><td colspan="7">업로드된 파일이 없습니다.</td></tr>`;
        }

        template += `
                </table>
            </body>
            </html>
            `;
        res.end(template);
    });
});

// 파일 업로드 POST 요청 ('/uploadFile'): 로컬에 저장 후 S3에 업로드, 로컬 파일 삭제
router.post('/uploadFile', upload.single('attachment'), async (req, res) => {
    if (!req.file) {
        return res.status(400).render('confirmation', { file: { error: '업로드할 파일이 없습니다.' }, files: null });
    }

    const localFilename = req.file.filename;
    const localFilePath = path.join(__dirname, '../uploadedFiles', localFilename);
    const s3Key = `uploadedFiles/${localFilename}`; // S3 Key는 로컬 파일의 이름을 사용

    try {
        const fileContent = fs.readFileSync(localFilePath); // 동기적 파일 읽기

        const params = {
            Bucket: BUCKET_NAME,
            Key: s3Key,
            Body: fileContent,
            ContentType: req.file.mimetype || 'application/octet-stream',
            // ACL: 'public-read' // <-- 제거: S3 버킷 정책으로 공개 접근 관리
        };

        const s3UploadResult = await new Promise((resolve, reject) => {
            s3.upload(params, (err, data) => {
                if (err) {
                    console.error("S3 업로드 오류:", err);
                    reject(err);
                } else {
                    console.log(`File uploaded to S3 successfully. ${data.Location}`);
                    resolve(data);
                }
            });
        });

        fs.unlink(localFilePath, err => { // 로컬 파일 삭제
            if (err) console.error(`Local file delete error: ${err}`);
            else console.log(`Local file deleted successfully: ${localFilePath}`);
        });

        res.render('confirmation', { file: s3UploadResult, files: null });

    } catch (error) {
        console.error('파일 업로드 및 S3 처리 중 오류 발생:', error);
        res.status(500).render('confirmation', { file: { error: error.message || '파일 업로드 실패' }, files: null });
    }
});

// 파일 다운로드 POST 요청 ('/downloadFile')
router.post('/downloadFile', async (req, res) => {
    const filename = req.body.dlKey;
    console.log(`Downloading file: ${filename}`);

    const params = {
        Bucket: BUCKET_NAME,
        Key: filename,
    };

    try {
        const data = await s3.getObject(params).promise();
        res.attachment(filename.split('/').pop()); // S3 Key에서 파일명만 추출
        res.send(data.Body);
    } catch (err) {
        console.error(`Download error for ${filename}:`, err);
        res.status(500).send(`파일 다운로드 중 오류가 발생했습니다: ${err.message}`);
    }
});

// 파일 삭제 POST 요청 ('/deleteFile')
router.post('/deleteFile', async (req, res) => {
    const filename = req.body.dlKey;
    console.log(`Deleting file: ${filename}`);

    const params = {
        Bucket: BUCKET_NAME,
        Key: filename,
    };

    try {
        await s3.deleteObject(params).promise();
        console.log(`File deleted from S3: ${filename}`);
        res.redirect('/list');
    } catch (err) {
        console.error(`Delete error for ${filename}:`, err);
        res.status(500).send(`파일 삭제 중 오류가 발생했습니다: ${err.message}`);
    }
});

// --- 파일 비교 POST 라우트 ---
router.post('/compareAudio', async (req, res) => {
    const { file1Key, file2Key } = req.body;

    if (!file1Key || !file2Key) {
        return res.status(400).render('comparison_result', { error: '비교할 두 파일을 모두 선택해주세요.', result: null });
    }

    if (file1Key === file2Key) {
        return res.status(400).render('comparison_result', { error: '동일한 파일을 선택할 수 없습니다.', result: null });
    }

    try {
        console.log(`Comparing: ${file1Key} vs ${file2Key}`);
        
        // 파일1 분석 시뮬레이션
        const analysis1 = await simulateAudioAnalysis(file1Key);
        console.log(`Analysis for ${file1Key}:`, analysis1);

        // 파일2 분석 시뮬레이션
        const analysis2 = await simulateAudioAnalysis(file2Key);
        console.log(`Analysis for ${file2Key}:`, analysis2);

        // 비교 결과 계산
        const comparisonResult = {
            file1: { key: file1Key, ...analysis1 },
            file2: { key: file2Key, ...analysis2 },
            speechRateChange: analysis2.speechRate - analysis1.speechRate,
            fillerWordsChange: analysis2.fillerWordsCount - analysis1.fillerWordsCount
        };

        // comparison_result.ejs 템플릿 렌더링
        res.render('comparison_result', { result: comparisonResult, error: null });

    } catch (error) {
        console.error("오디오 파일 비교 중 오류 발생:", error);
        res.status(500).render('comparison_result', { error: `오디오 파일 비교 중 오류가 발생했습니다: ${error.message}`, result: null });
    }
});


module.exports = router; // router 인스턴스를 내보내기
