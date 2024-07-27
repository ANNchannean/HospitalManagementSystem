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
	`laboratory_request_id` int,
	CONSTRAINT `file_or_picture_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `laboratory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visit_id` int,
	`status` boolean DEFAULT false,
	`created_at` datetime,
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
	`laboratory` int,
	`status` boolean DEFAULT false,
	CONSTRAINT `laboratory_request_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `laboratory_result` (
	`id` int AUTO_INCREMENT NOT NULL,
	`laboratory_request_id` int,
	`parameter_id` int,
	`result` varchar(255),
	`comment` text,
	CONSTRAINT `laboratory_result_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `parameter` (
	`id` int AUTO_INCREMENT NOT NULL,
	`parameter` varchar(255),
	`description` longtext,
	`gender` varchar(255),
	`sign` varchar(255) DEFAULT '-',
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
	`telephone` varchar(255) NOT NULL,
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
CREATE TABLE `product` (
	`id` int AUTO_INCREMENT NOT NULL,
	`products` text NOT NULL,
	`group_type_id` int,
	`laboratory_group_id` int,
	`imagerie_group_id` int,
	`price` float NOT NULL,
	`unit_id` int,
	CONSTRAINT `product_id` PRIMARY KEY(`id`)
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
	`staff_type` varchar(255) DEFAULT 'DOCTOR',
	`gender` varchar(255) NOT NULL,
	`specific` varchar(255),
	CONSTRAINT `staff_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subjective` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cheif_complaint` longtext,
	`past_history` varchar(255),
	`present_illness` varchar(255),
	`past_medicine_history` varchar(255),
	`allesgy_medicine` varchar(255),
	`surgical_history` varchar(255),
	`familly_history` varchar(255),
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
	`hashed_password` text,
	`role` text NOT NULL,
	`image` varchar(255) NOT NULL,
	`limit_view` int NOT NULL DEFAULT 20,
	`lang` varchar(255) NOT NULL DEFAULT 'ko',
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `unit` (
	`id` int AUTO_INCREMENT NOT NULL,
	`unit` varchar(255),
	`product_group_type_id` int,
	CONSTRAINT `unit_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vaccine` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visit_id` int,
	`vaccine_type_id` int,
	`discription` varchar(255),
	CONSTRAINT `vaccine_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vaccine_type` (
	`id` int AUTO_INCREMENT NOT NULL,
	`department` varchar(255) NOT NULL,
	CONSTRAINT `vaccine_type_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `progress_note` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date_checkup` datetime,
	`date_checkout` datetime,
	`patient_id` int,
	CONSTRAINT `progress_note_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `visit` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date_checkup` datetime,
	`patient_id` int,
	`department_id` int,
	`staff_id` int,
	`checkin_type` varchar(255) NOT NULL,
	`etiology` varchar(255),
	`progress_note_id` int,
	CONSTRAINT `visit_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vital_sign` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bp` int,
	`dbp` int,
	`sbp` int,
	`pulse` int,
	`t` int,
	`sp02` int,
	`height` int,
	`weight` int,
	`bmi` int,
	`note` text,
	`visit_id` int,
	CONSTRAINT `vital_sign_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `imagerie` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visit_id` int,
	`created_at` datetime,
	CONSTRAINT `imagerie_id` PRIMARY KEY(`id`)
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
	`imagerie_id` int,
	`text` text,
	`status` boolean DEFAULT false,
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
CREATE TABLE `presrciption` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visit_id` int,
	`product_id` int,
	`use_id` int,
	`duration_id` int,
	`amount` float,
	CONSTRAINT `presrciption_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `use` (
	`id` int AUTO_INCREMENT NOT NULL,
	`description` varchar(255),
	CONSTRAINT `use_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `use_time` (
	`id` int AUTO_INCREMENT NOT NULL,
	`description` varchar(255),
	CONSTRAINT `use_time_id` PRIMARY KEY(`id`)
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
CREATE TABLE `backup` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date_checkup` datetime NOT NULL,
	`name_backup` varchar(255) NOT NULL,
	CONSTRAINT `backup_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `commune` ADD CONSTRAINT `commune_district_id_district_district_id_fk` FOREIGN KEY (`district_id`) REFERENCES `district`(`district_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `district` ADD CONSTRAINT `district_province_id_provice_provice_id_fk` FOREIGN KEY (`province_id`) REFERENCES `provice`(`provice_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `village` ADD CONSTRAINT `village_commune_id_commune_commune_id_fk` FOREIGN KEY (`commune_id`) REFERENCES `commune`(`commune_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `diagnosis` ADD CONSTRAINT `diagnosis_diagnosis_type_id_diagnosis_type_id_fk` FOREIGN KEY (`diagnosis_type_id`) REFERENCES `diagnosis_type`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `file_or_picture` ADD CONSTRAINT `file_or_picture_patient_id_patient_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `patient`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `file_or_picture` ADD CONSTRAINT `file_or_picture_imagerie_request_id_imagerie_request_id_fk` FOREIGN KEY (`imagerie_request_id`) REFERENCES `imagerie_request`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `file_or_picture` ADD CONSTRAINT `file_or_picture_laboratory_request_id_laboratory_request_id_fk` FOREIGN KEY (`laboratory_request_id`) REFERENCES `laboratory_request`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `laboratory` ADD CONSTRAINT `laboratory_visit_id_visit_id_fk` FOREIGN KEY (`visit_id`) REFERENCES `visit`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `laboratory_request` ADD CONSTRAINT `laboratory_request_product_id_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `laboratory_request` ADD CONSTRAINT `laboratory_request_laboratory_laboratory_id_fk` FOREIGN KEY (`laboratory`) REFERENCES `laboratory`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `laboratory_result` ADD CONSTRAINT `laboratory_result_laboratory_request_id_laboratory_request_id_fk` FOREIGN KEY (`laboratory_request_id`) REFERENCES `laboratory_request`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `laboratory_result` ADD CONSTRAINT `laboratory_result_parameter_id_parameter_id_fk` FOREIGN KEY (`parameter_id`) REFERENCES `parameter`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `parameter` ADD CONSTRAINT `parameter_unit_id_unit_id_fk` FOREIGN KEY (`unit_id`) REFERENCES `unit`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `parameter` ADD CONSTRAINT `parameter_product_id_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `patient` ADD CONSTRAINT `patient_village_id_village_village_id_fk` FOREIGN KEY (`village_id`) REFERENCES `village`(`village_id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `patient` ADD CONSTRAINT `patient_commune_id_commune_commune_id_fk` FOREIGN KEY (`commune_id`) REFERENCES `commune`(`commune_id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `patient` ADD CONSTRAINT `patient_district_id_district_district_id_fk` FOREIGN KEY (`district_id`) REFERENCES `district`(`district_id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `patient` ADD CONSTRAINT `patient_province_id_provice_provice_id_fk` FOREIGN KEY (`province_id`) REFERENCES `provice`(`provice_id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `physical` ADD CONSTRAINT `physical_exam_id_exam_id_fk` FOREIGN KEY (`exam_id`) REFERENCES `exam`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `physical_exam` ADD CONSTRAINT `physical_exam_physical_id_physical_id_fk` FOREIGN KEY (`physical_id`) REFERENCES `physical`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `physical_exam` ADD CONSTRAINT `physical_exam_visit_id_visit_id_fk` FOREIGN KEY (`visit_id`) REFERENCES `visit`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product` ADD CONSTRAINT `product_group_type_id_product_group_type_id_fk` FOREIGN KEY (`group_type_id`) REFERENCES `product_group_type`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product` ADD CONSTRAINT `product_laboratory_group_id_laboratory_group_id_fk` FOREIGN KEY (`laboratory_group_id`) REFERENCES `laboratory_group`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product` ADD CONSTRAINT `product_imagerie_group_id_imagerie_group_id_fk` FOREIGN KEY (`imagerie_group_id`) REFERENCES `imagerie_group`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product` ADD CONSTRAINT `product_unit_id_unit_id_fk` FOREIGN KEY (`unit_id`) REFERENCES `unit`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subjective` ADD CONSTRAINT `subjective_visit_id_visit_id_fk` FOREIGN KEY (`visit_id`) REFERENCES `visit`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `unit` ADD CONSTRAINT `unit_product_group_type_id_product_group_type_id_fk` FOREIGN KEY (`product_group_type_id`) REFERENCES `product_group_type`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vaccine` ADD CONSTRAINT `vaccine_visit_id_visit_id_fk` FOREIGN KEY (`visit_id`) REFERENCES `visit`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vaccine` ADD CONSTRAINT `vaccine_vaccine_type_id_vaccine_type_id_fk` FOREIGN KEY (`vaccine_type_id`) REFERENCES `vaccine_type`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `progress_note` ADD CONSTRAINT `progress_note_patient_id_patient_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `patient`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `visit` ADD CONSTRAINT `visit_patient_id_patient_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `patient`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `visit` ADD CONSTRAINT `visit_department_id_department_id_fk` FOREIGN KEY (`department_id`) REFERENCES `department`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `visit` ADD CONSTRAINT `visit_staff_id_staff_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `visit` ADD CONSTRAINT `visit_progress_note_id_progress_note_id_fk` FOREIGN KEY (`progress_note_id`) REFERENCES `progress_note`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vital_sign` ADD CONSTRAINT `vital_sign_visit_id_visit_id_fk` FOREIGN KEY (`visit_id`) REFERENCES `visit`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `imagerie` ADD CONSTRAINT `imagerie_visit_id_visit_id_fk` FOREIGN KEY (`visit_id`) REFERENCES `visit`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `imagerie_request` ADD CONSTRAINT `imagerie_request_product_id_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `imagerie_request` ADD CONSTRAINT `imagerie_request_imagerie_id_imagerie_id_fk` FOREIGN KEY (`imagerie_id`) REFERENCES `imagerie`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `advice_teaching` ADD CONSTRAINT `advice_teaching_visit_id_visit_id_fk` FOREIGN KEY (`visit_id`) REFERENCES `visit`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `presrciption` ADD CONSTRAINT `presrciption_visit_id_visit_id_fk` FOREIGN KEY (`visit_id`) REFERENCES `visit`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `presrciption` ADD CONSTRAINT `presrciption_product_id_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `presrciption` ADD CONSTRAINT `presrciption_use_id_use_id_fk` FOREIGN KEY (`use_id`) REFERENCES `use`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `presrciption` ADD CONSTRAINT `presrciption_duration_id_duration_id_fk` FOREIGN KEY (`duration_id`) REFERENCES `duration`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `appointment` ADD CONSTRAINT `appointment_visit_id_visit_id_fk` FOREIGN KEY (`visit_id`) REFERENCES `visit`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `remark` ADD CONSTRAINT `remark_visit_id_visit_id_fk` FOREIGN KEY (`visit_id`) REFERENCES `visit`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `service` ADD CONSTRAINT `service_visit_id_visit_id_fk` FOREIGN KEY (`visit_id`) REFERENCES `visit`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `service` ADD CONSTRAINT `service_product_id_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `operation_protocol` ADD CONSTRAINT `operation_protocol_service_id_service_id_fk` FOREIGN KEY (`service_id`) REFERENCES `service`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bed` ADD CONSTRAINT `bed_room_id_room_id_fk` FOREIGN KEY (`room_id`) REFERENCES `room`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `bed` ADD CONSTRAINT `bed_ward_id_ward_id_fk` FOREIGN KEY (`ward_id`) REFERENCES `ward`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `room` ADD CONSTRAINT `room_product_id_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `room` ADD CONSTRAINT `room_ward_id_ward_id_fk` FOREIGN KEY (`ward_id`) REFERENCES `ward`(`id`) ON DELETE cascade ON UPDATE cascade;