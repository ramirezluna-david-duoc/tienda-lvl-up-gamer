-- -- -- CATEGORIAS (IDs determinísticos por orden de inserción)
-- INSERT INTO categorias (titulo, imagen, link) VALUES
-- ('Juegos de Mesa','../assets/imgs/productos/Catan/w=1500,h=1500,fit=pad_catan.webp','#'),
-- ('Accesorios','../assets/imgs/productos/Auriculares/w=1500,h=1500,fit=pad.webp','#'),
-- ('Consolas','../assets/imgs/productos/PlayStation%205/w=1500,h=1500,fit=pad.webp','#'),
-- ('Computadores','../assets/imgs/productos/PC%20Gamer/w=1500,h=1500,fit=pad_pc.webp','#'),
-- ('Sillas Gamers','../assets/imgs/productos/Silla/51z99dkOVHL._AC_SL1000__square.png','#'),
-- ('Mouse','../assets/imgs/productos/Mouse/51PNyeVCKZL._AC_SL1500__square.png','#'),
-- ('Mousepads','../assets/imgs/productos/MousePad/D_NQ_NP_711289-MLU70103676213_062023-O_square.png','#'),
-- ('Poleras y Polerones','../assets/imgs/productos/Polera/polera_azul.png','#');


-- INSERT INTO productos (id_producto, categoria_id, nombre, descripcion, precio, imagen) VALUES
-- ('JM001', 1, 'Catan', 'Un clásico juego de estrategia donde los jugadores compiten por colonizar y expandirse en la isla de Catan. Ideal para 3-4 jugadores y perfecto para noches de juego en familia o con amigos.', 29990, 'productos/Catan/D_NQ_NP_848189-MLA84841643141_052025-O_square.png'),
-- ('JM002', 1, 'Carcassonne', 'Un juego de colocación de fichas donde los jugadores construyen el paisaje alrededor de la fortaleza medieval de Carcassonne. Ideal para 2-5 jugadores y fácil de aprender.', 24990, 'productos/Carc/D_NQ_NP_880148-MLC89039698461_072025-O-juego-de-mesa-carcassonne-2015_square.png'),
-- ('AC001', 2, 'Controlador Inalámbrico Xbox Series X', 'Ofrece una experiencia de juego cómoda con botones mapeables y una respuesta táctil mejorada. Compatible con consolas Xbox y PC.', 59990, 'productos/Control/D_NQ_NP_2X_932200-MLA54147001786_032023-F_square.png'),
-- ('AC002', 2, 'Auriculares Gamer HyperX Cloud II', 'Proporcionan un sonido envolvente de calidad con un micrófono desmontable y almohadillas de espuma viscoelástica para mayor comodidad durante largas sesiones de juego.', 79990, 'productos/Auriculares/D_NQ_NP_2X_931349-MCO53148372002_012023-F_square.png'),
-- ('CO001', 3, 'PlayStation 5', 'La consola de última generación de Sony, que ofrece gráficos impresionantes y tiempos de carga ultrarrápidos para una experiencia de juego inmersiva.', 549990, 'productos/PlayStation 5/ps5_square.png'),
-- ('CG001', 4, 'PC Gamer ASUS ROG Strix', 'Un potente equipo diseñado para los gamers más exigentes, equipado con los últimos componentes para ofrecer un rendimiento excepcional en cualquier juego.', 1299990, 'productos/PC Gamer/h7325_square.png'),
-- ('SG001', 5, 'Silla Gamer Secretlab Titan', 'Diseñada para el máximo confort, esta silla ofrece un soporte ergonómico y personalización ajustable para sesiones de juego prolongadas.', 349990, 'productos/Silla/41UZRUxHa4L._AC_SL1000__square.png'),
-- ('MS001', 6, 'Mouse Gamer Logitech G502 HERO', 'Con sensor de alta precisión y botones personalizables, este mouse es ideal para gamers que buscan un control preciso y personalización.', 49990, 'productos/Mouse/61mpMH5TzkL._AC_SL1500__square.png'),
-- ('MP001', 7, 'Mousepad Razer Goliathus Extended Chroma', 'Ofrece un área de juego amplia con iluminación RGB personalizable, asegurando una superficie suave y uniforme para el movimiento del mouse.', 29990, 'productos/MousePad/D_NQ_NP_711289-MLU70103676213_062023-O_square.png'),
-- ('PP001', 8, 'Polera Gamer Personalizada "Level-Up"', 'Una camiseta cómoda y estilizada, con la posibilidad de personalizarla con tu gamer tag o diseño favorito.', 14990, 'productos/Polera/polera_azul.png');

-- -- USUARIOS (ejemplo; password "secret123" hash con bcryptjs salt 10)
-- -- Para generar hash: const bcrypt = require('bcryptjs'); bcrypt.hashSync('secret123', 10);
-- INSERT INTO usuarios (rut, nombre, apellido, email, fecha_nacimiento, username, region, comuna, direccion, rol, password_hash) VALUES
-- ('12.345.678-9','Juan','Pérez','juan.perez@example.com','1990-05-12','juanp','Metropolitana','Santiago','Av. Siempre Viva 123','admin','$2a$10$FQk2dlueJmqwC7POGvQCgO/VGgku7aZ3uUHoS0qbB1Yj8eCd8dq9m'),
-- ('9.876.543-2','María','Gómez','maria.gomez@example.com','1995-11-03','mariag','Metropolitana','Providencia','Calle Falsa 456','user','$2a$10$FQk2dlueJmqwC7POGvQCgO/VGgku7aZ3uUHoS0qbB1Yj8eCd8dq9m');
