ALTER TABLE `progress_note` MODIFY COLUMN `staff_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `progress_note` MODIFY COLUMN `etiology` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `progress_note` MODIFY COLUMN `department_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `visit` MODIFY COLUMN `patient_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `visit` MODIFY COLUMN `department_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `visit` MODIFY COLUMN `staff_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `visit` MODIFY COLUMN `etiology` varchar(255) NOT NULL;