-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 15, 2025 at 08:35 PM
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

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`appointment_id`, `slot_id`, `user_id`, `purpose`, `status`, `created_at`) VALUES
(3, 1, 5, 'Medical', 'Pending', '2025-01-15 19:23:47');

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
(4, 'clinic', 'staff', 'clinicstaff', '$2y$10$y/bAa63GRnx9qZPtudNyOuOsd5s9Ehd0b7rNhWMt2i/aSqoiTjydW', 'clinicstaff@gordoncollege.edu.ph', 'Subic', '09511186442', 'staff', 1, '2024-12-14 13:08:59', '2024-12-14 13:08:59', NULL),
(5, 'test', 'test', 'test', '$2y$10$0sNdNqR3a34eCmKXtkLYD.QS3/crTU.DLmx6NM8JOiCuubsZrtQFG', 'test@gordoncollege.edu.ph', 'Subic', '09511186442', 'staff', 1, '2024-12-14 20:52:13', '2024-12-14 20:52:13', NULL),
(6, 'asdASD', 'sdasdsdf', 'dssadf', '$2y$10$6M0G8Y48BeILNA3e3szoCe.J2r2UGJDON6snCPMpRGfvpdN3k.8Tq', 'dssadf@gordoncollege.edu.ph', 'asdfasfasdfa', '09511186442', 'staff', 1, '2024-12-14 20:57:00', '2024-12-14 20:57:00', NULL),
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
(24, 5, 'bloodCount', 'uploads/5/medical_documents/bloodCount/1736526827_67814beb0e7ff_Yatiiiii.png', '2025-01-11', 'Subic', 'Submitted', '2025-01-10 16:33:47'),
(25, 5, 'urinalysis', 'uploads/5/medical_documents/urinalysis/1736526839_67814bf711e82_Yatiiiii.png', '2025-01-11', 'undefined', 'Submitted', '2025-01-10 16:33:59'),
(26, 5, 'chestXray', 'uploads/5/medical_documents/chestXray/1736526858_67814c0a00cd7_Yatiiiii.png', '2025-01-11', 'subic', 'Submitted', '2025-01-10 16:34:18'),
(27, 7, 'bloodCount', 'uploads/7/medical_documents/bloodCount/1736530036_6781587474f5b_466542816_2012909459129945_5233219466458689157_n.png', '2025-01-11', 'aSDASD', 'Submitted', '2025-01-10 17:27:16'),
(28, 7, 'urinalysis', 'uploads/7/medical_documents/urinalysis/1736530051_6781588308601_Yatiiiii.png', '2025-01-11', 'ASDASD', 'Submitted', '2025-01-10 17:27:31'),
(29, 7, 'chestXray', 'uploads/7/medical_documents/chestXray/1736530081_678158a1efd3e_a393e55cd98cb900.png', '2025-01-11', 'undefined', 'Submitted', '2025-01-10 17:28:01'),
(30, 8, 'chestXray', 'uploads/8/medical_documents/chestXray/1736537208_67817478f0227_Yatiiiii.png', '2025-01-11', 'asdfsdf', 'Submitted', '2025-01-10 19:26:48'),
(33, 8, 'hepaBVaccine', 'uploads/8/medical_documents/hepaBVaccine/1736537388_6781752c8596f_Yatiiiii.png', '2025-01-11', 'sddfsddfd', 'Submitted', '2025-01-10 19:29:48'),
(34, 8, 'fluVaccine', 'uploads/8/medical_documents/fluVaccine/1736537412_67817544218ee_Yatiiiii.png', '2025-01-11', 'dsfad', 'Submitted', '2025-01-10 19:30:12'),
(36, 8, 'bloodCount', 'uploads/8/medical_documents/bloodCount/1736538541_678179ad084fb_a393e55cd98cb900.png', '2025-01-11', 'sdfsdf', 'Submitted', '2025-01-10 19:49:01'),
(37, 8, 'urinalysis', 'uploads/8/medical_documents/urinalysis/1736538560_678179c0960a4_a393e55cd98cb900.png', '2025-01-09', 'sdfdsf', 'Submitted', '2025-01-10 19:49:20'),
(38, 8, 'antiHBS', 'uploads/8/medical_documents/antiHBS/1736538650_67817a1a0963a_Yatiiiii.png', '2025-01-11', 'sdfsdf', 'Submitted', '2025-01-10 19:50:50'),
(39, 10, 'antiHAV', 'uploads/10/medical_documents/antiHAV/1736541963_6781870b0fdda_Yatiiiii.png', '2025-01-11', 'asdfasdf', 'Submitted', '2025-01-10 20:46:03'),
(40, 10, 'fecalysis', 'uploads/10/medical_documents/fecalysis/1736541982_6781871ea8fa6_a393e55cd98cb900.png', '2025-01-11', 'asdasd', 'Submitted', '2025-01-10 20:46:22'),
(41, 10, 'bloodCount', 'uploads/10/medical_documents/bloodCount/1736542014_6781873e59649_a393e55cd98cb900.png', '2025-01-11', 'saddfsddf', 'Submitted', '2025-01-10 20:46:54'),
(42, 10, 'urinalysis', 'uploads/10/medical_documents/urinalysis/1736542030_6781874e91583_a393e55cd98cb900.png', '2025-01-11', 'sadfsdf', 'Submitted', '2025-01-10 20:47:10'),
(43, 10, 'chestXray', 'uploads/10/medical_documents/chestXray/1736542050_67818762523d9_a393e55cd98cb900.png', '2025-01-11', 'asdfsdf', 'Submitted', '2025-01-10 20:47:30'),
(44, 8, 'drugTest', 'uploads/8/medical_documents/drugTest/1736544997_678192e5056c6_a393e55cd98cb900.png', '2025-01-11', 'asdfasdf', 'Submitted', '2025-01-10 21:36:37');

