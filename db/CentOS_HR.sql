CREATE TABLE shop.usertbl (
	userid char(8) NOT NULL PRIMARY KEY,
	username nvarchar2(20) NOT NULL,
	birthyear number(4) NOT NULL,
	addr nchar(2) NOT NULL,
	mobile1 char(3),
	mobile2 char(8),
	height number(3),
	mdate	date
) ;

insert into shop.usertbl values('LSG', '이승기', 1987, '서울', '011', '11111111', 182, '2008-8-8');
insert into shop.usertbl values('KBS', '김범수', 1979, '경남', '011', '22222222', 173, '2012-4-4');
insert into shop.usertbl values('KKH', '김경호', 1971, '전남', '019', '33333333', 177, '2007-7-7');
insert into shop.usertbl values('JYP', '조용필', 1950, '경기', '011', '44444444', 166, '2009-4-4');
insert into shop.usertbl values('SSK', '성시경', 1979, '서울', NULL, NULL, 186, '2013-12-12');
insert into shop.usertbl values('LJB', '임재범', 1963, '서울', '016', '66666666', 182, '2009-9-9');
insert into shop.usertbl values('YJS', '윤종신', 1969, '경남', NULL, NULL, 170, '2005-5-5');
insert into shop.usertbl values('EJW', '은지원', 1972, '경북', '011', '88888888', 174, '2014-3-3');
insert into shop.usertbl values('JKW', '조관우', 1965, '경기', '018', '99999999', 172, '2010-10-10');
insert into shop.usertbl values('BBK', '바비킴', 1973, '서울', '010', '00000000', 176, '2013-5-5');

CREATE TABLE shop.buytbl (
    idnum NUMBER(8) NOT NULL PRIMARY KEY,
    userid CHAR(8) NOT NULL,
    prodname NCHAR(8) NOT NULL,
    groupname NCHAR(4),
    price NUMBER(8) NOT NULL,
    amount NUMBER(3) NOT NULL,
    FOREIGN KEY(userid) REFERENCES shop.usertbl(userid)
);

DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM user_sequences
    WHERE sequence_name = 'IDSEQ';

    IF v_count > 0 THEN
        EXECUTE IMMEDIATE 'DROP SEQUENCE IDSEQ';
    END IF;
END;


CREATE SEQUENCE IDSEQ
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;
INSERT INTO shop.buytbl VALUES (IDSEQ.NEXTVAL, 'BBK', '운동화', NULL, 30, 2);
INSERT INTO shop.buytbl VALUES (IDSEQ.NEXTVAL, 'KBS', '노트', '전자', 1000, 1);
INSERT INTO shop.buytbl VALUES (IDSEQ.NEXTVAL, 'JYP', '모니터', '전자', 200, 1);
INSERT INTO shop.buytbl VALUES (IDSEQ.NEXTVAL, 'BBK', '모니터', '전자', 200, 5);
INSERT INTO shop.buytbl VALUES (IDSEQ.NEXTVAL, 'KBS', '청바지', '의류', 50, 3);
INSERT INTO shop.buytbl VALUES (IDSEQ.NEXTVAL, 'BBK', '메모리', '전자', 80, 10);
INSERT INTO shop.buytbl VALUES (IDSEQ.NEXTVAL, 'SSK', '책', '서적', 15, 5);
INSERT INTO shop.buytbl VALUES (IDSEQ.NEXTVAL, 'EJW', '책', '서적', 15, 2);
INSERT INTO shop.buytbl VALUES (IDSEQ.NEXTVAL, 'EJW', '청바지', '의류', 50, 1);
INSERT INTO shop.buytbl VALUES (IDSEQ.NEXTVAL, 'BBK', '운동화', NULL, 30, 2);
INSERT INTO shop.buytbl VALUES (IDSEQ.NEXTVAL, 'EJW', '책', '서적', 15, 1);
INSERT INTO shop.buytbl VALUES (IDSEQ.NEXTVAL, 'BBK', '운동화', NULL, 30, 2);

