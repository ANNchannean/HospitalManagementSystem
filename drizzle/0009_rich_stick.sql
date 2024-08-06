ALTER TABLE `injection` ADD `patient_id` int;--> statement-breakpoint
ALTER TABLE `injection` ADD `product_id` int;--> statement-breakpoint
ALTER TABLE `injection` ADD CONSTRAINT `injection_patient_id_patient_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `patient`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `injection` ADD CONSTRAINT `injection_product_id_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE set null ON UPDATE no action;