// 임시

import express from 'express';
import path from 'path';
import { connectMSSQL, queryPostgreSQL } from './dbConfig.js';

const app = express();
const PORT = 3000;

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));

// 기본 페이지 제공
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// bscan 페이지 제공
app.get('/bscan.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'bscan.html'));
});

// ✅ MSSQL 연결 테스트
connectMSSQL()
    .then((pool) => {
        pool.request().query('SELECT 1 AS test', (err, result) => {
            if (err) console.error('❌ MSSQL 테스트 실패:', err);
            else console.log('✅ MSSQL 테스트 성공:', result.recordset);
        });
    })
    .catch((err) => console.error('❌ MSSQL 연결 실패:', err));

// ✅ PostgreSQL 연결 테스트 (로그인 DB)
queryPostgreSQL('login', 'SELECT 1 AS test')
    .then((rows) => console.log('✅ PostgreSQL 테스트 성공:', rows))
    .catch((err) => console.error('❌ PostgreSQL 테스트 실패:', err));

// 서버 실행
app.listen(PORT, () => {
    console.log(`🚀 서버가 실행 중: http://localhost:${PORT}`);
});
