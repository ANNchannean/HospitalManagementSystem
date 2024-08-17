ALTER TABLE `progress_note` DROP FOREIGN KEY `progress_note_patient_id_patient_id_fk`;
--> statement-breakpoint
ALTER TABLE `progress_note` ADD `room_id` int;--> statement-breakpoint
ALTER TABLE `progress_note` ADD CONSTRAINT `progress_note_room_id_room_id_fk` FOREIGN KEY (`room_id`) REFERENCES `room`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `progress_note` ADD CONSTRAINT `progress_note_patient_id_patient_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `patient`(`id`) ON DELETE no action ON UPDATE no action;