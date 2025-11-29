-- -- -- Schema para tienda_lvl_up
-- -- CREATE DATABASE IF NOT EXISTS tienda_lvl_up CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- -- USE tienda_lvl_up;

-- -- Tabla categorias
-- CREATE TABLE IF NOT EXISTS categorias (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   titulo VARCHAR(100) NOT NULL,
--   imagen VARCHAR(255),
--   link VARCHAR(255) DEFAULT '#'
-- ) ENGINE=InnoDB;

-- -- Tabla productos
-- CREATE TABLE IF NOT EXISTS productos (
--   id_producto VARCHAR(10) PRIMARY KEY,
--   categoria_id INT NOT NULL,
--   nombre VARCHAR(150) NOT NULL,
--   descripcion TEXT NOT NULL,
--   precio INT NOT NULL,
--   imagen VARCHAR(255),
--   CONSTRAINT fk_productos_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE ON UPDATE CASCADE
-- ) ENGINE=InnoDB;

-- -- -- Índices para búsqueda
-- -- CREATE INDEX idx_productos_nombre ON productos(nombre);
-- -- CREATE INDEX idx_productos_categoria_id ON productos(categoria_id);

-- -- Tabla usuarios
-- CREATE TABLE IF NOT EXISTS usuarios (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   rut VARCHAR(15) NOT NULL UNIQUE,
--   nombre VARCHAR(100) NOT NULL,
--   apellido VARCHAR(100) NOT NULL,
--   email VARCHAR(150) NOT NULL UNIQUE,
--   fecha_nacimiento DATE NOT NULL,
--   username VARCHAR(50) NOT NULL UNIQUE,
--   region VARCHAR(100) NOT NULL,
--   comuna VARCHAR(100) NOT NULL,
--   direccion VARCHAR(255) NOT NULL,
--   rol VARCHAR(30) NOT NULL DEFAULT 'user',
--   password_hash VARCHAR(255) NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- ) ENGINE=InnoDB;

-- -- Índices usuarios
-- -- CREATE INDEX idx_usuarios_email ON usuarios(email);
-- -- CREATE INDEX idx_usuarios_username ON usuarios(username);
