CREATE TABLE `document` (
	`id` int AUTO_INCREMENT NOT NULL,
	`datetime` datetime,
	`title` varchar(255),
	`content` text,
	CONSTRAINT `document_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `form_document` (
	`id` int AUTO_INCREMENT NOT NULL,
	`datetime` datetime,
	`title` varchar(255),
	`content` text,
	CONSTRAINT `form_document_id` PRIMARY KEY(`id`)
);
