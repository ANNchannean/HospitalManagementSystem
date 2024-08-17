ALTER TABLE `accessment` DROP FOREIGN KEY `accessment_visit_id_visit_id_fk`;
--> statement-breakpoint
ALTER TABLE `appointment` ADD `progress_note_id` int;--> statement-breakpoint
ALTER TABLE `service` ADD `progress_note_id` int;--> statement-breakpoint
ALTER TABLE `accessment` ADD `progress_note_id` int;--> statement-breakpoint
ALTER TABLE `appointment` ADD CONSTRAINT `appointment_progress_note_id_progress_note_id_fk` FOREIGN KEY (`progress_note_id`) REFERENCES `progress_note`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `service` ADD CONSTRAINT `service_progress_note_id_progress_note_id_fk` FOREIGN KEY (`progress_note_id`) REFERENCES `progress_note`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `accessment` ADD CONSTRAINT `accessment_progress_note_id_progress_note_id_fk` FOREIGN KEY (`progress_note_id`) REFERENCES `progress_note`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `accessment` ADD CONSTRAINT `accessment_visit_id_visit_id_fk` FOREIGN KEY (`visit_id`) REFERENCES `visit`(`id`) ON DELETE cascade ON UPDATE cascade;