-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 12, 2024 at 07:31 PM
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
-- Database: `vizsgaremek`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`) VALUES
(68, 'appetizer'),
(89, 'dessert'),
(67, 'drink'),
(65, 'main course');

-- --------------------------------------------------------

--
-- Table structure for table `item`
--

CREATE TABLE `item` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `categoryId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- Dumping data for table `item`
--

INSERT INTO `item` (`id`, `name`, `price`, `categoryId`) VALUES
(36, 'Bor', 444, 67),
(37, 'Pizza', 333, 65),
(38, 'Suti', 3333, 89);

-- --------------------------------------------------------

--
-- Table structure for table `openinghours`
--

CREATE TABLE `openinghours` (
  `id` int(11) NOT NULL,
  `dayName` varchar(255) NOT NULL,
  `fromHour` varchar(255) NOT NULL,
  `untilHour` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- Dumping data for table `openinghours`
--

INSERT INTO `openinghours` (`id`, `dayName`, `fromHour`, `untilHour`) VALUES
(2, 'Kedd', '09:00', '21:00'),
(3, 'Szerda', '09:00', '21:00'),
(4, 'Csütörtök', '09:00', '21:00'),
(5, 'Péntek', '09:00', '21:00'),
(6, 'Szombat', '09:00', '22:00'),
(7, 'Vasárnap', '09:00', '22:00'),
(20, 'Héftő', '09:00', '21:00');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `tableId` int(11) NOT NULL,
  `itemId` int(11) NOT NULL,
  `isDone` tinyint(1) NOT NULL DEFAULT 0,
  `isServed` tinyint(1) NOT NULL DEFAULT 0,
  `orderedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `tableId`, `itemId`, `isDone`, `isServed`, `orderedAt`) VALUES
(68, 1, 38, 0, 0, '2024-11-12 17:53:32'),
(69, 1, 37, 0, 0, '2024-11-12 17:53:32'),
(70, 1, 36, 0, 1, '2024-11-12 17:53:32'),
(71, 1, 36, 0, 1, '2024-11-12 18:11:57'),
(72, 1, 37, 0, 0, '2024-11-12 18:11:57'),
(73, 1, 38, 0, 0, '2024-11-12 18:11:57'),
(74, 2, 38, 1, 1, '2024-11-12 18:12:25'),
(75, 2, 37, 1, 1, '2024-11-12 18:12:25'),
(76, 1, 36, 0, 1, '2024-11-12 18:13:08'),
(77, 2, 37, 1, 1, '2024-11-12 18:31:55'),
(78, 2, 38, 1, 1, '2024-11-12 18:31:55'),
(79, 2, 37, 1, 1, '2024-11-12 18:31:55'),
(80, 2, 37, 1, 1, '2024-11-12 18:32:04'),
(81, 2, 38, 1, 1, '2024-11-12 18:32:04'),
(82, 2, 37, 1, 1, '2024-11-12 18:32:04'),
(83, 1, 37, 0, 0, '2024-11-12 18:32:09'),
(84, 1, 38, 0, 0, '2024-11-12 18:32:09'),
(85, 1, 37, 1, 1, '2024-11-12 18:32:09'),
(86, 1, 36, 0, 1, '2024-11-12 18:32:09'),
(87, 1, 36, 0, 1, '2024-11-12 18:32:09'),
(88, 1, 36, 0, 1, '2024-11-12 18:32:33'),
(89, 1, 37, 0, 0, '2024-11-12 18:32:33'),
(90, 1, 38, 0, 0, '2024-11-12 18:32:33'),
(91, 2, 36, 0, 1, '2024-11-12 18:33:21'),
(92, 2, 36, 0, 1, '2024-11-12 18:33:21'),
(93, 1, 38, 0, 0, '2024-11-12 18:34:14'),
(94, 1, 38, 1, 0, '2024-11-12 18:34:14'),
(95, 1, 38, 1, 0, '2024-11-12 18:34:14'),
(96, 1, 38, 1, 0, '2024-11-12 18:34:14'),
(97, 1, 38, 1, 0, '2024-11-12 18:34:14'),
(98, 1, 36, 0, 1, '2024-11-12 18:45:55');

-- --------------------------------------------------------

--
-- Table structure for table `paid`
--

CREATE TABLE `paid` (
  `id` int(11) NOT NULL,
  `tableId` int(11) NOT NULL,
  `itemId` int(11) NOT NULL,
  `paymentMethodId` int(11) NOT NULL,
  `paidAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- --------------------------------------------------------

--
-- Table structure for table `paymentmethods`
--

CREATE TABLE `paymentmethods` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- Dumping data for table `paymentmethods`
--

INSERT INTO `paymentmethods` (`id`, `name`) VALUES
(22, 'card');

-- --------------------------------------------------------

--
-- Table structure for table `permissionsettings`
--

CREATE TABLE `permissionsettings` (
  `id` int(11) NOT NULL,
  `section` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- Dumping data for table `permissionsettings`
--

INSERT INTO `permissionsettings` (`id`, `section`) VALUES
(1, 'admin'),
(2, 'cashier'),
(3, 'chef'),
(4, 'waiter');

-- --------------------------------------------------------

--
-- Table structure for table `reservedtable`
--

CREATE TABLE `reservedtable` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `numberOfCustomers` int(11) NOT NULL,
  `tableId` int(11) NOT NULL,
  `reservedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `reservedUntil` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- Dumping data for table `reservedtable`
--

INSERT INTO `reservedtable` (`id`, `name`, `numberOfCustomers`, `tableId`, `reservedAt`, `reservedUntil`) VALUES
(7, 'Jani', 65, 1, '2024-11-03 12:00:00', '2024-11-03 14:00:00'),
(9, 'asd', 5, 1, '2024-11-03 14:00:00', '2024-11-03 16:00:00'),
(11, 'asd', 5, 1, '2024-11-03 17:00:00', '2024-11-03 18:00:00'),
(14, 'Janika', 5, 1, '2024-11-03 09:00:00', '2024-11-03 10:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `userId` int(11) NOT NULL,
  `ip` varchar(255) NOT NULL,
  `expires` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `userId`, `ip`, `expires`) VALUES
('4ec861bf-4f98-45cb-99f0-1d069c76757a', 11, '::1', '2024-11-11 12:14:41');

-- --------------------------------------------------------

--
-- Table structure for table `tables`
--

CREATE TABLE `tables` (
  `id` int(11) NOT NULL,
  `tableNumber` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- Dumping data for table `tables`
--

INSERT INTO `tables` (`id`, `tableNumber`) VALUES
(1, 1),
(2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `hashedPassword` varchar(255) NOT NULL,
  `permissionId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `hashedPassword`, `permissionId`, `createdAt`) VALUES
(11, 'admin', 'admin@admin', '$2b$10$LDiEu4BJXGwygTSSnJuKvO4ZQr1/sS.aS6MX45KFzoYqj30LcMvb6', 1, '2024-11-08 19:03:06');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `categoryId` (`categoryId`);

--
-- Indexes for table `openinghours`
--
ALTER TABLE `openinghours`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dayName` (`dayName`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tableId` (`tableId`,`itemId`),
  ADD KEY `itemId` (`itemId`);

--
-- Indexes for table `paid`
--
ALTER TABLE `paid`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tableId` (`tableId`,`itemId`,`paymentMethodId`),
  ADD KEY `itemId` (`itemId`),
  ADD KEY `paymentMethod` (`paymentMethodId`);

--
-- Indexes for table `paymentmethods`
--
ALTER TABLE `paymentmethods`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `permissionsettings`
--
ALTER TABLE `permissionsettings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `section` (`section`);

--
-- Indexes for table `reservedtable`
--
ALTER TABLE `reservedtable`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tableId` (`tableId`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `tables`
--
ALTER TABLE `tables`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tableNumber` (`tableNumber`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `permissionLevel` (`permissionId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT for table `item`
--
ALTER TABLE `item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `openinghours`
--
ALTER TABLE `openinghours`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;

--
-- AUTO_INCREMENT for table `paid`
--
ALTER TABLE `paid`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=346;

--
-- AUTO_INCREMENT for table `paymentmethods`
--
ALTER TABLE `paymentmethods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `permissionsettings`
--
ALTER TABLE `permissionsettings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `reservedtable`
--
ALTER TABLE `reservedtable`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `tables`
--
ALTER TABLE `tables`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `item`
--
ALTER TABLE `item`
  ADD CONSTRAINT `item_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`itemId`) REFERENCES `item` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`tableId`) REFERENCES `tables` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `paid`
--
ALTER TABLE `paid`
  ADD CONSTRAINT `paid_ibfk_1` FOREIGN KEY (`itemId`) REFERENCES `item` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `paid_ibfk_2` FOREIGN KEY (`tableId`) REFERENCES `tables` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `paid_ibfk_3` FOREIGN KEY (`paymentMethodId`) REFERENCES `paymentmethods` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reservedtable`
--
ALTER TABLE `reservedtable`
  ADD CONSTRAINT `reservedtable_ibfk_1` FOREIGN KEY (`tableId`) REFERENCES `tables` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`permissionId`) REFERENCES `permissionsettings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
