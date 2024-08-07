CREATE TABLE `appointment_injection` (
	`id` int AUTO_INCREMENT NOT NULL,
	`appointment` datetime NOT NULL,
	`datetime_inject` datetime NOT NULL,
	`status` boolean DEFAULT false,
	`discription` varchar(255),
	`times` varchar(255) NOT NULL,
	`injection_id` int,
	CONSTRAINT `appointment_injection_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `injection` MODIFY COLUMN `datetime` datetime NOT NULL;--> statement-breakpoint
ALTER TABLE `appointment_injection` ADD CONSTRAINT `appointment_injection_injection_id_injection_id_fk` FOREIGN KEY (`injection_id`) REFERENCES `injection`(`id`) ON DELETE cascade ON UPDATE no action;