-- --------------------------------------------------------

--
-- Table structure for table `time_slots`
--

CREATE TABLE `time_slots` (
  `slot_id` int(11) NOT NULL,
  `day_of_week` varchar(20) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `date` date NOT NULL,
  `student_limit` int(11) NOT NULL DEFAULT 10,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `time_slots`
--

INSERT INTO `time_slots` (`slot_id`, `day_of_week`, `start_time`, `end_time`, `date`, `student_limit`, `created_at`, `updated_at`) VALUES
(1, 'MONDAY', '07:00:00', '11:00:00', '0000-00-00', 10, '2025-01-14 18:42:15', '2025-01-14 18:42:15');

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
(10, '202211168@gordoncollege.edu.ph', '$2y$10$1ss0rKPKdqmc38SYmZ.EVuGTq4Jqd4Xc21jO9h9FrVbW4uHxSan56', '2025-01-10 20:28:14');

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
(1, 5, 'Jayvee Mayor', 'CCS', 4, '202210768', NULL, 'uploads/5/profile_images/1736156219_677ba43b9418b.jpg'),
(2, 7, 'Rodge Muni', 'CEAH', 3, '202210465', NULL, 'uploads/7/profile_images/1736530008_6781585855d2b.jpg'),
(3, 8, 'Bryn Pido', 'CAHS', 2, '202210445', NULL, 'uploads/8/profile_images/1736530302_6781597e9c884.jpg'),
(4, 9, 'Gio', 'CHTM-Tourism', 3, '202211183', NULL, NULL),
(5, 10, 'John Adrian Fontelera', 'CHTM-Hospitality', 3, '202211168', NULL, NULL),
(6, 6, 'Al Jhon Dupal', 'CBA', 4, '202011035', NULL, 'uploads/6/profile_images/1736542274_67818842c9acc.jpg');

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
(4, 5, 'asdasd', '2025-01-11', 'asdasd', '2025-01-11', 'dasdasd', '2025-01-11', 'uploads/5/vaccination_records/1736529301_67815595ea644_Yatiiiii.png', 'Submitted', '2025-01-10 17:15:01'),
(5, 7, 'ASDASD', '2025-01-11', 'ASDASD', '2025-01-11', 'DASDSD', '2025-01-11', 'uploads/7/vaccination_records/1736530070_678158963af36_462585581_2583501862040436_1476240237619797417_n.jpg', 'Submitted', '2025-01-10 17:27:50'),
(6, 8, 'sdfdsf', '2025-01-11', 'sdfds', '2025-01-11', 'fsdfs', '2025-01-11', 'uploads/8/vaccination_records/1736538584_678179d8de800_Yatiiiii.png', 'Submitted', '2025-01-10 19:49:44'),
(7, 10, 'fsadfdsf', '2025-01-11', 'fasdfsdf', '2025-01-11', 'asdfsdf', '2025-01-18', 'uploads/10/vaccination_records/1736542074_6781877a9b195_a393e55cd98cb900.png', 'Submitted', '2025-01-10 20:47:54');

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
  MODIFY `appointment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `clinicstaff`
--
ALTER TABLE `clinicstaff`
  MODIFY `staff_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `medical_documents`
--
ALTER TABLE `medical_documents`
  MODIFY `document_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `time_slots`
--
ALTER TABLE `time_slots`
  MODIFY `slot_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `user_profiles`
--
ALTER TABLE `user_profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `vaccination_records`
--
ALTER TABLE `vaccination_records`
  MODIFY `record_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
