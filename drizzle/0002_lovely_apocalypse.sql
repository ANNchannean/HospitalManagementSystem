ALTER TABLE `file_or_picture` ADD `payment_id` int;--> statement-breakpoint
ALTER TABLE `payment` ADD `reference` varchar(255);--> statement-breakpoint
ALTER TABLE `payment` ADD `note` text;--> statement-breakpoint
ALTER TABLE `file_or_picture` ADD CONSTRAINT `file_or_picture_payment_id_payment_id_fk` FOREIGN KEY (`payment_id`) REFERENCES `payment`(`id`) ON DELETE cascade ON UPDATE cascade;