SELECT * FROM USERTBL u ;
SELECT count(*) FROM USERTBL u;
SELECT * FROM BUYTBL b ;
SELECT count(*) FROM BUYTBL b ;

SELECT * FROM usertbl WHERE username = '김경호';

SELECT userid, username FROM USERTBL u 
WHERE birthyear >= 1970 AND height >= 182;

SELECT userid, username FROM USERTBL u 
WHERE height BETWEEN 178 AND 183;

SELECT username, addr FROM usertbl
WHERE addr='경남' OR addr='전남' OR addr='경북';

SELECT username, addr FROM usertbl
WHERE addr IN('경남', '전남', '경북');

SELECT username, height FROM USERTBL u 
WHERE  username LIKE '김%';

SELECT username, height FROM USERTBL u 
WHERE  username LIKE '_종신';

SELECT username, height FROM USERTBL u 
WHERE height > 177;

SELECT username, height FROM usertbl
WHERE height > (SELECT height FROM usertbl WHERE username='김경호');

SELECT count(*) FROM USERTBL u ;

SELECT * FROM USERTBL sample(3);

CREATE TABLE user1tbl (
	userid char(8) NOT NULL PRIMARY KEY,
	username nvarchar2(20) NOT NULL,
	birthyear number(4) NOT NULL,
	addr nchar(2) NOT NULL,
	mobile1 char(3),
	mobile2 char(8),
	height number(3),
	mdate	date
);

ALTER TABLE USER1TBL ADD CONSTRAINT user1tbl_pk PRIMARY key(userid);

CREATE TABLE buy1tbl (
	idnum number(8) NOT NULL,
	userid char(8) NOT NULL,
	prodname nchar(8) NOT NULL,
	groupname nchar(4),
	price number(8) NOT NULL,
	amount number(3) NOT NULL,
	usertbl_userid char(8) NOT null
);

ALTER TABLE BUY1TBL ADD CONSTRAINT buy1tbl_pk PRIMARY KEY (idnum);

SELECT count(*) FROM HR.BIGEMPLOYEES be;

CREATE USER "user1" IDENTIFIED BY "1234";

grant ALL ON SHOP.membertbl TO "user1";

grant ALL ON SHOP.producttbl TO "user1";

GRANT SELECT ON hr.bigemployees TO "user1";

select * from hr.bigemployees;
 
CREATE USER "DIRECTOR" IDENTIFIED BY "1234";

ALTER USER "DIRECTOR" account unlock;

GRANT CREATE SESSION TO "DIRECTOR";

grant ALL ON SHOP.membertbl TO "DIRECTOR";

grant ALL ON SHOP.producttbl TO "DIRECTOR";

GRANT SELECT ON hr.bigemployees TO "DIRECTOR";

SELECT * FROM usertbl;

SELECT * FROM buytbl;

CREATE TABLE buytbl2 AS (SELECT * FROM buytbl);

SELECT * FROM buytbl2;

CREATE TABLE buytbl3 AS (SELECT userid, prodname FROM buytbl);
SELECT * FROM buytbl3;

SELECT userid AS "사용자명", SUM(amount) AS "총구매량"
FROM buytbl GROUP BY userid;

SELECT userid AS "사용자명", SUM(amount * price) AS "총구매액"
FROM buytbl GROUP BY userid;

SELECT cast(avg(amount) AS number(5,3)) AS "평균 구매 수량"
FROM buytbl;

SELECT userid, cast(avg(amount) AS number(5,3)) AS "평균 구매 수량"
FROM buytbl GROUP BY userid;

SELECT username, max(height), min(height)
FROM usertbl GROUP BY username;

SELECT username, height FROM usertbl
WHERE height = (SELECT max(height) FROM usertbl)
OR height = (SELECT min(height) FROM usertbl);

SELECT count(*) FROM usertbl;

SELECT count(mobile1) AS "휴대폰 소유자" FROM usertbl;

SELECT userid AS "사용자명", SUM(amount * price) AS "총구매액"
FROM buytbl GROUP BY userid
HAVING sum(price * amount) > 1000
ORDER BY sum(price * amount);

