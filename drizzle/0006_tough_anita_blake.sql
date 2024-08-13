ALTER TABLE `physical_exam` DROP FOREIGN KEY `physical_exam_physical_id_physical_id_fk`;
--> statement-breakpoint
ALTER TABLE `physical_exam` ADD CONSTRAINT `physical_exam_physical_id_physical_id_fk` FOREIGN KEY (`physical_id`) REFERENCES `physical`(`id`) ON DELETE no action ON UPDATE no action;