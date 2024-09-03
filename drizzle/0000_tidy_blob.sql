CREATE TABLE `commune` (
	`commune_id` int AUTO_INCREMENT NOT NULL,
	`name_khmer` varchar(255) NOT NULL,
	`name_latin` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`district_id` int,
	CONSTRAINT `commune_commune_id` PRIMARY KEY(`commune_id`)
);
--> statement-breakpoint
CREATE TABLE `district` (
	`district_id` int AUTO_INCREMENT NOT NULL,
	`name_khmer` varchar(255) NOT NULL,
	`name_latin` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`province_id` int,
	CONSTRAINT `district_district_id` PRIMARY KEY(`district_id`)
);
--> statement-breakpoint
CREATE TABLE `provice` (
	`provice_id` int AUTO_INCREMENT NOT NULL,
	`name_khmer` varchar(255) NOT NULL,
	`name_latin` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`contry_id` int,
	CONSTRAINT `provice_provice_id` PRIMARY KEY(`provice_id`)
);
--> statement-breakpoint
CREATE TABLE `village` (
	`village_id` int AUTO_INCREMENT NOT NULL,
	`name_khmer` varchar(255) NOT NULL,
	`name_latin` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`commune_id` int,
	CONSTRAINT `village_village_id` PRIMARY KEY(`village_id`)
);
--> statement-breakpoint
CREATE TABLE `department` (
	`id` int AUTO_INCREMENT NOT NULL,
	`department` varchar(255) NOT NULL,
	CONSTRAINT `department_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `diagnosis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`diagnosis` varchar(255),
	`diagnosis_khmer` varchar(255),
	`diagnosis_type_id` int,
	CONSTRAINT `diagnosis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `diagnosis_type` (
	`id` int AUTO_INCREMENT NOT NULL,
	`diagnosis_type` varchar(255) NOT NULL,
	CONSTRAINT `diagnosis_type_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `file_or_picture` (
	`id` int AUTO_INCREMENT NOT NULL,
	`filename` varchar(255),
	`mimeType` varchar(255),
	`lastModified` float,
	`size` float,
	`patient_id` int,
	`imagerie_request_id` int,
	`clinicinfo_id` int,
	`laboratory_id` int,
	`payment_type_id` int,
	`billing_id` int,
	`payment_id` int,
	`document_id` int,
	`product_id` int,
	CONSTRAINT `file_or_picture_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `laboratory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`doctor_comment` text,
	`finish_datetime` datetime,
	`sample` varchar(255),
	`status` boolean DEFAULT false,
	`visit_id` int,
	CONSTRAINT `laboratory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `laboratory_group` (
	`id` int AUTO_INCREMENT NOT NULL,
	`laboratory_group` varchar(255) NOT NULL,
	CONSTRAINT `laboratory_group_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `laboratory_request` (
	`id` int AUTO_INCREMENT NOT NULL,
	`product_id` int,
	`visit_id` int,
	CONSTRAINT `laboratory_request_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `laboratory_result` (
	`id` int AUTO_INCREMENT NOT NULL,
	`laboratory_request_id` int,
	`parameter_id` int,
	`result` varchar(255),
	CONSTRAINT `laboratory_result_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `parameter` (
	`id` int AUTO_INCREMENT NOT NULL,
	`parameter` varchar(255),
	`description` longtext,
	`gender` varchar(255),
	`sign` varchar(255) NOT NULL DEFAULT '-',
	`unit_id` int,
	`mini` float,
	`maxi` float,
	`product_id` int,
	CONSTRAINT `parameter_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `patient` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name_khmer` varchar(255) NOT NULL,
	`name_latin` varchar(255) NOT NULL,
	`gender` varchar(255) NOT NULL,
	`dob` date NOT NULL,
	`age` int NOT NULL,
	`telephone` varchar(255),
	`other` text,
	`village_id` int,
	`commune_id` int,
	`district_id` int,
	`province_id` int,
	`created_at` datetime NOT NULL,
	CONSTRAINT `patient_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exam` (
	`id` int AUTO_INCREMENT NOT NULL,
	`examination` varchar(255),
	CONSTRAINT `exam_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `physical` (
	`id` int AUTO_INCREMENT NOT NULL,
	`physical` varchar(255),
	`exam_id` int,
	CONSTRAINT `physical_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `physical_exam` (
	`id` int AUTO_INCREMENT NOT NULL,
	`physical_id` int,
	`result` varchar(255),
	`visit_id` int,
	CONSTRAINT `physical_exam_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inventory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`product_id` int NOT NULL,
	`original_price` decimal(10,2) NOT NULL DEFAULT 0,
	`exchange` int NOT NULL DEFAULT 4000,
	`expier_date` datetime,
	`outstock` boolean NOT NULL DEFAULT false,
	`qty` int NOT NULL DEFAULT 0,
	`count_stock` boolean NOT NULL DEFAULT false,
	CONSTRAINT `inventory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product` (
	`id` int AUTO_INCREMENT NOT NULL,
	`products` text NOT NULL,
	`generic_name` text,
	`barcode` varchar(255),
	`group_type_id` int,
	`laboratory_group_id` int,
	`imagerie_group_id` int,
	`price` decimal(10,2) NOT NULL DEFAULT 0,
	`unit_id` int,
	`create_at` datetime,
	CONSTRAINT `product_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sub_unit` (
	`id` int AUTO_INCREMENT NOT NULL,
	`qty_in_item` int NOT NULL DEFAULT 0,
	`qty` int NOT NULL DEFAULT 0,
	`price` decimal(10,2) NOT NULL DEFAULT 0,
	`inventory_id` int NOT NULL,
	`unit_id` int NOT NULL,
	CONSTRAINT `sub_unit_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_group_type` (
	`id` int AUTO_INCREMENT NOT NULL,
	`group_type` varchar(255) NOT NULL,
	CONSTRAINT `product_group_type_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`expires_at` timestamp NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `staff` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`staff_type` varchar(255) NOT NULL DEFAULT 'DOCTOR',
	`gender` varchar(255) NOT NULL,
	`specific` varchar(255),
	CONSTRAINT `staff_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subjective` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cheif_complaint` text,
	`current_medication` varchar(255),
	`history_of_present_illness` varchar(255),
	`past_medical_history` text,
	`allesgy_medicine` varchar(255),
	`surgical_history` varchar(255),
	`family_and_social_history` varchar(255),
	`visit_id` int,
	CONSTRAINT `subjective_id` PRIMARY KEY(`id`),
	CONSTRAINT `subjective_visit_id_unique` UNIQUE(`visit_id`)
);
--> statement-breakpoint
CREATE TABLE `template` (
	`id` int AUTO_INCREMENT NOT NULL,
	`diagnosis` text,
	`template` longtext,
	CONSTRAINT `template_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(255) NOT NULL,
	`username` varchar(255) NOT NULL,
	`password_hash` text,
	`role` varchar(255) NOT NULL DEFAULT 'DOCTOR',
	`image` varchar(255),
	`limit_view` int NOT NULL DEFAULT 20,
	`lang` varchar(255) NOT NULL DEFAULT 'ko',
	`staff_id` int,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `unit` (
	`id` int AUTO_INCREMENT NOT NULL,
	`unit` varchar(255),
	`vaccine_dose` text,
	`product_group_type_id` int,
	CONSTRAINT `unit_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `appointment_injection` (
	`id` int AUTO_INCREMENT NOT NULL,
	`appointment` datetime NOT NULL,
	`datetime_inject` datetime,
	`status` boolean DEFAULT false,
	`discription` varchar(255),
	`times` int NOT NULL DEFAULT 1,
	`injection_id` int,
	CONSTRAINT `appointment_injection_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `injection` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patient_id` int,
	`datetime` datetime NOT NULL,
	`unit_id` int,
	`discription` varchar(255),
	CONSTRAINT `injection_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vaccine` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visit_id` int,
	`injection_id` int,
	`product_id` int,
	`discription` varchar(255),
	CONSTRAINT `vaccine_id` PRIMARY KEY(`id`)
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
CREATE TABLE `nursing_process` (
	`id` int AUTO_INCREMENT NOT NULL,
	`datetime` datetime,
	`accessment` varchar(255),
	`health_problems` text,
	`actions` varchar(255),
	`evolution` varchar(255),
	`nursing_sign` int,
	`progress_note_id` int,
	CONSTRAINT `nursing_process_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `progress_note` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date_checkup` datetime NOT NULL,
	`date_checkout` datetime,
	`staff_id` int NOT NULL,
	`etiology` varchar(255) NOT NULL,
	`department_id` int NOT NULL,
	`patient_id` int NOT NULL,
	`bed_id` int NOT NULL,
	CONSTRAINT `progress_note_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `visit` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date_checkup` datetime NOT NULL,
	`patient_id` int NOT NULL,
	`department_id` int NOT NULL,
	`staff_id` int NOT NULL,
	`checkin_type` varchar(255) NOT NULL,
	`etiology` varchar(255) NOT NULL,
	`transfer` boolean NOT NULL DEFAULT false,
	`progress_note_id` int,
	CONSTRAINT `visit_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vital_sign` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dbp` float,
	`sbp` float,
	`pulse` float,
	`t` float,
	`sp02` float,
	`height` float,
	`weight` float,
	`rr` float,
	`bmi` float,
	`visit_id` int,
	`datetime` datetime,
	`stool` varchar(255),
	`urine` varchar(255),
	`note` text,
	`piv` int,
	`drink` int,
	`nasogastric_tube_in` int,
	`nasogastric_tube_out` int,
	`fluid_out` int,
	`vomiting` int,
	`by` int,
	`progress_note_id` int,
	CONSTRAINT `vital_sign_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `imagerie_group` (
	`id` int AUTO_INCREMENT NOT NULL,
	`imagerie_group` varchar(255) NOT NULL,
	CONSTRAINT `imagerie_group_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `imagerie_request` (
	`id` int AUTO_INCREMENT NOT NULL,
	`product_id` int,
	`visit_id` int,
	`text` text,
	`status` boolean DEFAULT false,
	`finish_datetime` datetime,
	CONSTRAINT `imagerie_request_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `advice_teaching` (
	`id` int AUTO_INCREMENT NOT NULL,
	`description` text,
	`visit_id` int,
	CONSTRAINT `advice_teaching_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `active_presrciption` (
	`id` int AUTO_INCREMENT NOT NULL,
	`active_for` varchar(255) NOT NULL,
	`datetime` datetime NOT NULL,
	`presrciption_id` int,
	`user_id` varchar(255),
	CONSTRAINT `active_presrciption_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `presrciption` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visit_id` int,
	`product_id` int,
	`use` varchar(255),
	`duration` varchar(255),
	`amount` float,
	`morning` float,
	`noon` float,
	`afternoon` float,
	`evening` float,
	`night` float,
	CONSTRAINT `presrciption_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `use` (
	`id` int AUTO_INCREMENT NOT NULL,
	`description` varchar(255),
	CONSTRAINT `use_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `duration` (
	`id` int AUTO_INCREMENT NOT NULL,
	`description` varchar(255),
	CONSTRAINT `duration_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `appointment` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visit_id` int,
	`progress_note_id` int,
	`date` datetime,
	`description` text,
	CONSTRAINT `appointment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `remark` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visit_id` int,
	`description` text,
	CONSTRAINT `remark_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `service` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visit_id` int,
	`progress_note_id` int,
	`product_id` int,
	CONSTRAINT `service_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `operation_protocol` (
	`id` int AUTO_INCREMENT NOT NULL,
	`surgeon` varchar(256),
	`assistant_surgeon` varchar(256),
	`anesthetist` varchar(256),
	`assistant_anesthetist` varchar(256),
	`scrub_nurse` varchar(256),
	`cirulating_nurse_block` varchar(256),
	`midwife` varchar(256),
	`pre_diagnosis` varchar(256),
	`post_diagnosis` varchar(256),
	`type_anesthesia` varchar(256),
	`opertive_technique` text,
	`blood_less` varchar(256),
	`notes` text,
	`date` date,
	`start_time` time,
	`finish_time` time,
	`service_id` int,
	CONSTRAINT `operation_protocol_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bed` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bed` varchar(255),
	`room_id` int,
	`ward_id` int,
	`description` text,
	CONSTRAINT `bed_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `room` (
	`id` int AUTO_INCREMENT NOT NULL,
	`room` varchar(255),
	`product_id` int,
	`ward_id` int,
	`description` text,
	CONSTRAINT `room_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ward` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ward` varchar(255),
	`description` text,
	CONSTRAINT `ward_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `accessment` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visit_id` int,
	`progress_note_id` int,
	`diagnosis_or_problem` text,
	`differential_diagnosis` text,
	CONSTRAINT `accessment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clinicinfo` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title_khmer` text NOT NULL,
	`title_english` text NOT NULL,
	`address` text NOT NULL,
	`detail` text NOT NULL,
	`contact` text NOT NULL,
	CONSTRAINT `clinicinfo_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `billing` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` date,
	`time` time,
	`visit_id` int,
	`progress_note_id` int,
	`discount` varchar(50) NOT NULL DEFAULT '0',
	`sub_total` decimal(10,2) NOT NULL DEFAULT 0,
	`total` decimal(10,2) NOT NULL DEFAULT 0,
	`total_after_tax` decimal(10,2) NOT NULL DEFAULT 0,
	`total_after_vat` decimal(10,2) NOT NULL DEFAULT 0,
	`paid` decimal(10,2) NOT NULL DEFAULT 0,
	`tax` float NOT NULL DEFAULT 0,
	`vat` float NOT NULL DEFAULT 0,
	`balance` decimal(10,2) NOT NULL DEFAULT 0,
	`status` varchar(255) NOT NULL DEFAULT 'active',
	`checkin_type` varchar(255) NOT NULL,
	`created_at` datetime,
	`note` text,
	`exchang` int NOT NULL DEFAULT 4000,
	CONSTRAINT `billing_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `charge` (
	`id` int AUTO_INCREMENT NOT NULL,
	`created_at` datetime,
	`price` decimal(10,2) NOT NULL DEFAULT 0,
	`status` varchar(255) DEFAULT 'active',
	`charge_on` varchar(255),
	`billing_id` int NOT NULL,
	CONSTRAINT `charge_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exchang` (
	`id` int AUTO_INCREMENT NOT NULL,
	`rate` int NOT NULL DEFAULT 4000,
	CONSTRAINT `exchang_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_order` (
	`id` int AUTO_INCREMENT NOT NULL,
	`created_at` datetime,
	`price` decimal(10,2) NOT NULL DEFAULT 0,
	`total` decimal(10,2) NOT NULL DEFAULT 0,
	`qty` int NOT NULL DEFAULT 1,
	`discount` varchar(50) NOT NULL DEFAULT '0',
	`product_id` int NOT NULL,
	`charge_id` int NOT NULL,
	CONSTRAINT `product_order_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tax` (
	`id` int AUTO_INCREMENT NOT NULL,
	`created_at` datetime,
	`value` float NOT NULL DEFAULT 0,
	CONSTRAINT `tax_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payment` (
	`id` int AUTO_INCREMENT NOT NULL,
	`value` decimal(10,2) NOT NULL DEFAULT 0,
	`payment_type_id` int,
	`billing_id` int,
	`datetime` datetime,
	`note` text,
	CONSTRAINT `payment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payment_type` (
	`id` int AUTO_INCREMENT NOT NULL,
	`by` varchar(255),
	CONSTRAINT `payment_type_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `document` (
	`id` int AUTO_INCREMENT NOT NULL,
	`datetime` datetime,
	`title` varchar(255),
	`content` text,
	`visit_id` int NOT NULL,
	CONSTRAINT `document_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `form_document` (
	`id` int AUTO_INCREMENT NOT NULL,
	`datetime` datetime,
	`title` varchar(255),
	`content` text,
	CONSTRAINT `form_document_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `test` (
	`id` int AUTO_INCREMENT NOT NULL,
	`float` float,
	`decimal` decimal(4,2),
	CONSTRAINT `test_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `words` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` varchar(255) NOT NULL,
	`text` text NOT NULL,
	CONSTRAINT `words_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `commune` ADD CONSTRAINT `commune_district_id_district_district_id_fk` FOREIGN KEY (`district_id`) REFERENCES `district`(`district_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `district` ADD CONSTRAINT `district_province_id_provice_provice_id_fk` FOREIGN KEY (`province_id`) REFERENCES `provice`(`provice_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `village` ADD CONSTRAINT `village_commune_id_commune_commune_id_fk` FOREIGN KEY (`commune_id`) REFERENCES `commune`(`commune_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `diagnosis` ADD CONSTRAINT `diagnosis_diagnosis_type_id_diagnosis_type_id_fk` FOREIGN KEY (`diagnosis_type_id`) REFERENCES `diagnosis_type`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `file_or_picture` ADD CONSTRAINT `file_or_picture_patient_id_patient_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `patient`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `file_or_picture` ADD CONSTRAINT `file_or_picture_imagerie_request_id_imagerie_request_id_fk` FOREIGN KEY (`imagerie_request_id`) REFERENCES `imagerie_request`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `file_or_picture` ADD CONSTRAINT `file_or_picture_clinicinfo_id_clinicinfo_id_fk` FOREIGN KEY (`clinicinfo_id`) REFERENCES `clinicinfo`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `file_or_picture` ADD CONSTRAINT `file_or_picture_laboratory_id_laboratory_id_fk` FOREIGN KEY (`laboratory_id`) REFERENCES `laboratory`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `file_or_picture` ADD CONSTRAINT `file_or_picture_payment_type_id_payment_type_id_fk` FOREIGN KEY (`payment_type_id`) REFERENCES `payment_type`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `file_or_picture` ADD CONSTRAINT `file_or_picture_billing_id_billing_id_fk` FOREIGN KEY (`billing_id`) REFERENCES `billing`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `file_or_picture` ADD CONSTRAINT `file_or_picture_payment_id_payment_id_fk` FOREIGN KEY (`payment_id`) REFERENCES `payment`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `file_or_picture` ADD CONSTRAINT `file_or_picture_document_id_document_id_fk` FOREIGN KEY (`document_id`) REFERENCES `document`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `file_or_picture` ADD CONSTRAINT `file_or_picture_product_id_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `laboratory` ADD CONSTRAINT `laboratory_visit_id_visit_id_fk` FOREIGN KEY (`visit_id`) REFERENCES `visit`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `laboratory_request` ADD CONSTRAINT `laboratory_request_product_id_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `laboratory_request` ADD CONSTRAINT `laboratory_request_visit_id_visit_id_fk` FOREIGN KEY (`visit_id`) REFERENCES `visit`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `laboratory_result` ADD CONSTRAINT `laboratory_result_laboratory_request_id_laboratory_request_id_fk` FOREIGN KEY (`laboratory_request_id`) REFERENCES `laboratory_request`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `laboratory_result` ADD CONSTRAINT `laboratory_result_parameter_id_parameter_id_fk` FOREIGN KEY (`parameter_id`) REFERENCES `parameter`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `parameter` ADD CONSTRAINT `parameter_unit_id_unit_id_fk` FOREIGN KEY (`unit_id`) REFERENCES `unit`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `parameter` ADD CONSTRAINT `parameter_product_id_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `patient` ADD CONSTRAINT `patient_village_id_village_village_id_fk` FOREIGN KEY (`village_id`) REFERENCES `village`(`village_id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `patient` ADD CONSTRAINT `patient_commune_id_commune_commune_id_fk` FOREIGN KEY (`commune_id`) REFERENCES `commune`(`commune_id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `patient` ADD CONSTRAINT `patient_district_id_district_district_id_fk` FOREIGN KEY (`district_id`) REFERENCES `district`(`district_id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `patient` ADD CONSTRAINT `patient_province_id_provice_provice_id_fk` FOREIGN KEY (`province_id`) REFERENCES `provice`(`provice_id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `physical` ADD CONSTRAINT `physical_exam_id_exam_id_fk` FOREIGN KEY (`exam_id`) REFERENCES `exam`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `physical_exam` ADD CONSTRAINT `physical_exam_physical_id_physical_id_fk` FOREIGN KEY (`physical_id`) REFERENCES `physical`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `physical_exam` ADD CONSTRAINT `physical_exam_visit_id_visit_id_fk` FOREIGN KEY (`visit_id`) REFERENCES `visit`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `inventory` ADD CONSTRAINT `inventory_product_id_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product` ADD CONSTRAINT `product_group_type_id_product_group_type_id_fk` FOREIGN KEY (`group_type_id`) REFERENCES `product_group_type`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product` ADD CONSTRAINT `product_laboratory_group_id_laboratory_group_id_fk` FOREIGN KEY (`laboratory_group_id`) REFERENCES `laboratory_group`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product` ADD CONSTRAINT `product_imagerie_group_id_imagerie_group_id_fk` FOREIGN KEY (`imagerie_group_id`) REFERENCES `imagerie_group`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product` ADD CONSTRAINT `product_unit_id_unit_id_fk` FOREIGN KEY (`unit_id`) REFERENCES `unit`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sub_unit` ADD CONSTRAINT `sub_unit_inventory_id_inventory_id_fk` FOREIGN KEY (`inventory_id`) REFERENCES `inventory`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sub_unit` ADD CONSTRAINT `sub_unit_unit_id_unit_id_fk` FOREIGN KEY (`unit_id`) REFERENCES `unit`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subjective` ADD CONSTRAINT `subjective_visit_id_visit_id_fk` FOREIGN KEY (`visit_id`) REFERENCES `visit`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `user` ADD CONSTRAINT `user_staff_id_staff_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `unit` ADD CONSTRAINT `unit_product_group_type_id_product_group_type_id_fk` FOREIGN KEY (`product_group_type_id`) REFERENCES `product_group_type`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `appointment_injection` ADD CONSTRAINT `appointment_injection_injection_id_injection_id_fk` FOREIGN KEY (`injection_id`) REFERENCES `injection`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `injection` ADD CONSTRAINT `injection_patient_id_patient_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `patient`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `injection` ADD CONSTRAINT `injection_unit_id_unit_id_fk` FOREIGN KEY (`unit_id`) REFERENCES `unit`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vaccine` ADD CONSTRAINT `vaccine_visit_id_visit_id_fk` FOREIGN KEY (`visit_id`) REFERENCES `visit`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vaccine` ADD CONSTRAINT `vaccine_injection_id_injection_id_fk` FOREIGN KEY (`injection_id`) REFERENCES `injection`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vaccine` ADD CONSTRAINT `vaccine_product_id_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bed_ipd` ADD CONSTRAINT `bed_ipd_bed_id_bed_id_fk` FOREIGN KEY (`bed_id`) REFERENCES `bed`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `nursing_process` ADD CONSTRAINT `nursing_process_nursing_sign_staff_id_fk` FOREIGN KEY (`nursing_sign`) REFERENCES `staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `nursing_process` ADD CONSTRAINT `nursing_process_progress_note_id_progress_note_id_fk` FOREIGN KEY (`progress_note_id`) REFERENCES `progress_note`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `progress_note` ADD CONSTRAINT `progress_note_staff_id_staff_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `progress_note` ADD CONSTRAINT `progress_note_department_id_department_id_fk` FOREIGN KEY (`department_id`) REFERENCES `department`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `progress_note` ADD CONSTRAINT `progress_note_patient_id_patient_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `patient`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `progress_note` ADD CONSTRAINT `progress_note_bed_id_bed_id_fk` FOREIGN KEY (`bed_id`) REFERENCES `bed`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `visit` ADD CONSTRAINT `visit_patient_id_patient_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `patient`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `visit` ADD CONSTRAINT `visit_department_id_department_id_fk` FOREIGN KEY (`department_id`) REFERENCES `department`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `visit` ADD CONSTRAINT `visit_staff_id_staff_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `visit` ADD CONSTRAINT `visit_progress_note_id_progress_note_id_fk` FOREIGN KEY (`progress_note_id`) REFERENCES `progress_note`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vital_sign` ADD CONSTRAINT `vital_sign_visit_id_visit_id_fk` FOREIGN KEY (`visit_id`) REFERENCES `visit`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `vital_sign` ADD CONSTRAINT `vital_sign_by_staff_id_fk` FOREIGN KEY (`by`) REFERENCES `staff`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vital_sign` ADD CONSTRAINT `vital_sign_progress_note_id_progress_note_id_fk` FOREIGN KEY (`progress_note_id`) REFERENCES `progress_note`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `imagerie_request` ADD CONSTRAINT `imagerie_request_product_id_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `imagerie_request` ADD CONSTRAINT `imagerie_request_visit_id_visit_id_fk` FOREIGN KEY (`visit_id`) REFERENCES `visit`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `advice_teaching` ADD CONSTRAINT `advice_teaching_visit_id_visit_id_fk` FOREIGN KEY (`visit_id`) REFERENCES `visit`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `active_presrciption` ADD CONSTRAINT `active_presrciption_presrciption_id_presrciption_id_fk` FOREIGN KEY (`presrciption_id`) REFERENCES `presrciption`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `active_presrciption` ADD CONSTRAINT `active_presrciption_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `presrciption` ADD CONSTRAINT `presrciption_visit_id_visit_id_fk` FOREIGN KEY (`visit_id`) REFERENCES `visit`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `presrciption` ADD CONSTRAINT `presrciption_product_id_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `appointment` ADD CONSTRAINT `appointment_visit_id_visit_id_fk` FOREIGN KEY (`visit_id`) REFERENCES `visit`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `appointment` ADD CONSTRAINT `appointment_progress_note_id_progress_note_id_fk` FOREIGN KEY (`progress_note_id`) REFERENCES `progress_note`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `remark` ADD CONSTRAINT `remark_visit_id_visit_id_fk` FOREIGN KEY (`visit_id`) REFERENCES `visit`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `service` ADD CONSTRAINT `service_visit_id_visit_id_fk` FOREIGN KEY (`visit_id`) REFERENCES `visit`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `service` ADD CONSTRAINT `service_progress_note_id_progress_note_id_fk` FOREIGN KEY (`progress_note_id`) REFERENCES `progress_note`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `service` ADD CONSTRAINT `service_product_id_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `operation_protocol` ADD CONSTRAINT `operation_protocol_service_id_service_id_fk` FOREIGN KEY (`service_id`) REFERENCES `service`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `bed` ADD CONSTRAINT `bed_room_id_room_id_fk` FOREIGN KEY (`room_id`) REFERENCES `room`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `bed` ADD CONSTRAINT `bed_ward_id_ward_id_fk` FOREIGN KEY (`ward_id`) REFERENCES `ward`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `room` ADD CONSTRAINT `room_product_id_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `room` ADD CONSTRAINT `room_ward_id_ward_id_fk` FOREIGN KEY (`ward_id`) REFERENCES `ward`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `accessment` ADD CONSTRAINT `accessment_visit_id_visit_id_fk` FOREIGN KEY (`visit_id`) REFERENCES `visit`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `accessment` ADD CONSTRAINT `accessment_progress_note_id_progress_note_id_fk` FOREIGN KEY (`progress_note_id`) REFERENCES `progress_note`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `billing` ADD CONSTRAINT `billing_visit_id_visit_id_fk` FOREIGN KEY (`visit_id`) REFERENCES `visit`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `billing` ADD CONSTRAINT `billing_progress_note_id_progress_note_id_fk` FOREIGN KEY (`progress_note_id`) REFERENCES `progress_note`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `charge` ADD CONSTRAINT `charge_billing_id_billing_id_fk` FOREIGN KEY (`billing_id`) REFERENCES `billing`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_order` ADD CONSTRAINT `product_order_product_id_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_order` ADD CONSTRAINT `product_order_charge_id_charge_id_fk` FOREIGN KEY (`charge_id`) REFERENCES `charge`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment` ADD CONSTRAINT `payment_payment_type_id_payment_type_id_fk` FOREIGN KEY (`payment_type_id`) REFERENCES `payment_type`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment` ADD CONSTRAINT `payment_billing_id_billing_id_fk` FOREIGN KEY (`billing_id`) REFERENCES `billing`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `document` ADD CONSTRAINT `document_visit_id_visit_id_fk` FOREIGN KEY (`visit_id`) REFERENCES `visit`(`id`) ON DELETE cascade ON UPDATE cascade;