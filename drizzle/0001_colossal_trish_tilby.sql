ALTER TABLE `commune` MODIFY COLUMN `name_khmer` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `commune` MODIFY COLUMN `name_latin` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `commune` MODIFY COLUMN `type` varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE `district` MODIFY COLUMN `name_khmer` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `district` MODIFY COLUMN `name_latin` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `district` MODIFY COLUMN `type` varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE `provice` MODIFY COLUMN `name_khmer` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `provice` MODIFY COLUMN `name_latin` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `provice` MODIFY COLUMN `type` varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE `village` MODIFY COLUMN `name_khmer` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `village` MODIFY COLUMN `name_latin` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `village` MODIFY COLUMN `type` varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE `department` MODIFY COLUMN `department` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `diagnosis_type` MODIFY COLUMN `diagnosis_type` varchar(150) NOT NULL;--> statement-breakpoint
ALTER TABLE `parameter` MODIFY COLUMN `gender` varchar(10);--> statement-breakpoint
ALTER TABLE `parameter` MODIFY COLUMN `sign` varchar(10) NOT NULL DEFAULT '-';--> statement-breakpoint
ALTER TABLE `patient` MODIFY COLUMN `name_khmer` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `patient` MODIFY COLUMN `name_latin` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `patient` MODIFY COLUMN `gender` varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE `patient` MODIFY COLUMN `telephone` varchar(50);--> statement-breakpoint
ALTER TABLE `physical` MODIFY COLUMN `physical` varchar(150);--> statement-breakpoint
ALTER TABLE `product_group_type` MODIFY COLUMN `group_type` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `staff` MODIFY COLUMN `name` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `staff` MODIFY COLUMN `staff_type` varchar(20) NOT NULL DEFAULT 'DOCTOR';--> statement-breakpoint
ALTER TABLE `staff` MODIFY COLUMN `gender` varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `username` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `role` varchar(20) NOT NULL DEFAULT 'DOCTOR';--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `lang` varchar(5) NOT NULL DEFAULT 'ko';--> statement-breakpoint
ALTER TABLE `visit` MODIFY COLUMN `checkin_type` varchar(5) NOT NULL;--> statement-breakpoint
ALTER TABLE `imagerie_group` MODIFY COLUMN `imagerie_group` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `active_presrciption` MODIFY COLUMN `active_for` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `presrciption` MODIFY COLUMN `use` varchar(150);--> statement-breakpoint
ALTER TABLE `presrciption` MODIFY COLUMN `duration` varchar(150);--> statement-breakpoint
ALTER TABLE `use` MODIFY COLUMN `description` varchar(150);--> statement-breakpoint
ALTER TABLE `duration` MODIFY COLUMN `description` varchar(50);--> statement-breakpoint
ALTER TABLE `operation_protocol` MODIFY COLUMN `surgeon` varchar(255);--> statement-breakpoint
ALTER TABLE `operation_protocol` MODIFY COLUMN `assistant_surgeon` varchar(255);--> statement-breakpoint
ALTER TABLE `operation_protocol` MODIFY COLUMN `anesthetist` varchar(255);--> statement-breakpoint
ALTER TABLE `operation_protocol` MODIFY COLUMN `assistant_anesthetist` varchar(255);--> statement-breakpoint
ALTER TABLE `operation_protocol` MODIFY COLUMN `scrub_nurse` varchar(255);--> statement-breakpoint
ALTER TABLE `operation_protocol` MODIFY COLUMN `cirulating_nurse_block` varchar(255);--> statement-breakpoint
ALTER TABLE `operation_protocol` MODIFY COLUMN `midwife` varchar(255);--> statement-breakpoint
ALTER TABLE `operation_protocol` MODIFY COLUMN `pre_diagnosis` varchar(255);--> statement-breakpoint
ALTER TABLE `operation_protocol` MODIFY COLUMN `post_diagnosis` varchar(255);--> statement-breakpoint
ALTER TABLE `operation_protocol` MODIFY COLUMN `type_anesthesia` varchar(255);--> statement-breakpoint
ALTER TABLE `operation_protocol` MODIFY COLUMN `blood_less` varchar(255);--> statement-breakpoint
ALTER TABLE `bed` MODIFY COLUMN `bed` varchar(100);--> statement-breakpoint
ALTER TABLE `room` MODIFY COLUMN `room` varchar(100);--> statement-breakpoint
ALTER TABLE `ward` MODIFY COLUMN `ward` varchar(100);--> statement-breakpoint
ALTER TABLE `billing` MODIFY COLUMN `status` varchar(10) NOT NULL DEFAULT 'active';--> statement-breakpoint
ALTER TABLE `billing` MODIFY COLUMN `checkin_type` varchar(5);--> statement-breakpoint
ALTER TABLE `charge` MODIFY COLUMN `status` varchar(10) DEFAULT 'active';--> statement-breakpoint
ALTER TABLE `charge` MODIFY COLUMN `charge_on` varchar(20);--> statement-breakpoint
ALTER TABLE `document` MODIFY COLUMN `title` varchar(150);--> statement-breakpoint
ALTER TABLE `form_document` MODIFY COLUMN `title` varchar(150);--> statement-breakpoint
ALTER TABLE `words` MODIFY COLUMN `type` varchar(100) NOT NULL;