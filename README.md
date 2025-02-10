# 바코드 스캔 웹페이지

## db 구성요소

### MSSQL

1. 서버 주소: 192.168.0.?\SQLEXPRESS:1433
2. su id: sa
3. su pw: nodo9993
4. 데이터베이스: MCERP
5. 활용 테이블
6. PDATRANSMIT, PDATRANSMITBACK,

### Postgresql

1. 서버 주소: localhost:5432
2. su id: postgres
3. su pw: kdrYULE@27
4. 데이터베이스 및 설명
  - login_db: 로그인을 위한 정보가 있는 데이터베이스
  - barcode_scan_db: 바코드를 스캔한 제품을 전송 받고, 전송하며, 백업하는 데이터베이스
  - standard_db: 제품 기준 수량 및 수율, 거래처 정보 등이 있는 대부분의 데이터에서 기준이 되는 데이터가 있는 데이터베이스
  - valid_prod_db: 검증을 거친 데이터를 연 단위로 저장하는 데이터베이스로 바코드 스캔 기능에서는 사용되지 않음
  - prod_list_db: 제품