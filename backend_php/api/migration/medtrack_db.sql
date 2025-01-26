-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 26, 2025 at 03:40 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `medtrack_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `appointment_id` int(11) NOT NULL,
  `slot_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `purpose` varchar(255) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `clinicstaff`
--

CREATE TABLE `clinicstaff` (
  `staff_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `domain_account` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `address` text DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `role` enum('admin','staff','doctor') NOT NULL DEFAULT 'staff',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_login` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clinicstaff`
--

INSERT INTO `clinicstaff` (`staff_id`, `first_name`, `last_name`, `domain_account`, `password`, `email`, `address`, `contact_number`, `role`, `is_active`, `created_at`, `updated_at`, `last_login`) VALUES
(7, 'Jayvee', 'Mayor', '202210768', '$2y$10$.SW4BOxWqHEFHX.crLEcz.24EjXRz3zfLyMrq.m9d8F8OPOIV.1za', '202210768@gordoncollege.edu.ph', 'Subic', '09511186442', 'staff', 1, '2025-01-14 11:42:53', '2025-01-14 11:42:53', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `medical_documents`
--

CREATE TABLE `medical_documents` (
  `document_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `document_type` varchar(50) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `date` date DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `status` enum('Pending','Submitted','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medical_documents`
--

INSERT INTO `medical_documents` (`document_id`, `user_id`, `document_type`, `file_path`, `date`, `location`, `status`, `uploaded_at`) VALUES
(63, 19, 'bloodCount', 'uploads/19/medical_documents/bloodCount/1737590145_6791858145720_testdocument.png', '2025-01-23', 'fdgdf', 'Submitted', '2025-01-22 23:55:45'),
(64, 19, 'urinalysis', 'uploads/19/medical_documents/urinalysis/1737589276_6791821cb80f4_testdocument.png', '2025-01-23', 'Subic', 'Submitted', '2025-01-22 23:41:16'),
(66, 20, 'bloodCount', 'uploads/20/medical_documents/bloodCount/1737846924_6795708ce59b7_dupal.jpg', '2025-01-27', 'HAYSSSCCSBINIGAY', 'Submitted', '2025-01-25 23:15:24'),
(67, 20, 'urinalysis', 'uploads/20/medical_documents/urinalysis/1737842741_679560356ae94_testdocument.png', '2025-01-26', 'sdfsdf', 'Submitted', '2025-01-25 22:05:41'),
(68, 20, 'chestXray', 'uploads/20/medical_documents/chestXray/1737843897_679564b994efc_testdocument.png', '2025-01-26', 'sdfsadf', 'Submitted', '2025-01-25 22:24:57'),
(70, 20, 'antiHAV', 'uploads/20/medical_documents/antiHAV/1737844209_679565f1af06c_revision.png', '2025-01-29', 'dASD', 'Submitted', '2025-01-25 22:30:09'),
(72, 20, 'fecalysis', 'uploads/20/medical_documents/fecalysis/1737844235_6795660b2d4d7_revision.png', '2025-01-26', 'asdfasdfsdf', 'Submitted', '2025-01-25 22:30:35'),
(76, 21, 'bloodCount', 'uploads/21/medical_documents/bloodCount/1737902242_679648a2bc5ea_testdocument.png', '2025-01-26', 'Subic', 'Submitted', '2025-01-26 14:37:22'),
(77, 21, 'urinalysis', 'uploads/21/medical_documents/urinalysis/1737902264_679648b8c8af1_testdocument.png', '2025-01-26', 'Subic', 'Submitted', '2025-01-26 14:37:44'),
(78, 21, 'chestXray', 'uploads/21/medical_documents/chestXray/1737902285_679648cd6cc5c_testdocument.png', '2025-01-26', 'Subic', 'Submitted', '2025-01-26 14:38:05');

-- --------------------------------------------------------

--
-- Table structure for table `time_slots`
--

CREATE TABLE `time_slots` (
  `slot_id` int(11) NOT NULL,
  `day_of_week` varchar(20) NOT NULL,
  `start_time` varchar(10) DEFAULT NULL,
  `end_time` varchar(10) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `student_limit` int(11) NOT NULL DEFAULT 10,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `domain_account` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `domain_account`, `password`, `created_at`) VALUES
(19, '202210272@gordoncollege.edu.ph', '$2y$10$0z3wjOiHqkKXetA/uahwkOIKA3XcOVXfFL.OPJ4bIBz7N4LP.xw9.', '2025-01-22 22:29:47'),
(20, '202011035@gordoncollege.edu.ph', '$2y$10$wsNbV8tHNOB5laC/.p4bp.znpzCEATQHvxD323121iTE5BIINjRLO', '2025-01-25 21:38:50'),
(21, '202210768@gordoncollege.edu.ph', '$2y$10$zPDdTedVlEqprnVAduelAOtHYOtHoxcxeBXDasdXwRK.0.a2/wvvW', '2025-01-26 14:31:19');

-- --------------------------------------------------------

--
-- Table structure for table `user_profiles`
--

CREATE TABLE `user_profiles` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `department` varchar(255) NOT NULL,
  `program` varchar(255) NOT NULL,
  `year_level` int(11) NOT NULL,
  `id_number` varchar(50) NOT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `profile_image_path` varchar(255) DEFAULT NULL,
  `contact_number` varchar(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_profiles`
--

INSERT INTO `user_profiles` (`id`, `user_id`, `first_name`, `last_name`, `middle_name`, `department`, `program`, `year_level`, `id_number`, `profile_image`, `profile_image_path`, `contact_number`) VALUES
(16, 19, 'Jeremy', 'Marron', 'Alamat', 'CBA', 'BSA', 1, '202210272', NULL, 'uploads/19/profile_images/1737585075_679171b360b5d.png', '09511186442'),
(17, 20, 'Aljhon', 'Dupal', 'Alamat', 'CHTM', 'BSHM', 3, '202011035', NULL, 'uploads/20/profile_images/1737841213_67955a3dab86e.jpg', '09511186442'),
(18, 21, 'Jayvee', 'Mayor', 'Apiag', 'CCS', 'BSIT', 3, '202210768', NULL, 'uploads/21/profile_images/1737901920_67964760d7a4e.png', '09511186442');

-- --------------------------------------------------------

--
-- Table structure for table `vaccination_records`
--

CREATE TABLE `vaccination_records` (
  `record_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `first_dose_type` varchar(100) NOT NULL,
  `first_dose_date` date NOT NULL,
  `second_dose_type` varchar(100) NOT NULL,
  `second_dose_date` date NOT NULL,
  `booster_type` varchar(100) DEFAULT NULL,
  `booster_date` date DEFAULT NULL,
  `document_path` varchar(255) NOT NULL,
  `status` enum('Pending','Submitted','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vaccination_records`
--

INSERT INTO `vaccination_records` (`record_id`, `user_id`, `first_dose_type`, `first_dose_date`, `second_dose_type`, `second_dose_date`, `booster_type`, `booster_date`, `document_path`, `status`, `uploaded_at`) VALUES
(9, 20, 'dsafsa', '2025-01-26', 'sdfsadf', '2025-01-26', 'sadfsadf', '2025-01-26', 'uploads/20/vaccination_records/1737841524_67955b743e9b6_testdocument.png', 'Submitted', '2025-01-25 21:45:24'),
(12, 21, 'Cobra Venum', '2025-01-26', 'Cobra Venum', '2025-01-26', 'Cobra Venum', '2025-01-26', 'uploads/21/vaccination_records/1737902379_6796492bebbc3_testdocument.png', 'Submitted', '2025-01-26 14:39:39'),
(13, 21, 'Cobra Venum', '2025-01-26', 'Cobra Venum', '2025-01-26', 'Cobra Venum', '2025-01-26', 'uploads/21/vaccination_records/1737902379_6796492beda9f_testdocument.png', 'Submitted', '2025-01-26 14:39:39'),
(14, 21, 'Cobra Venum', '2025-01-26', 'Cobra Venum', '2025-01-26', 'Cobra Venum', '2025-01-26', 'uploads/21/vaccination_records/1737902380_6796492c00ce5_testdocument.png', 'Submitted', '2025-01-26 14:39:40'),
(15, 21, 'Cobra Venum', '2025-01-26', 'Cobra Venum', '2025-01-26', 'Cobra Venum', '2025-01-26', 'uploads/21/vaccination_records/1737902380_6796492c08886_testdocument.png', 'Submitted', '2025-01-26 14:39:40');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`appointment_id`),
  ADD KEY `slot_id` (`slot_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `clinicstaff`
--
ALTER TABLE `clinicstaff`
  ADD PRIMARY KEY (`staff_id`),
  ADD UNIQUE KEY `domain_account` (`domain_account`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `medical_documents`
--
ALTER TABLE `medical_documents`
  ADD PRIMARY KEY (`document_id`),
  ADD UNIQUE KEY `unique_user_document` (`user_id`,`document_type`);

--
-- Indexes for table `time_slots`
--
ALTER TABLE `time_slots`
  ADD PRIMARY KEY (`slot_id`),
  ADD KEY `idx_day_of_week` (`day_of_week`),
  ADD KEY `idx_date` (`date`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `vaccination_records`
--
ALTER TABLE `vaccination_records`
  ADD PRIMARY KEY (`record_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `appointment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `clinicstaff`
--
ALTER TABLE `clinicstaff`
  MODIFY `staff_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `medical_documents`
--
ALTER TABLE `medical_documents`
  MODIFY `document_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT for table `time_slots`
--
ALTER TABLE `time_slots`
  MODIFY `slot_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `user_profiles`
--
ALTER TABLE `user_profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `vaccination_records`
--
ALTER TABLE `vaccination_records`
  MODIFY `record_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `fk_appointment_slot` FOREIGN KEY (`slot_id`) REFERENCES `time_slots` (`slot_id`),
  ADD CONSTRAINT `fk_appointment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `medical_documents`
--
ALTER TABLE `medical_documents`
  ADD CONSTRAINT `medical_documents_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `vaccination_records`
--
ALTER TABLE `vaccination_records`
  ADD CONSTRAINT `vaccination_records_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