SELECT idnum, groupname, sum(price * amount)
AS "비용"
FROM buytbl
GROUP by rollup(groupname, idnum);

SELECT groupname, sum(price * amount)
AS "비용"
FROM buytbl
GROUP by rollup(groupname);

SELECT groupname, sum(price * amount)
AS "비용",
grouping_ID(groupname) AS "추가행 여부"
FROM buytbl
GROUP by rollup(groupname);

CREATE TABLE cubetbl(prodname nchar(3), color nchar(2), amount int);

INSERT INTO cubetbl values('컴퓨터', '검정', 11);

INSERT INTO cubetbl values('컴퓨터', '파랑', 22);

INSERT INTO cubetbl values('컴퓨터', '검정', 33);

INSERT INTO cubetbl values('컴퓨터', '파랑', 44);

SELECT * FROM cubetbl;

SELECT prodname, color, sum(amount) AS "수량 합계"
FROM cubetbl
GROUP BY cube(color, prodname)
ORDER BY PRODNAME, color;


CREATE TABLE emptbl (emp nchar(3), manager nchar(3), department nchar(3));

INSERT INTO emptbl VALUES ('나사장', '없음', '없음');
INSERT INTO emptbl VALUES ('김재무', '나사장', '재무부');
INSERT INTO emptbl VALUES ('김부장', '김재무', '재무부');
INSERT INTO emptbl VALUES ('이부장', '김재무', '재무부');
INSERT INTO emptbl VALUES ('우대리', '이부장', '재무부');
INSERT INTO emptbl VALUES ('지사원', '이부장', '재무부');
INSERT INTO emptbl VALUES ('이영업', '나사장', '영업부');
INSERT INTO emptbl VALUES ('한과장', '이영업', '영업부');
INSERT INTO emptbl VALUES ('최정보', '나사장', '정보부');
INSERT INTO emptbl values ('윤차장', '최정보', '정보부');
INSERT INTO emptbl values ('이주임', '윤차장', '정보부');

SELECT * FROM emptbl;

WITH empcte(empname, mgrname, dept, emplevel)
AS 
(
	(SELECT emp, manager, department, 0
	FROM emptbl
	WHERE manager='없음')
	UNION ALL
	(SELECT emptbl.emp, emptbl.manager,
	emptbl.department, empcte.emplevel+1
	FROM emptbl INNER JOIN empcte
	ON emptbl.manager = empcte.empname)
)
SELECT * FROM empcte ORDER BY dept, emplevel;


WITH empcte(empname, mgrname, dept, emplevel)
AS 
(
	(SELECT emp, manager, department, 0
	FROM emptbl
	WHERE manager='없음')
	UNION ALL
	(SELECT emptbl.emp, emptbl.manager,
	emptbl.department, empcte.emplevel+1
	FROM emptbl INNER JOIN empcte
	ON emptbl.manager = empcte.empname)
)
SELECT concat(rpad('ㄴ', emplevel * 2 + 1 ,'ㄴ'),
empname) AS "직원이름",
dept AS "직원부서"
FROM empcte ORDER BY dept, emplevel;

WITH empcte(empname, mgrname, dept, emplevel)
AS 
(
	(SELECT emp, manager, department, 0
	FROM emptbl
	WHERE manager='없음')
	UNION ALL
	(SELECT emptbl.emp, emptbl.manager,
	emptbl.department, empcte.emplevel+1
	FROM emptbl INNER JOIN empcte
	ON emptbl.manager = empcte.empname
	WHERE emplevel < 2)
)
SELECT concat(rpad('ㄴ', emplevel * 2 + 1 ,'ㄴ'),
empname) AS "직원이름",
dept AS "직원부서"
FROM empcte ORDER BY dept, emplevel;

CREATE TABLE testtbl1 (id NUMBER(4), username nchar(3), age number(2));

INSERT INTO testtbl1 values(1, '홍길동', 25);

SELECT * FROM testtbl1;

INSERT INTO testtbl1 (id, username) VALUES(2, '설현');

SELECT * FROM testtbl1;

INSERT INTO testtbl1 (username, id, age) VALUES('지민', 3, 26);

