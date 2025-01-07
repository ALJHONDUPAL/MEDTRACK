-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 07, 2025 at 06:12 PM
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
(3, 'Jayvee', 'Mayor', '202210768', '$2y$10$ZkC8YiDyX71XJ8.cv9SRnuK3/dCFZ/5LfqmllhfSbYLjgB0MxHQry', '202210768@gordoncollege.edu.ph', 'Subic', '09511186442', 'staff', 1, '2024-12-14 12:39:25', '2024-12-14 12:39:25', NULL),
(4, 'clinic', 'staff', 'clinicstaff', '$2y$10$y/bAa63GRnx9qZPtudNyOuOsd5s9Ehd0b7rNhWMt2i/aSqoiTjydW', 'clinicstaff@gordoncollege.edu.ph', 'Subic', '09511186442', 'staff', 1, '2024-12-14 13:08:59', '2024-12-14 13:08:59', NULL),
(5, 'test', 'test', 'test', '$2y$10$0sNdNqR3a34eCmKXtkLYD.QS3/crTU.DLmx6NM8JOiCuubsZrtQFG', 'test@gordoncollege.edu.ph', 'Subic', '09511186442', 'staff', 1, '2024-12-14 20:52:13', '2024-12-14 20:52:13', NULL),
(6, 'asdASD', 'sdasdsdf', 'dssadf', '$2y$10$6M0G8Y48BeILNA3e3szoCe.J2r2UGJDON6snCPMpRGfvpdN3k.8Tq', 'dssadf@gordoncollege.edu.ph', 'asdfasfasdfa', '09511186442', 'staff', 1, '2024-12-14 20:57:00', '2024-12-14 20:57:00', NULL);

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
(16, 5, 'bloodCount', 'uploads/5/medical_documents/bloodCount/1736262899_677d44f34b6d0_a393e55cd98cb900.png', '2025-01-07', 'subic', 'Submitted', '2025-01-07 15:14:59');

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
(5, '202210768@gordoncollege.edu.ph', '$2y$10$zw141f6bPOvqt3qH9JlIbeqiFWCekjDOdvv9GcMbMmW3qr0iJYDX6', '2025-01-06 09:15:45');

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
(0, 5, 'Jayvee Mayor', 'CCS', 4, '202210768', NULL, 'uploads/5/profile_images/1736156219_677ba43b9418b.jpg');

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
(3, 5, 'fasdfasdf', '2025-01-07', 'asdfasdf', '2025-01-07', 'asdfasdf', '2025-01-07', 'uploads/5/vaccination_records/1736260346_677d3afa2cec3_Yatiiiii.png', 'Submitted', '2025-01-07 14:32:26');

--
-- Indexes for dumped tables
--

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
-- AUTO_INCREMENT for table `clinicstaff`
--
ALTER TABLE `clinicstaff`
  MODIFY `staff_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `medical_documents`
--
ALTER TABLE `medical_documents`
  MODIFY `document_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `vaccination_records`
--
ALTER TABLE `vaccination_records`
  MODIFY `record_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

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
