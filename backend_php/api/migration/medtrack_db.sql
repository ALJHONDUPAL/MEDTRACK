-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 22, 2025 at 01:27 AM
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
(46, 5, 'bloodCount', 'uploads/5/medical_documents/bloodCount/1737481356_678fdc8c0cba3_testdocument.png', '2025-01-22', 'Subic', 'Submitted', '2025-01-21 17:42:36'),
(47, 11, 'bloodCount', 'uploads/11/medical_documents/bloodCount/1737482425_678fe0b96ab3f_testdocument.png', '2025-01-22', 'Olongapo', 'Submitted', '2025-01-21 18:00:25'),
(48, 11, 'urinalysis', 'uploads/11/medical_documents/urinalysis/1737482441_678fe0c946137_testdocument.png', '2025-01-22', 'Olongapo', 'Submitted', '2025-01-21 18:00:41'),
(49, 11, 'antiHBS', 'uploads/11/medical_documents/antiHBS/1737482522_678fe11a7369a_testdocument.png', '2025-01-22', 'Olongapo', 'Submitted', '2025-01-21 18:02:02'),
(50, 11, 'fluVaccine', 'uploads/11/medical_documents/fluVaccine/1737482560_678fe140ba6ae_testdocument.png', '2025-01-22', 'Olongapo', 'Submitted', '2025-01-21 18:02:40'),
(51, 11, 'hepaBVaccine', 'uploads/11/medical_documents/hepaBVaccine/1737482590_678fe15e97d8a_testdocument.png', '2025-01-22', 'Olongapo', 'Submitted', '2025-01-21 18:03:10'),
(52, 6, 'fecalysis', 'uploads/6/medical_documents/fecalysis/1737483048_678fe328367df_testdocument.png', '2025-01-22', 'Olongapo', 'Submitted', '2025-01-21 18:10:48'),
(53, 6, 'antiHAV', 'uploads/6/medical_documents/antiHAV/1737483083_678fe34bc96d9_testdocument.png', '2025-01-22', 'Olongapo', 'Submitted', '2025-01-21 18:11:23'),
(54, 11, 'chestXray', 'uploads/11/medical_documents/chestXray/1737484373_678fe855d2ade_testdocument.png', '2025-01-22', 'Olongapo', 'Submitted', '2025-01-21 18:32:53');

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

--
-- Dumping data for table `time_slots`
--

INSERT INTO `time_slots` (`slot_id`, `day_of_week`, `start_time`, `end_time`, `date`, `student_limit`, `created_at`, `updated_at`) VALUES
(5, 'WEDNESDAY', '09:00 AM', '09:30 AM', '2025-01-23', 5, '2025-01-21 17:46:11', '2025-01-21 17:46:11'),
(6, 'MONDAY', '09:00 AM', '09:30 AM', '2025-01-22', 2, '2025-01-21 18:30:13', '2025-01-21 18:30:13');

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
(5, '202210768@gordoncollege.edu.ph', '$2y$10$zw141f6bPOvqt3qH9JlIbeqiFWCekjDOdvv9GcMbMmW3qr0iJYDX6', '2025-01-06 09:15:45'),
(6, '202011035@gordoncollege.edu.ph', '$2y$10$qy1j88kHTEa4XrIMn56rXu.EjkcazjftAtW4FT5oBmiTxhh9ni9wu', '2025-01-07 18:30:29'),
(7, '202210465@gordoncollege.edu.ph', '$2y$10$2dqKmJ3e/OPAco9TzeCWSOzV26N5rB3x9sNORmjRQkhK9Y7sBmguS', '2025-01-10 17:25:01'),
(8, '202210445@gordoncollege.edu.ph', '$2y$10$/y75kFLswsF45HBcJtrpYeamsfoX7s1I7/wleUpKaaYcckzelMLZO', '2025-01-10 17:30:00'),
(9, '202211183@gordoncollege.edu.ph', '$2y$10$xnqC769w9pr1EbteZZ/IKO/CFntv039bZR46ANIwtzzNichqyBDNS', '2025-01-10 20:25:54'),
(10, '202211168@gordoncollege.edu.ph', '$2y$10$1ss0rKPKdqmc38SYmZ.EVuGTq4Jqd4Xc21jO9h9FrVbW4uHxSan56', '2025-01-10 20:28:14'),
(11, '202210272@gordoncollege.edu.ph', '$2y$10$Dr8RxHlkPzkTTONs22YCretUuchkEdqnqZsNTtglGPXMd.Mbacblq', '2025-01-21 17:57:23');

-- --------------------------------------------------------

--
-- Table structure for table `user_profiles`
--

CREATE TABLE `user_profiles` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `year_level` int(11) NOT NULL,
  `id_number` varchar(50) NOT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `profile_image_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_profiles`
--

INSERT INTO `user_profiles` (`id`, `user_id`, `name`, `department`, `year_level`, `id_number`, `profile_image`, `profile_image_path`) VALUES
(7, 5, 'Jayvee Mayor', 'CCS', 3, '202210768', NULL, 'uploads/5/profile_images/1737481163_678fdbcb76f54.jpg'),
(8, 6, 'Al Jhon ', 'CHTM-Hospitality', 3, '202011035', NULL, 'uploads/6/profile_images/1737482103_678fdf775075b.jpg'),
(9, 11, 'Jeremy Marron', 'CAHS', 3, '202210272', NULL, 'uploads/11/profile_images/1737482360_678fe07881bb4.jpg');

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
(8, 11, 'Fizzer', '2025-01-22', 'Fizzer', '2025-01-22', 'Fizzer', '2025-01-22', 'uploads/11/vaccination_records/1737482495_678fe0ff61ad6_testdocument.png', 'Submitted', '2025-01-21 18:01:35');

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
  MODIFY `document_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `time_slots`
--
ALTER TABLE `time_slots`
  MODIFY `slot_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `user_profiles`
--
ALTER TABLE `user_profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `vaccination_records`
--
ALTER TABLE `vaccination_records`
  MODIFY `record_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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