SELECT * FROM testtbl1;

CREATE TABLE testtbl2 (
	id number(4),
	username nchar(3),
	age number(2),
	nation nchar(4) DEFAULT '대한민국'
);

CREATE SEQUENCE idseq2
START WITH 1
INCREMENT BY 1;

INSERT INTO testtbl2 VALUES (idseq2.nextval, '유나', 25, default);

SELECT * FROM testtbl2;

INSERT INTO testtbl2 VALUES (11, '쯔위', 18, '대만');

SELECT * FROM testtbl2;

ALTER SEQUENCE idseq2
INCREMENT BY 10;

INSERT INTO testtbl2 VALUES (idseq2.nextval, '미나', 21, '일본');

SELECT * FROM testtbl2;

ALTER SEQUENCE idseq2
INCREMENT BY 1;

INSERT INTO testtbl2 VALUES (idseq2.nextval, '사나', 21, '일본');

SELECT * FROM testtbl2;

ALTER SEQUENCE idseq2
INCREMENT BY 5;

INSERT INTO testtbl2 VALUES (idseq2.nextval, '채영', 23, '일본');

SELECT * FROM testtbl2;

SELECT idseq2.currval FROM testtbl2;

CREATE TABLE testtbl3 (id NUMBER(3));

CREATE SEQUENCE cycleseq
START WITH 100
INCREMENT BY 100
MINVALUE 100
MAXVALUE 300
CYCLE
nocache;

INSERT INTO testtbl3 VALUES (cycleseq.nextval);

INSERT INTO testtbl3 VALUES (cycleseq.nextval);

INSERT INTO testtbl3 VALUES (cycleseq.nextval);

INSERT INTO testtbl3 VALUES (cycleseq.nextval);

SELECT * FROM testtbl3;

CREATE TABLE testtbl4(
	empid number(6),
	firstname varchar2(20),
	lastname varchar2(25),
	phone varchar2(20)
);

INSERT INTO testtbl4
	SELECT EMPLOYEE_id, first_name, last_name, phone_number
	FROM EMPLOYEES;

SELECT * FROM testtbl4;

UPDATE testtbl4
	SET firstname='David'
	WHERE empid=100;

SELECT * FROM testtbl4
WHERE empid=100;

SELECT * FROM testtbl4 WHERE lastname='King';

COMMIT;

DELETE FROM testtbl4 
WHERE firstname='David' AND lastname='King';

ROLLBACK;

SELECT * FROM testtbl4 WHERE lastname='King';


select cast(price as char(5)) || 'X' || cast(amount as char(4)) || '==' as "단가 X 수량",
    price * amount as "구매액"
    from buytbl;
    
select to_char(12345, '$999,999') from dual;

select to_char(12345, '$000,999') from dual;

select to_char(12345, 'L999,999') from dual;

select to_char(sysdate, 'YYYY/MM/DD hh:mm:ss') from dual;

select to_char(10, 'X'), to_char(255, 'XX') from dual;

select to_number('0123'), to_number('1234.456') from dual;

SELECT '100' + '200' FROM dual;
SELECT concat('100','200') FROM dual;

SELECT 100 || '200' FROM dual;
SELECT price FROM buytbl WHERE price > = '500';

