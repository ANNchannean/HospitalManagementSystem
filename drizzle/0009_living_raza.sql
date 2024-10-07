ALTER TABLE `billing` MODIFY COLUMN `status` varchar(10) NOT NULL DEFAULT 'checking';--> statement-breakpoint
ALTER TABLE `billing` ADD `service` boolean DEFAULT false NOT NULL;