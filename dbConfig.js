// 다 날려먹고 일시적으로 만든 거 손 볼 거 많다.

import mssql from 'mssql';
import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pkg;

// __dirname 설정 (ESM 환경 대응)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env 파일 로드 (루트의 상위 디렉토리에 위치)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// MSSQL 환경설정 (단일 DB)
const mssqlConfig = {
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  server: process.env.MSSQL_HOST,
  port: Number(process.env.MSSQL_PORT),
  database: process.env.MSSQL_DB_NAME,
  options: {
    encrypt: false, // 필요시 true 변경
    enableArithAbort: true,
  },
};

// PostgreSQL 환경설정 (여러 DB)
const pgDatabases = {
  login: process.env.PG_LOGIN_DB,
  barcodeScan: process.env.PG_BARCODE_SCAN_DB,
  standard: process.env.PG_STANDARD_DB,
};

const pgPools = new Map(); // DB별 Pool 저장

const getPgPool = (dbKey) => {
  if (!pgDatabases[dbKey]) {
    throw new Error(`❌ PostgreSQL DB 키 '${dbKey}'가 존재하지 않습니다.`);
  }

  if (!pgPools.has(dbKey)) {
    pgPools.set(
      dbKey,
      new Pool({
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: pgDatabases[dbKey], // 동적 선택
        password: process.env.PG_PASSWORD,
        port: Number(process.env.PG_PORT),
      })
    );
  }
  return pgPools.get(dbKey);
};

// MSSQL 연결 함수
const connectMSSQL = async () => {
  try {
    const pool = await mssql.connect(mssqlConfig);
    console.log('✅ MSSQL 연결 성공');
    return pool;
  } catch (err) {
    console.error('❌ MSSQL 연결 실패:', err);
    throw err;
  }
};

// PostgreSQL 쿼리 실행 함수
const queryPostgreSQL = async (dbKey, query, params = []) => {
  const pool = getPgPool(dbKey);
  const client = await pool.connect();
  try {
    const res = await client.query(query, params);
    return res.rows;
  } catch (err) {
    console.error(`❌ PostgreSQL '${dbKey}' 쿼리 실행 실패:`, err);
    throw err;
  } finally {
    client.release();
  }
};

export { connectMSSQL, queryPostgreSQL };
