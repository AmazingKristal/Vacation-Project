-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 22, 2023 at 10:01 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vacation`
--
CREATE DATABASE IF NOT EXISTS `vacation` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `vacation`;

-- --------------------------------------------------------

--
-- Table structure for table `followers`
--

CREATE TABLE `followers` (
  `userId` int(11) NOT NULL,
  `vacationId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `followers`
--

INSERT INTO `followers` (`userId`, `vacationId`) VALUES
(1, 1),
(4, 1),
(5, 4),
(5, 12),
(5, 9),
(3, 5),
(3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userId` int(11) NOT NULL,
  `firstName` varchar(30) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(30) NOT NULL,
  `role` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userId`, `firstName`, `lastName`, `email`, `password`, `role`) VALUES
(1, 'Lior', 'Kristal', 'enkviziter14@gmail.com', '1234', 1),
(2, 'liel', 'goldenpen', 'lielgold99317@gmail.com', '123', 2),
(3, 'Rotem', 'Bar', 'rotembar@gmail.com', '12345678', 2),
(4, 'Yona', 'Perkele', 'yona@gmail.com', '79319e2e8552386d75e5c19d728799', 2),
(5, 'asd', 'asd', 'asd@gmail.com', '8ac5a99fc926a9c9e5899281098410', 2);

-- --------------------------------------------------------

--
-- Table structure for table `vacations`
--

CREATE TABLE `vacations` (
  `vacationId` int(11) NOT NULL,
  `destination` varchar(30) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `price` int(11) NOT NULL,
  `imageName` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vacations`
--

INSERT INTO `vacations` (`vacationId`, `destination`, `description`, `startDate`, `endDate`, `price`, `imageName`) VALUES
(1, 'Aachen', 'Aachen in Germany has been around for millennia. The Romans nursed their war wounds and stiff joints in the steaming waters of its mineral springs, but it was Charlemagne who put the city firmly on the European map. The emperor, too, enjoyed a dip now and then, but it was more for strategic reasons ', '2023-11-02', '2023-11-09', 755, 'b33727f4-f0d2-4815-9292-49acbcea74ad.jpg'),
(2, 'Montreal', 'Head to bilingual Montréal to enjoy a taste of French culture in a North American city that\'s in love with festivals, the arts, good food and enjoying life to the hilt.', '2023-10-06', '2023-10-09', 479, '99f335b0-eba2-4c5c-8318-df9152718bb9.jpg'),
(3, 'Geneva', 'Like the swans that frolic on its eponymous Alpine lake (Europe\'s largest), Geneva (Genève) is a rare bird. Constantly perceived as the Swiss capital (it isn\'t), Switzerland\'s second-largest city is slick and cosmopolitan, and its people chatter in almost every language among streets paved by gold.', '2023-10-24', '2023-11-03', 1450, '2219ead7-5ab8-4660-81c3-819db5a0d5c6.jpg'),
(4, 'Cardiff', 'The capital of Wales since just 1955, Cardiff has embraced the role with vigour, emerging in the new millennium as one of Britain’s leading urban centres. Spread between an ancient fort and an ultramodern waterfront, compact Cardiff seems to have surprised even itself with how interesting it has bec', '2023-11-14', '2023-11-18', 700, '49d7565d-758e-48ef-bb73-4b1eae0717f2.jpg'),
(5, 'Trondheim', 'With its colourful warehouses, waterways and wooded hills, Norway\'s third-largest city is without doubt one of its most photogenic. Trondheim, the country\'s historic capital, is a pleasure to explore, with wide streets and a partly pedestrianised heart. Great cafes, restaurants and museums compete f', '2023-10-03', '2023-10-10', 1000, '78849427-04ee-4079-9c6d-48cfc835a9e5.jpg'),
(6, 'Brasilia', 'Brasília, conceived as a workable, utopic answer to urban chaos, replaced Rio as capital in 1960 and remains an impressive monument to national initiative. The purpose-built city is lauded by many for its futuristic architecture and avant-garde design, but also criticized for the impracticality of t', '2023-10-16', '2023-10-23', 980, '2f285e9c-2c70-4716-a7d3-d9fc6b9acceb.jpg'),
(7, 'Lviv', 'If you’ve spent time in other Ukrainian regions, Lviv will come as a shock. Mysterious and architecturally lovely, this Unesco-listed city is the country’s least Soviet and exudes the same authentic Central European charm as pretourism Prague or Kraków once did. Its quaint cobbles, bean-perfumed cof', '2023-10-25', '2023-10-30', 482, '362c408d-9cd4-483a-992e-26fb67175eaa.jpg'),
(9, 'Salvador', 'Salvador da Bahia has an energy and unadorned beauty that few cities can match. Once Portugal\'s colonial capital, today Salvador is the pulsating heart of the country’s Afro-Brazilian community. Festivals happen frequently, with drum corps pounding out rhythms against the backdrop of historic buildi', '2023-10-11', '2023-10-14', 354, '8bd53548-780c-483e-bbbe-2b13eb3eedd2.jpg'),
(10, 'Bern', 'Wandering through the picture-postcard, Unesco World Heritage–listed Old Town, with its provincial, laid-back air, it\'s hard to believe that Bern (Berne in French) is the capital of Switzerland.', '2023-10-21', '2023-10-28', 999, 'cc6481a6-01cf-4b98-978e-0827bc3ae6e0.jpg'),
(11, 'Derry(Londonderry)', 'Northern Ireland\'s second-largest city continues to flourish as an artistic and cultural hub. Derry\'s city centre was given a striking makeover for its year as the UK City of Culture 2013, with the construction of the Peace Bridge, Ebrington Sq, and the redevelopment of the waterfront and Guildhall ', '2023-10-16', '2023-10-19', 395, '2f38e409-9b6b-44e9-86a4-a6ea76d0a749.jpg'),
(12, 'Naha', 'Flattened during WWII, the prefectural capital of Naha (那覇) is now a thriving urban center that looks like most other tidy, small-to-medium Japanese cities, except for the frequent splashes of leafy green, rows of palm trees, or glimpses of azure waters from between the modern high-rises, which make', '2023-11-14', '2023-11-21', 1250, 'ee844391-abe6-4aaf-9b23-f7df379113ea.jpg'),
(32, 'Paris', 'Why go to Paris? The City of Light draws millions of visitors every year with its unforgettable ambiance. Of course, the divine cuisine and vast art collections deserve some of the credit as well. The gentle River Seine rambles through the city, flanked by stately museums, centuries-old churches, an', '2023-10-13', '2023-10-25', 999, '16574108-1893-4848-b065-8220ded4fec8.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `followers`
--
ALTER TABLE `followers`
  ADD KEY `userId` (`userId`),
  ADD KEY `vacationId` (`vacationId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userId`);

--
-- Indexes for table `vacations`
--
ALTER TABLE `vacations`
  ADD PRIMARY KEY (`vacationId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `vacations`
--
ALTER TABLE `vacations`
  MODIFY `vacationId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `followers`
--
ALTER TABLE `followers`
  ADD CONSTRAINT `followers_ibfk_1` FOREIGN KEY (`vacationId`) REFERENCES `vacations` (`vacationId`),
  ADD CONSTRAINT `followers_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
