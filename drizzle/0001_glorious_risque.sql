CREATE TABLE `words` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` varchar(255) NOT NULL,
	`text` text NOT NULL,
	CONSTRAINT `words_id` PRIMARY KEY(`id`)
);
