CREATE TABLE `inventory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`product_id` int NOT NULL,
	`original_price` decimal(10,2) NOT NULL DEFAULT 0,
	`exchange` int NOT NULL DEFAULT 4000,
	`expier_date` datetime,
	`outstock` boolean NOT NULL DEFAULT false,
	`stock` int NOT NULL DEFAULT 0,
	`count_stock` boolean NOT NULL DEFAULT false,
	CONSTRAINT `inventory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sub_unit` (
	`id` int AUTO_INCREMENT NOT NULL,
	`per_item` int NOT NULL DEFAULT 0,
	`pcs` int NOT NULL DEFAULT 0,
	`price` decimal(10,2) NOT NULL DEFAULT 0,
	`inventory_id` int NOT NULL,
	`unit_id` int NOT NULL,
	CONSTRAINT `sub_unit_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bed_ipd` (
	`id` int AUTO_INCREMENT NOT NULL,
	`check_in` datetime NOT NULL,
	`check_out` datetime,
	`int` int,
	`bed_id` int NOT NULL,
	CONSTRAINT `bed_ipd_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `inventory` ADD CONSTRAINT `inventory_product_id_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sub_unit` ADD CONSTRAINT `sub_unit_inventory_id_inventory_id_fk` FOREIGN KEY (`inventory_id`) REFERENCES `inventory`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sub_unit` ADD CONSTRAINT `sub_unit_unit_id_unit_id_fk` FOREIGN KEY (`unit_id`) REFERENCES `unit`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bed_ipd` ADD CONSTRAINT `bed_ipd_bed_id_bed_id_fk` FOREIGN KEY (`bed_id`) REFERENCES `bed`(`id`) ON DELETE no action ON UPDATE no action;