CREATE TABLE `vaccine_dose` (
	`id` int AUTO_INCREMENT NOT NULL,
	`discription` text,
	CONSTRAINT `vaccine_dose_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `product` ADD `vaccine_dose_id` int;--> statement-breakpoint
ALTER TABLE `product` ADD CONSTRAINT `product_vaccine_dose_id_vaccine_dose_id_fk` FOREIGN KEY (`vaccine_dose_id`) REFERENCES `vaccine_dose`(`id`) ON DELETE no action ON UPDATE no action;