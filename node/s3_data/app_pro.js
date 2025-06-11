require('dotenv').config()
const express = require('express')
const AWS = require('aws-sdk')

const ID = process.env.ID
const SECRET = process.env.SECRET
const MYREGION = 'ap-northeast-3'

const multer = require('multer')
const { memoryStorage } = require('multer')
const storage = memoryStorage()
const upload = multer({ storage })

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    region : MYREGION
})

const uploadAudio = (filename, bucketname, file) => {
    return new Promise((resolve, reject) => {
        const params = {
            Key: filename,
            Bucket: bucketname,
            Body: file,
            ContentType: 'audio/mpeg',
        }

        s3.upload(params, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data.Location)
            }
        })
    })
}

const bucket = 'kibwa-06'

app.post('/upload', upload.single('audiofile'), async (req, res) => {
    const filename = 'my 3rd upload'
    const bucketname = 'kibwa-06'
    const file = req.file.buffer
    console.log(file)
    const link = await uploadAudio(filename, bucketname, file)
    console.log(link)
    res.send('uploaded successfully ...')
})

app.listen(8000, () => {
    console.log('Server is running on port 8000')
})