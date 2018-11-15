/*
 * Project Systaurant
 * Database initiation script
 *
 * Created By: This is not a DB group
 * Date: 11 Aug 2018
 */

DROP DATABASE IF EXISTS `Systaurant`;

CREATE DATABASE IF NOT EXISTS `Systaurant`
CHARACTER SET utf8 COLLATE utf8_general_ci;

USE `Systaurant`;

CREATE TABLE `ACCOUNT` (
	`account_ID`  INTEGER       NOT NULL  AUTO_INCREMENT,

	`password`    CHAR(64)      NOT NULL,
	`salt`        CHAR(10)      NOT NULL,

	`firstname`   VARCHAR(25)   NOT NULL,
	`lastname`    VARCHAR(40)   NOT NULL,
	`address`     VARCHAR(50)   ,
	`phone_NO`    VARCHAR(10)   ,
	`gender`      TINYINT       ,
	`birthdate`   DATE          ,
	`email`       VARCHAR(320)  NOT NULL,

	PRIMARY KEY `account_pk` (`account_ID`)
);

CREATE TABLE `EMPLOYEE` (
	`employee_ID`   INTEGER     NOT NULL  AUTO_INCREMENT,
	`account_ID`    INTEGER     NOT NULL  UNIQUE,

	`SSN`           CHAR(13)    NOT NULL  UNIQUE,
	`salary`        INTEGER(7)  ,
	`workday`       TINYINT     ,

	`employee_type` TINYINT     NOT NULL,

	PRIMARY KEY `employee_pk` (`employee_ID`),

	FOREIGN KEY `employee_fk_account` (`account_ID`) REFERENCES `ACCOUNT` (`account_ID`)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE `EMPLOYEE_WAITER` (
	`employee_ID`   INTEGER   NOT NULL  UNIQUE, 
	`status`        BOOLEAN   NOT NULL  DEFAULT 0,

	PRIMARY KEY `employee_waiter_pk` (`employee_ID`),

	FOREIGN KEY `employee_waiter_fk_employee` (`employee_ID`) REFERENCES `EMPLOYEE` (`employee_ID`) 
		ON DELETE CASCADE 
		ON UPDATE CASCADE
);

CREATE TABLE `EMPLOYEE_CHEF` (
	`employee_ID`   INTEGER   NOT NULL  UNIQUE,

	PRIMARY KEY `employee_chef_pk` (`employee_ID`),

	FOREIGN KEY `employee_chef_fk_employee` (`employee_ID`) REFERENCES `EMPLOYEE` (`employee_ID`)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE `EMPLOYEE_MANAGER` (
	`employee_ID`   INTEGER   NOT NULL  UNIQUE,

	PRIMARY KEY `employee_manager_pk` (`employee_ID`),

	FOREIGN KEY `employee_manager_fk_employee` (`employee_ID`) REFERENCES `EMPLOYEE` (`employee_ID`)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE `MEMBER` (
	`member_ID`         INTEGER     NOT NULL  AUTO_INCREMENT,
	`account_ID`        INTEGER     NOT NULL  UNIQUE,

	`registered_date`   DATETIME    NOT NULL  DEFAULT CURRENT_TIMESTAMP,

	PRIMARY KEY `member_pk` (`member_ID`),

	FOREIGN KEY `member_fk_account` (`account_ID`) REFERENCES `ACCOUNT` (`account_ID`)  
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE `TABLE` (
	`table_ID`          INTEGER     NOT NULL  AUTO_INCREMENT,
	`status`            BOOLEAN     NOT NULL  DEFAULT 0,
	`number_of_seats`   TINYINT     NOT NULL,

	PRIMARY KEY `table_pk` (`table_ID`)
);

CREATE TABLE `RESERVE` (
	`reserve_ID`			INTEGER		NOT NULL  AUTO_INCREMENT,
	`member_ID`             INTEGER     NOT NULL  UNIQUE,
	`table_ID`              INTEGER     NOT NULL,

	`reserve_time`          DATETIME    NOT NULL,
	`number_of_reserved`    TINYINT     NOT NULL,
	`create_time`           DATETIME    NOT NULL  DEFAULT CURRENT_TIMESTAMP,

	PRIMARY KEY `reserve_pk` (`reserve_ID`),
	
	FOREIGN KEY `reserve_fk_member` (`member_ID`) REFERENCES `MEMBER` (`member_ID`)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY `reverse_fk_table` (`table_ID`) REFERENCES `TABLE` (`table_ID`)
		ON DELETE CASCADE
		ON UPDATE CASCADE,

	INDEX `member_ID_index` (`member_ID`),
	INDEX `table_ID_index`  (`table_ID`)
);

CREATE TABLE `MENU` (
	`menu_ID`             INTEGER       NOT NULL  AUTO_INCREMENT,
	`menu_name`           VARCHAR(30)   NOT NULL,
	`menu_description`    TEXT          ,
	`price`               FLOAT(7, 2)   NOT NULL,

	PRIMARY KEY `menu_pk` (`menu_ID`)
);

CREATE TABLE `MENU_THUMBNAIL` (
	`thumbnail_ID`    INTEGER         NOT NULL    AUTO_INCREMENT,
	`menu_ID`         INTEGER         NOT NULL,
	`menu_thumbnail`  VARCHAR(200)    NOT NULL,

	PRIMARY KEY `menu_thumbnail_pk` (`thumbnail_ID`),

	FOREIGN KEY `menu_thumbnail_fk_menu` (`menu_ID`) REFERENCES `MENU` (`menu_ID`)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE `SALE` (
	`menu_ID`             INTEGER       NOT NULL,
	`sale_start_date`     DATETIME      NOT NULL,
	`sale_expire_date`    DATETIME      NOT NULL,
	`employee_ID`         INTEGER       NOT NULL,
	`discount`            FLOAT(4, 2)   NOT NULL,

	PRIMARY KEY `sale_pk` (`menu_ID`, `sale_start_date`),

	FOREIGN KEY `sale_fk_menu` (`menu_ID`) REFERENCES `MENU` (`menu_ID`)
		ON DELETE CASCADE
		ON UPDATE CASCADE,

	INDEX `sale_sale_start_date_index` (`sale_start_date`),
	INDEX `sale_sale_end_date_index`   (`sale_expire_date`)
);

CREATE TABLE `RECEIPT` (
	`receipt_ID`      INTEGER       NOT NULL  AUTO_INCREMENT,
	`table_ID`        INTEGER		NOT NULL, 
	`total_price`     FLOAT(8, 2)   NOT NULL,
	`issue_date`      DATETIME      NOT NULL  DEFAULT CURRENT_TIMESTAMP,
	`payment`         TINYINT       ,

	PRIMARY KEY `receipt_pk` (`receipt_ID`),

	FOREIGN KEY `receipt_fk_table` (table_ID) REFERENCES `TABLE` (table_ID)
		ON DELETE CASCADE
		ON UPDATE CASCADE,

	INDEX `receipt_table_ID_index` (`table_ID`)
);

CREATE TABLE `RECOMMENDATION` (
	`receipt_ID`          INTEGER       NOT NULL,
	`commentator_name`    VARCHAR(20)   NOT NULL,

	`comment`             TEXT          NOT NULL,
	`rating`              TINYINT       ,
 
	PRIMARY KEY `recommendation_pk` (`receipt_ID`, `commentator_name`),

	FOREIGN KEY `recommendation_fk_receipt` (`receipt_ID`) REFERENCES `RECEIPT` (`receipt_ID`)
		ON DELETE CASCADE
		ON UPDATE CASCADE,

	INDEX `recommendation_receipt_ID_index` (`receipt_ID`)
);

CREATE TABLE `PROMOTION` (
	`promo_ID`          INTEGER     NOT NULL  AUTO_INCREMENT,
	`employee_ID`       INTEGER     ,

	`pro_start_date`    DATETIME    NOT NULL,
	`pro_expire_date`   DATETIME    ,

	`criteria`          TEXT        NOT NULL,
	`discount_percent`  FLOAT(4, 2) NOT NULL,

	PRIMARY KEY `promotion_pk` (`promo_ID`),

	FOREIGN KEY `promotion_fk_employee` (`employee_ID`) REFERENCES `EMPLOYEE` (`employee_ID`)
		ON DELETE SET NULL
		ON UPDATE CASCADE,

	INDEX `promotion_start_index` (`pro_start_date`),
	INDEX `promotion_expire_index` (`pro_expire_date`)
);

CREATE TABLE `APPLY_PROMOTION` (
	`promo_ID`      INTEGER     NOT NULL,
	`receipt_ID`    INTEGER     NOT NULL,

	PRIMARY KEY `apply_promotion_pk` (`promo_ID`, `receipt_ID`),

	FOREIGN KEY `apply_promotion_fk_promotion` (`promo_ID`) REFERENCES `PROMOTION` (`promo_ID`)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY `apply_promotion_fk_receipt` (`receipt_ID`) REFERENCES `RECEIPT` (`receipt_ID`)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE `ORDER` (
	`order_ID`      INTEGER     NOT NULL  AUTO_INCREMENT,

	`receipt_ID`    INTEGER     ,
	`employee_ID`   INTEGER     ,
	`menu_ID`       INTEGER     NOT NULL,
	`table_ID`      INTEGER     NOT NULL,

	`order_time`    DATETIME    NOT NULL  DEFAULT CURRENT_TIMESTAMP,
	`status`        TINYINT     NOT NULL  DEFAULT 0,

	PRIMARY KEY `order_pk` (order_ID),

	FOREIGN KEY `order_fk_receipt` (receipt_ID) REFERENCES `RECEIPT` (receipt_ID)
		ON DELETE SET NULL
		ON UPDATE CASCADE,
	FOREIGN KEY `order_fk_employee` (employee_ID) REFERENCES `EMPLOYEE` (employee_ID)
		ON DELETE SET NULL
		ON UPDATE CASCADE,
	FOREIGN KEY `order_fk_menu` (menu_ID) REFERENCES `MENU` (menu_ID)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY `order_fk_table` (table_ID) REFERENCES `TABLE` (table_ID)
		ON DELETE CASCADE
		ON UPDATE CASCADE,

	INDEX `order_order_time_index` (`order_time`),
	INDEX `order_status_index` (`status`)
);
