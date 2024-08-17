ALTER TABLE `progress_note` DROP FOREIGN KEY `progress_note_patient_id_patient_id_fk`;
--> statement-breakpoint
ALTER TABLE `progress_note` ADD `staff_id` int;--> statement-breakpoint
ALTER TABLE `progress_note` ADD `etiology` varchar(255);--> statement-breakpoint
ALTER TABLE `progress_note` ADD `department_id` int;--> statement-breakpoint
ALTER TABLE `progress_note` ADD CONSTRAINT `progress_note_staff_id_staff_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `progress_note` ADD CONSTRAINT `progress_note_department_id_department_id_fk` FOREIGN KEY (`department_id`) REFERENCES `department`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `progress_note` ADD CONSTRAINT `progress_note_patient_id_patient_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `patient`(`id`) ON DELETE cascade ON UPDATE cascade;