ALTER TABLE `progress_note` DROP FOREIGN KEY `progress_note_room_id_room_id_fk`;
--> statement-breakpoint
ALTER TABLE `progress_note` ADD `bed_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `progress_note` ADD CONSTRAINT `progress_note_bed_id_bed_id_fk` FOREIGN KEY (`bed_id`) REFERENCES `bed`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `progress_note` DROP COLUMN `room_id`;