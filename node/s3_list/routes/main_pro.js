const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const env = require('dotenv').config();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false }))
app.use(express.json())
app.use(express.urlencoded({ extended : true }))

const AWS = require('aws-sdk');
const ID = process.env.ID;
const SECRET = process.env.SECRET;
const BUCKET_NAME = 'kibwa-06';
const MYREGION = 'ap-northeast-3';
const s3 = new AWS.S3({ accessKeyId: ID, secretAccessKey: SECRET, region: MYREGION });

app.get('/list', (req, res) => {
    const params = {
        Bucket : BUCKET_NAME,
        Delimiter : '/',
        Prefix : '',
    }
    s3.listObjects(params, function(err, data) {
        if (err) throw err;

        // res.json(data.Contents)
        res.writeHead(200);
        let template = `
            <!doctype html>
            <html>
            <head>
                <title>Result</title>
                <meta charset="utf-8">
            </head>
            <body>
                <table border="1" margin: auto; text-align: center;>
                    <tr>
                        <th> Key </th>
                        <th> LastModified </th>
                        <th> Size </th>
                        <th> StorageClass </th>
                        <th> Play Button </th>
                    </tr>
        `;
        for (var i = 1; i < data.Contents.length; i++) {
            const key = data.Contents[i].Key;
            const fileurl = `https://${BUCKET_NAME}.s3.${MYREGION}.amazonaws.com/${encodeURIComponent(key)}`;
          template += `
                    <tr>
                        <th> ${data.Contents[i]['Key']} </th>
                        <th> ${data.Contents[i]['LastModified']} </th>
                        <th> ${data.Contents[i]['Size']} </th>
                        <th> ${data.Contents[i]['StorageClass']} </th>
                        <th>
                          <audio controls>
                            <source src="${fileurl}" type="audio/mpeg">
                            Your browser does not support the audio element.
                          </audio>
                    </tr>
            `;
        }
        template += `
                </table>
            </body>
            </html>
            `;
        res.end(template);
      });
    });

module.exports = app;