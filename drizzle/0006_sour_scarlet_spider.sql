ALTER TABLE `file_or_picture` ADD `document_id` int;--> statement-breakpoint
ALTER TABLE `document` ADD `visit_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `file_or_picture` ADD CONSTRAINT `file_or_picture_document_id_document_id_fk` FOREIGN KEY (`document_id`) REFERENCES `document`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `document` ADD CONSTRAINT `document_visit_id_visit_id_fk` FOREIGN KEY (`visit_id`) REFERENCES `visit`(`id`) ON DELETE cascade ON UPDATE cascade;