
USE `Systaurant`;

DROP PROCEDURE  IF EXISTS `check_manager`;
DROP TRIGGER    IF EXISTS `insert_sale`;
DROP TRIGGER    IF EXISTS `insert_promo`;

DELIMITER $$

CREATE PROCEDURE `check_manager` (IN query_ID INTEGER)
BEGIN
    DECLARE eType INTEGER DEFAULT (SELECT `employee_type` FROM `EMPLOYEE` WHERE `employee_ID` = query_ID);
    IF (eType <> 0) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Given ID is not a manager ID';
    END IF;
END;

CREATE TRIGGER `insert_sale`
    BEFORE INSERT ON `SALE`
    FOR EACH ROW
BEGIN
    CALL check_manager(NEW.`employee_ID`);
END;

CREATE TRIGGER `insert_promo`
    BEFORE INSERT ON `PROMOTION`
    FOR EACH ROW
BEGIN
    CALL check_manager(NEW.`employee_ID`);
END;

$$
