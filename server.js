import express from 'express';
import path from 'path';
import session from 'express-session';
import { queryPostgreSQL } from './dbConfig.js';

const app = express();
const PORT = 3000;

const __dirname = path.resolve();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, 'public')));  // 기존 public 폴더
app.use(express.static(path.join(__dirname, 'scan')));   // 🔥 scan 폴더 추가

app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// 로그인 페이지 제공 (이미 로그인한 경우 대시보드로 리디렉트)
app.get('/', (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard'); // 로그인한 상태라면 대시보드로 이동
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 대시보드 (바코드 스캔 페이지)
app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/'); // 로그인 안 한 경우 로그인 페이지로 리디렉트
    }
    res.sendFile(path.join(__dirname, 'scan', 'bscan.html'));
});

// 현재 로그인한 사용자 정보 반환 (AJAX 요청용)
app.get('/user-info', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: '로그인 필요' });
    }
    res.json({ username: req.session.user.username });
});

// 로그인 처리
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const users = await queryPostgreSQL(
            'login',
            'SELECT username, password_hash FROM account_list_tbl WHERE username = $1',
            [username]
        );

        if (users.length === 0 || users[0].password_hash !== password) {
            return res.status(401).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
        }

        req.session.user = { username: users[0].username };
        res.json({ success: true });
    } catch (err) {
        console.error('❌ 로그인 오류:', err);
        res.status(500).json({ message: '서버 오류' });
    }
});

// 로그아웃 처리
app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true });
    });
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