SELECT ascii('A', chr(65), asciistr('한'), unistr('\D55C') FROM dual;

SELECT length('한글'), length('AB'), lengthb('한글'), lengthb('AB') FROM dual;

SELECT concat('이것이', 'ORACLE이다'), '이것이' || 'ORACLE이다' FROM dual;

SELECT instr('이것이 ORACLE이다. 이것도 ORACLE이다', '이것', 2) FROM dual;

SELECT lower('abcdEFGH'), upper('abcdEFGH'), initcap('this is oracle') FROM dual;

SELECT translate('이것이 ORACLE이다', '이것이', 'AB') FROM dual;

SELECT substr('대한민국만세', 3, 2) FROM dual;

SELECT reverse('Oracle') FROM dual;

SELECT lpad('이것이', 10, '##'), rpad('이것이', 10, '##') FROM dual;

SELECT ltrim(' 이것이'), rtrim('이것$$$$', '$') FROM dual;

SELECT trim('이것이'), trim(BOTH 'ㅋ' FROM 'ㅋㅋ재밌어요.ㅋㅋㅋㅋㅋㅋㅋㅋㅋ') FROM dual;

SELECT regexp_count('이것이 오라클이다','이') FROM dual;

SELECT abs(-100) FROM dual;

SELECT ceil(4.4), floor(4.4), round(4.4) FROM dual;

SELECT mod(13,4) FROM dual;

SELECT power(2,3) FROM dual;

SELECT sign(100), sign(0), sign(-100.123) FROM dual;

SELECT trunc(12345.12345, 2), trunc(12345.12345,-2) FROM dual;

SELECT add_months('2025-01-01', 5), add_months(sysdate, -5) FROM dual;

SELECT to_date('2025-01-01') + 5, sysdate -5 FROM dual;

SELECT extract(YEAR FROM DATE '2025-01-01'), extract(DAY FROM sysdate) FROM dual;

SELECT last_day('2025-02-01') FROM dual;

SELECT NEXT_day('2025-03-16','금요일'), next_day(sysdate, '토요일') FROM dual;

SELECT months_between(sysdate, '2004-11-22') FROM dual;

SELECT months_between(sysdate, '2001-09-20') FROM dual;

SELECT bin_to_num(1,0), bin_to_num(1,1,1,1) FROM dual;

SELECT bin_to_num(1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1) FROM dual;

SELECT numtodsinterval(48, 'HOUR'), numtodsinterval(360000,'SECOND') FROM dual;

SELECT numtoyminterval(37, 'month'), numtoyminterval(1.5, 'YEAR') FROM dual;

SELECT row_number() OVER (ORDER BY height DESC) "키 큰 순위", username, addr, height
FROM usertbl;

SELECT row_number() OVER (ORDER BY height asc) "키 큰 순위", username, addr, height
FROM usertbl;

SELECT addr, row_number() 
over(PARTITION BY addr ORDER BY height DESC, username asc)
"키큰 순위", username, addr, height
FROM usertbl;

SELECT dense_rank() 
OVER(ORDER BY height DESC)
"키큰 순위", username, addr, height
FROM usertbl;

SELECT rank() 
OVER(ORDER BY height DESC)
"키큰 순위", username, addr, height
FROM usertbl;

SELECT ntile(3) over(ORDER BY height DESC)
"반번호", username, addr, height FROM usertbl u;

SELECT username, addr, height AS "키,",
height - (first_value(height)) 
over(ORDER BY height desc))
AS "다음 사람과의 키 차이"
FROM usertbl u ;

SELECT username, addr, height AS "키,",
height - (first_value(height)) 
over(partition BY addr order))
AS "다음 사람과의 키 차이"
FROM usertbl u ;

SELECT username, addr, height AS "키",
CUME_DIST()
OVER (PARTITION BY addr ORDER BY height desc)) * 100
AS "누적 인원 백분율 (%)"
FROM usertbl u;


CREATE TABLE pivotTest(
	uname nchar(3),
	season nchar(2),
	amount number(3)
);

INSERT INTO PIVOTTEST VALUES ('김범수', '겨울', 10);
INSERT INTO PIVOTTEST VALUES ('윤종신', '여름', 15);
INSERT INTO PIVOTTEST VALUES ('김범수', '가을', 25);
INSERT INTO PIVOTTEST VALUES ('김범수', '봄', 3);
INSERT INTO PIVOTTEST VALUES ('김범수', '봄', 37);
INSERT INTO PIVOTTEST VALUES ('윤종신', '겨울', 40);
INSERT INTO PIVOTTEST VALUES ('김범수', '여름', 14);
INSERT INTO PIVOTTEST VALUES ('김범수', '겨울', 22);
INSERT INTO PIVOTTEST VALUES ('윤종신', '여름', 64);


SELECT * FROM pivotTest;



SELECT * FROM pivotTest
	pivot(sum(amount)
		FOR season
		IN('봄','여름','가을', '겨울'));
