ALTER TABLE `progress_note` DROP FOREIGN KEY `progress_note_room_id_room_id_fk`;
--> statement-breakpoint
ALTER TABLE `progress_note` MODIFY COLUMN `date_checkup` datetime NOT NULL;--> statement-breakpoint
ALTER TABLE `progress_note` MODIFY COLUMN `patient_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `progress_note` MODIFY COLUMN `room_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `progress_note` ADD CONSTRAINT `progress_note_room_id_room_id_fk` FOREIGN KEY (`room_id`) REFERENCES `room`(`id`) ON DELETE no action ON UPDATE no action;