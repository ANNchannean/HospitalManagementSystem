ALTER TABLE `inventory` MODIFY COLUMN `original_price` decimal(18,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `product` MODIFY COLUMN `price` decimal(18,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `sub_unit` MODIFY COLUMN `price` decimal(18,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `billing` MODIFY COLUMN `sub_total` decimal(18,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `billing` MODIFY COLUMN `total` decimal(18,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `billing` MODIFY COLUMN `total_after_tax` decimal(18,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `billing` MODIFY COLUMN `total_after_vat` decimal(18,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `billing` MODIFY COLUMN `paid` decimal(18,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `billing` MODIFY COLUMN `balance` decimal(18,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `charge` MODIFY COLUMN `price` decimal(18,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `product_order` MODIFY COLUMN `price` decimal(18,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `product_order` MODIFY COLUMN `total` decimal(18,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `payment` MODIFY COLUMN `value` decimal(18,2) NOT NULL;