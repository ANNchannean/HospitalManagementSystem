ALTER TABLE `inventory` RENAME COLUMN `stock` TO `qty`;--> statement-breakpoint
ALTER TABLE `sub_unit` RENAME COLUMN `per_item` TO `qty_in_item`;--> statement-breakpoint
ALTER TABLE `sub_unit` RENAME COLUMN `pcs` TO `qty`;