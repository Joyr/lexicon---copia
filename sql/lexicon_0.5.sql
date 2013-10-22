-- phpMyAdmin SQL Dump
-- version 2.6.4-pl3
-- http://www.phpmyadmin.net
-- 
-- Servidor: db471615358.db.1and1.com
-- Temps de generació: 10-06-2013 a les 19:35:55
-- Versió del servidor: 5.1.67
-- PHP versió: 5.3.3-7+squeeze15
-- 
-- Base de dades: `db471615358`
-- 

-- --------------------------------------------------------

-- 
-- Estructura de la taula `card`
-- 

CREATE TABLE IF NOT EXISTS `card` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `question` varchar(45) NOT NULL,
  `answer` varchar(45) NOT NULL,
  `img_id` int(10) unsigned DEFAULT NULL,
  `project_id` int(10) unsigned NOT NULL,
  `login_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`,`project_id`),
  KEY `fk_card_img1_idx` (`img_id`),
  KEY `fk_card_project1_idx` (`project_id`),
  KEY `fk_card_login1_idx` (`login_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8 AUTO_INCREMENT=23 ;

-- 
-- Volcant dades de la taula `card`
-- 

INSERT INTO `card` (`id`, `question`, `answer`, `img_id`, `project_id`, `login_id`) VALUES (5, 'tener', 'haben', NULL, 14, 1);
INSERT INTO `card` (`id`, `question`, `answer`, `img_id`, `project_id`, `login_id`) VALUES (6, 'uno', 'dos\r', NULL, 15, 1);
INSERT INTO `card` (`id`, `question`, `answer`, `img_id`, `project_id`, `login_id`) VALUES (8, 'cinco', 'seis', NULL, 15, 1);
INSERT INTO `card` (`id`, `question`, `answer`, `img_id`, `project_id`, `login_id`) VALUES (20, 'uno', 'dos', NULL, 15, 1);
INSERT INTO `card` (`id`, `question`, `answer`, `img_id`, `project_id`, `login_id`) VALUES (21, 'tres', 'cuatro', NULL, 15, 1);
INSERT INTO `card` (`id`, `question`, `answer`, `img_id`, `project_id`, `login_id`) VALUES (22, 'cinco', 'seis', NULL, 15, 1);

-- --------------------------------------------------------

-- 
-- Estructura de la taula `img`
-- 

CREATE TABLE IF NOT EXISTS `img` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `img` varchar(140) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- 
-- Volcant dades de la taula `img`
-- 


-- --------------------------------------------------------

-- 
-- Estructura de la taula `login`
-- 

CREATE TABLE IF NOT EXISTS `login` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `passwd` varchar(65) NOT NULL,
  `email` varchar(45) NOT NULL,
  `lastDate` datetime NOT NULL,
  `role` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `name` varchar(45) DEFAULT NULL,
  `lastName` varchar(45) DEFAULT NULL,
  `inter_time` tinyint(4) NOT NULL DEFAULT '5',
  `theme` varchar(10) NOT NULL DEFAULT 'black',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 AUTO_INCREMENT=12 ;

-- 
-- Volcant dades de la taula `login`
-- 

INSERT INTO `login` (`id`, `username`, `passwd`, `email`, `lastDate`, `role`, `name`, `lastName`, `inter_time`, `theme`) VALUES (1, 'marcbatalla', '$sha1$._!?$94$a4688a1d53c011d2a4d497ef6bc9a6f998ce4da1$', 'marcbatalla@uoc.edu', '2013-06-05 21:36:14', 5, NULL, NULL, 5, 'black');
INSERT INTO `login` (`id`, `username`, `passwd`, `email`, `lastDate`, `role`, `name`, `lastName`, `inter_time`, `theme`) VALUES (10, 'colomet', '$sha1$=!,!$27$99f646aeeb0a7de3a5d769bf329de94dde010d7e$', 'colomet@hotmail.com', '2013-06-10 19:00:16', 1, NULL, NULL, 5, 'black');
INSERT INTO `login` (`id`, `username`, `passwd`, `email`, `lastDate`, `role`, `name`, `lastName`, `inter_time`, `theme`) VALUES (11, 'exit', '$sha1$-_-;$24$ae71e64a4e76c9522e236a0ed8a4aa8d50aa97c3$', 'exit@gmail.com', '2013-06-05 21:33:22', 1, NULL, NULL, 5, 'black');

-- --------------------------------------------------------

-- 
-- Estructura de la taula `official`
-- 

CREATE TABLE IF NOT EXISTS `official` (
  `card_id` int(10) unsigned NOT NULL,
  `card_project_id` int(10) unsigned NOT NULL,
  `phraseQ` varchar(45) DEFAULT NULL,
  `soundQ` varchar(45) DEFAULT NULL,
  `phraseA` varchar(45) DEFAULT NULL,
  `soundA` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`card_id`,`card_project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 
-- Volcant dades de la taula `official`
-- 


-- --------------------------------------------------------

-- 
-- Estructura de la taula `project`
-- 

CREATE TABLE IF NOT EXISTS `project` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(140) DEFAULT NULL,
  `InitialDate` date NOT NULL,
  `ModifiedDate` datetime NOT NULL,
  `login_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_project_login1_idx` (`login_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8 AUTO_INCREMENT=19 ;

-- 
-- Volcant dades de la taula `project`
-- 

INSERT INTO `project` (`id`, `name`, `description`, `InitialDate`, `ModifiedDate`, `login_id`) VALUES (14, 'Verbos espaÃ±ol', '', '2013-05-23', '2013-05-23 16:13:41', 1);
INSERT INTO `project` (`id`, `name`, `description`, `InitialDate`, `ModifiedDate`, `login_id`) VALUES (15, 'Pruebas', 'De todo', '2013-05-23', '2013-05-27 19:25:34', 10);
INSERT INTO `project` (`id`, `name`, `description`, `InitialDate`, `ModifiedDate`, `login_id`) VALUES (16, 'nou', '', '2013-05-27', '2013-05-27 19:20:11', 1);
INSERT INTO `project` (`id`, `name`, `description`, `InitialDate`, `ModifiedDate`, `login_id`) VALUES (17, 'test1', '', '2013-06-03', '2013-06-03 16:12:07', 1);
INSERT INTO `project` (`id`, `name`, `description`, `InitialDate`, `ModifiedDate`, `login_id`) VALUES (18, 'test1', '', '2013-06-03', '2013-06-03 16:12:24', 1);

-- --------------------------------------------------------

-- 
-- Estructura de la taula `project_has_login`
-- 

CREATE TABLE IF NOT EXISTS `project_has_login` (
  `project_id` int(10) unsigned NOT NULL,
  `login_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`project_id`,`login_id`),
  KEY `fk_project_has_login_login1_idx` (`login_id`),
  KEY `fk_project_has_login_project1_idx` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 
-- Volcant dades de la taula `project_has_login`
-- 

INSERT INTO `project_has_login` (`project_id`, `login_id`) VALUES (14, 1);
INSERT INTO `project_has_login` (`project_id`, `login_id`) VALUES (15, 1);
INSERT INTO `project_has_login` (`project_id`, `login_id`) VALUES (16, 1);
INSERT INTO `project_has_login` (`project_id`, `login_id`) VALUES (17, 1);
INSERT INTO `project_has_login` (`project_id`, `login_id`) VALUES (18, 1);
INSERT INTO `project_has_login` (`project_id`, `login_id`) VALUES (14, 10);
INSERT INTO `project_has_login` (`project_id`, `login_id`) VALUES (15, 10);
INSERT INTO `project_has_login` (`project_id`, `login_id`) VALUES (16, 10);
INSERT INTO `project_has_login` (`project_id`, `login_id`) VALUES (14, 11);

-- --------------------------------------------------------

-- 
-- Estructura de la taula `project_has_tags`
-- 

CREATE TABLE IF NOT EXISTS `project_has_tags` (
  `project_id` int(10) unsigned NOT NULL,
  `tags_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`tags_id`,`project_id`),
  KEY `fk_project_has_tags_tags1_idx` (`tags_id`),
  KEY `fk_project_has_tags_project1_idx` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 
-- Volcant dades de la taula `project_has_tags`
-- 

INSERT INTO `project_has_tags` (`project_id`, `tags_id`) VALUES (14, 4);
INSERT INTO `project_has_tags` (`project_id`, `tags_id`) VALUES (15, 4);
INSERT INTO `project_has_tags` (`project_id`, `tags_id`) VALUES (14, 18);
INSERT INTO `project_has_tags` (`project_id`, `tags_id`) VALUES (15, 18);

-- --------------------------------------------------------

-- 
-- Estructura de la taula `sm0`
-- 

CREATE TABLE IF NOT EXISTS `sm0` (
  `card_id` int(10) unsigned NOT NULL,
  `login_id` int(10) unsigned NOT NULL,
  `rank` tinyint(4) NOT NULL DEFAULT '1',
  `card_project_id` int(10) unsigned NOT NULL,
  `repsLeft` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`card_id`,`login_id`,`card_project_id`),
  KEY `fk_card_has_login_login1_idx` (`login_id`),
  KEY `fk_sm0_card1_idx` (`card_id`,`card_project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 
-- Volcant dades de la taula `sm0`
-- 

INSERT INTO `sm0` (`card_id`, `login_id`, `rank`, `card_project_id`, `repsLeft`) VALUES (5, 1, 1, 14, 0);
INSERT INTO `sm0` (`card_id`, `login_id`, `rank`, `card_project_id`, `repsLeft`) VALUES (5, 10, 1, 14, 0);
INSERT INTO `sm0` (`card_id`, `login_id`, `rank`, `card_project_id`, `repsLeft`) VALUES (5, 11, 1, 14, 0);
INSERT INTO `sm0` (`card_id`, `login_id`, `rank`, `card_project_id`, `repsLeft`) VALUES (6, 1, 4, 15, 9);
INSERT INTO `sm0` (`card_id`, `login_id`, `rank`, `card_project_id`, `repsLeft`) VALUES (6, 10, 2, 15, 2);
INSERT INTO `sm0` (`card_id`, `login_id`, `rank`, `card_project_id`, `repsLeft`) VALUES (8, 1, 2, 15, 2);
INSERT INTO `sm0` (`card_id`, `login_id`, `rank`, `card_project_id`, `repsLeft`) VALUES (8, 10, 2, 15, 2);
INSERT INTO `sm0` (`card_id`, `login_id`, `rank`, `card_project_id`, `repsLeft`) VALUES (20, 1, 1, 15, 0);
INSERT INTO `sm0` (`card_id`, `login_id`, `rank`, `card_project_id`, `repsLeft`) VALUES (20, 10, 1, 15, 0);
INSERT INTO `sm0` (`card_id`, `login_id`, `rank`, `card_project_id`, `repsLeft`) VALUES (21, 1, 1, 15, 0);
INSERT INTO `sm0` (`card_id`, `login_id`, `rank`, `card_project_id`, `repsLeft`) VALUES (21, 10, 1, 15, 0);
INSERT INTO `sm0` (`card_id`, `login_id`, `rank`, `card_project_id`, `repsLeft`) VALUES (22, 1, 1, 15, 0);
INSERT INTO `sm0` (`card_id`, `login_id`, `rank`, `card_project_id`, `repsLeft`) VALUES (22, 10, 1, 15, 0);

-- --------------------------------------------------------

-- 
-- Estructura de la taula `tags`
-- 

CREATE TABLE IF NOT EXISTS `tags` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8 AUTO_INCREMENT=19 ;

-- 
-- Volcant dades de la taula `tags`
-- 

INSERT INTO `tags` (`id`, `name`) VALUES (18, 'deutsch');
INSERT INTO `tags` (`id`, `name`) VALUES (4, 'spanish');

-- 
-- Restriccions per taules volcades
-- 

-- 
-- Restriccions per la taula `card`
-- 
ALTER TABLE `card`
  ADD CONSTRAINT `fk_card_img1` FOREIGN KEY (`img_id`) REFERENCES `img` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_card_login1` FOREIGN KEY (`login_id`) REFERENCES `login` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_card_project1` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- 
-- Restriccions per la taula `official`
-- 
ALTER TABLE `official`
  ADD CONSTRAINT `fk_official_card1` FOREIGN KEY (`card_id`, `card_project_id`) REFERENCES `card` (`id`, `project_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- 
-- Restriccions per la taula `project`
-- 
ALTER TABLE `project`
  ADD CONSTRAINT `fk_project_login1` FOREIGN KEY (`login_id`) REFERENCES `login` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- 
-- Restriccions per la taula `project_has_login`
-- 
ALTER TABLE `project_has_login`
  ADD CONSTRAINT `fk_project_has_login_login1` FOREIGN KEY (`login_id`) REFERENCES `login` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_project_has_login_project1` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- 
-- Restriccions per la taula `project_has_tags`
-- 
ALTER TABLE `project_has_tags`
  ADD CONSTRAINT `fk_project_has_tags_project1` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_project_has_tags_tags1` FOREIGN KEY (`tags_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- 
-- Restriccions per la taula `sm0`
-- 
ALTER TABLE `sm0`
  ADD CONSTRAINT `fk_card_has_login_login1` FOREIGN KEY (`login_id`) REFERENCES `login` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_sm0_card1` FOREIGN KEY (`card_id`, `card_project_id`) REFERENCES `card` (`id`, `project_id`) ON DELETE CASCADE ON UPDATE CASCADE;
