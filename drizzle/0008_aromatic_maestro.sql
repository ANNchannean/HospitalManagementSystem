CREATE TABLE `injection` (
	`id` int AUTO_INCREMENT NOT NULL,
	`discription` varchar(255),
	CONSTRAINT `injection_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `vaccine` ADD `injection_id` int;--> statement-breakpoint
ALTER TABLE `vaccine` ADD CONSTRAINT `vaccine_injection_id_injection_id_fk` FOREIGN KEY (`injection_id`) REFERENCES `injection`(`id`) ON DELETE cascade ON UPDATE no action;