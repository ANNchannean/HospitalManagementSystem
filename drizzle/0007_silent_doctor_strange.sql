ALTER TABLE `vaccine` DROP FOREIGN KEY `vaccine_vaccine_type_id_vaccine_type_id_fk`;
--> statement-breakpoint
ALTER TABLE `vaccine` DROP FOREIGN KEY `vaccine_visit_id_visit_id_fk`;
--> statement-breakpoint
ALTER TABLE `vaccine` ADD `product_id` int;--> statement-breakpoint
ALTER TABLE `vaccine_type` ADD `type` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `vaccine` ADD CONSTRAINT `vaccine_product_id_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vaccine` ADD CONSTRAINT `vaccine_visit_id_visit_id_fk` FOREIGN KEY (`visit_id`) REFERENCES `visit`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vaccine` DROP COLUMN `vaccine_type_id`;--> statement-breakpoint
ALTER TABLE `vaccine_type` DROP COLUMN `department`;