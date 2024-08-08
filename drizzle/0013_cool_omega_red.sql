ALTER TABLE `injection` DROP FOREIGN KEY `injection_product_id_product_id_fk`;
--> statement-breakpoint
ALTER TABLE `injection` ADD `unit_id` int;--> statement-breakpoint
ALTER TABLE `injection` ADD CONSTRAINT `injection_unit_id_unit_id_fk` FOREIGN KEY (`unit_id`) REFERENCES `unit`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `injection` DROP COLUMN `product_id`;