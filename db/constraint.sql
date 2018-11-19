/*
 * List of all constraints and triggers in the database
 */

USE `Systaurant`;

-- list of procedures
DROP PROCEDURE IF EXISTS `assert`;
DROP PROCEDURE IF EXISTS `check_manager`;

DELIMITER $$

CREATE PROCEDURE `assert` (IN predicate BOOLEAN, IN msg TEXT)
BEGIN
    IF (NOT predicate) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg;
    END IF;
END;

CREATE PROCEDURE `check_manager` (IN query_ID INTEGER)
BEGIN
    CALL assert((SELECT `employee_type` FROM `EMPLOYEE` WHERE `employee_ID` = query_ID) = 2, "Given ID is not a manager ID");
END;

$$

DELIMITER ;

-- list of triggers
DROP TRIGGER IF EXISTS `insert_account`;
DROP TRIGGER IF EXISTS `insert_employee`;
DROP TRIGGER IF EXISTS `insert_employee_waiter`;
DROP TRIGGER IF EXISTS `insert_sale`;
DROP TRIGGER IF EXISTS `insert_receipt`;
DROP TRIGGER IF EXISTS `insert_menu_recommendation`;
DROP TRIGGER IF EXISTS `insert_promotion`;
DROP TRIGGER IF EXISTS `insert_order`;

DELIMITER $$

CREATE TRIGGER `insert_account`
    BEFORE INSERT ON `ACCOUNT` FOR EACH ROW
BEGIN
    CALL assert((0 <= NEW.`gender` AND NEW.`gender` <= 1), 'Gender is invalid [0-1]');
    CALL assert((LEFT(NEW.`phone_NO`, 1) = '0'), 'Phone number is invalid [leading with 0]');
END;

$$

CREATE TRIGGER `insert_employee` BEFORE INSERT ON `EMPLOYEE` FOR EACH ROW
BEGIN
    CALL assert((0 <= NEW.`employee_type` AND NEW.`employee_type` <= 2), 'Invalid employee_type [0-2]');
END;

$$

CREATE TRIGGER `insert_employee_waiter` BEFORE INSERT ON `EMPLOYEE_WAITER` FOR EACH ROW
BEGIN
    CALL assert((0 <= NEW.`status` AND NEW.`status` <= 2), 'Invalid status [0-2]');
END;

$$

CREATE TRIGGER `insert_sale` BEFORE INSERT ON `SALE` FOR EACH ROW BEGIN
    CALL check_manager(NEW.`employee_ID`);
END;

$$

CREATE TRIGGER `insert_receipt` BEFORE INSERT ON `RECEIPT` FOR EACH ROW
BEGIN
    CALL assert((0 <= NEW.`payment` AND NEW.`payment` <= 2), 'Invalid payment [0-2]');
END;

$$

CREATE TRIGGER `insert_menu_recommendation` BEFORE INSERT ON `RECOMMENDATION` FOR EACH ROW
BEGIN
    CALL assert((1 <= NEW.`rating` AND NEW.`rating` <= 5), 'Invalid rating [1-5]');
END;

$$

CREATE TRIGGER `insert_promotion` BEFORE INSERT ON `PROMOTION` FOR EACH ROW
BEGIN
    CALL check_manager(NEW.`employee_ID`);
    CALL assert((0.0 <= NEW.`discount_percent` AND NEW.`discount_percent` <= 100.0), 'Invalid discount_percent [0-100]');
END;

$$

CREATE TRIGGER `insert_order` BEFORE INSERT ON `ORDER` FOR EACH ROW
BEGIN
    CALL assert((0 <= NEW.`status` AND NEW.`status` <= 3), 'Invalid status [0-3]');
END;

$$

DELIMITER ;
