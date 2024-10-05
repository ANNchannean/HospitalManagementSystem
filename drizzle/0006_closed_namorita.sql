ALTER TABLE `billing` RENAME COLUMN `checkin_type` TO `billing_type`;--> statement-breakpoint
ALTER TABLE `billing` MODIFY COLUMN `status` varchar(10) NOT NULL DEFAULT 'checkup';