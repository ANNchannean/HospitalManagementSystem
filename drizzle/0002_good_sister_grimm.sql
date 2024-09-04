CREATE TABLE `setting` (
	`id` int AUTO_INCREMENT NOT NULL,
	`currency_symbol` varchar(3) NOT NULL DEFAULT '៛',
	`rate_from` float NOT NULL DEFAULT 4000,
	`currency_from` varchar(3) NOT NULL DEFAULT '៛',
	`rate_to` float NOT NULL DEFAULT 1,
	`currency_to` varchar(3) NOT NULL DEFAULT '$',
	CONSTRAINT `setting_id` PRIMARY KEY(`id`)
);
