

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- 1. BORRAR TABLAS ANTERIORES (en orden inverso de dependencia)
DROP TABLE IF EXISTS `PasswordResets`;
DROP TABLE IF EXISTS `Reporte`;
DROP TABLE IF EXISTS `Historial`;
DROP TABLE IF EXISTS `Ejercicio`;
DROP TABLE IF EXISTS `Usuario`;
DROP TABLE IF EXISTS `Unidad`;

-- 2. CREAR TABLAS (en orden de dependencia)

-- Tabla de Unidades
CREATE TABLE `Unidad` (
  `IdUnidad` INT AUTO_INCREMENT PRIMARY KEY,
  `NombreUnidad` VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Usuarios
CREATE TABLE `Usuario` (
  `IdUsuario` INT AUTO_INCREMENT PRIMARY KEY,
  `Nombre` VARCHAR(255) NOT NULL,
  `Correo` VARCHAR(191) NOT NULL UNIQUE COMMENT 'Longitud 191 para compatibilidad con utf8mb4',
  `Contraseña` VARCHAR(255) NOT NULL COMMENT 'Hash generado por PHP (ej. Argon2id)',
  `Rol` ENUM('usuario','admin') NOT NULL DEFAULT 'usuario',
  `ResetToken` VARCHAR(255) DEFAULT NULL,
  `ResetTokenExpiry` DATETIME DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Ejercicios (Acertijos)
CREATE TABLE `Ejercicio` (
  `IdEjercicio` INT NOT NULL AUTO_INCREMENT,
  `IdUnidad` INT NOT NULL,
  `Pregunta` TEXT NOT NULL,
  `OpcionA` TEXT NOT NULL,
  `OpcionB` TEXT NOT NULL,
  `OpcionC` TEXT NOT NULL,
  `OpcionD` TEXT NOT NULL,
  `RespuestaCorrecta` CHAR(1) NOT NULL COMMENT 'A, B, C, o D',
  PRIMARY KEY (`IdEjercicio`),
  KEY `FK_Ejercicio_Unidad` (`IdUnidad`),
  CONSTRAINT `FK_Ejercicio_Unidad` FOREIGN KEY (`IdUnidad`) REFERENCES `Unidad` (`IdUnidad`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Historial (basado en delete_riddle.php)
CREATE TABLE `Historial` (
  `IdHistorial` INT NOT NULL AUTO_INCREMENT,
  `IdUsuario` INT DEFAULT NULL,
  `IdEjercicio` INT DEFAULT NULL,
  `RespuestaUsuario` CHAR(1) NOT NULL,
  `FueCorrecto` TINYINT(1) NOT NULL DEFAULT 0,
  `Fecha` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`IdHistorial`),
  KEY `FK_Historial_Usuario` (`IdUsuario`),
  KEY `FK_Historial_Ejercicio` (`IdEjercicio`),
  CONSTRAINT `FK_Historial_Ejercicio` FOREIGN KEY (`IdEjercicio`) REFERENCES `Ejercicio` (`IdEjercicio`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_Historial_Usuario` FOREIGN KEY (`IdUsuario`) REFERENCES `Usuario` (`IdUsuario`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Reportes (basado en delete_riddle.php)
CREATE TABLE `Reporte` (
  `IdReporte` INT NOT NULL AUTO_INCREMENT,
  `IdUsuario` INT DEFAULT NULL,
  `IdEjercicio` INT DEFAULT NULL,
  `Descripcion` TEXT NOT NULL,
  `FechaReporte` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Estado` ENUM('pendiente','resuelto') NOT NULL DEFAULT 'pendiente',
  PRIMARY KEY (`IdReporte`),
  KEY `FK_Reporte_Usuario` (`IdUsuario`),
  KEY `FK_Reporte_Ejercicio` (`IdEjercicio`),
  CONSTRAINT `FK_Reporte_Ejercicio` FOREIGN KEY (`IdEjercicio`) REFERENCES `Ejercicio` (`IdEjercicio`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_Reporte_Usuario` FOREIGN KEY (`IdUsuario`) REFERENCES `Usuario` (`IdUsuario`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Reseteo de Contraseña (basado en tu script)
CREATE TABLE `PasswordResets` (
  `IdReset` INT AUTO_INCREMENT PRIMARY KEY,
  `Correo` VARCHAR(191) NOT NULL,
  `Token` VARCHAR(255) NOT NULL COMMENT 'Token hasheado',
  `Expira` BIGINT NOT NULL COMMENT 'Marca de tiempo UNIX',
  CONSTRAINT `FK_PasswordResets_Usuario` FOREIGN KEY (`Correo`) REFERENCES `Usuario` (`Correo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



-- Contraseñas de ejemplo (HASHEADAS CON ARGON2ID para ser compatibles con tu update_my_password.php)
-- 'Admin123!' -> $argon2id$v=19$m=65536,t=4,p=1$L0JpN09iZ3BqR1hXWjVXSA$8xMrcp7lY/3vF2hYxSDR82MF9BtbYI/3GbJqO5sFUsU
-- 'Usuario123!' -> $argon2id$v=19$m=65536,t=4,p=1$LkN1ZGlYMjRBYlBwZ0N1VA$x4jQo3t/y2Gk5sFwP1rRaqPcVQzTDIiuzV8EEv/6DWE
--

INSERT INTO `Unidad` (`IdUnidad`, `NombreUnidad`) VALUES
(1, 'Unidad I'),
(2, 'Unidad II');

INSERT INTO `Usuario` (`IdUsuario`, `Nombre`, `Correo`, `Contraseña`, `Rol`) VALUES
(1, 'Administrador', 'admin@softriddles.com', '$argon2id$v=19$m=65536,t=4,p=1$L0JpN09iZ3BqR1hXWjVXSA$8xMrcp7lY/3vF2hYxSDR82MF9BtbYI/3GbJqO5sFUsU', 'admin');

COMMIT;