//14
CREATE USER 'store_manager'@'localhost'
IDENTIFIED BY 'StoreManager@123';

GRANT SELECT, INSERT, UPDATE
ON test14.*
TO 'store_manager'@'localhost';
//15
REVOKE UPDATE
ON test14.*
FROM 'store_manager'@'localhost';
//16
GRANT DELETE
ON test14.sales
TO 'store_manager'@'localhost';