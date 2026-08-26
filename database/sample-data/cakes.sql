LOCK TABLES `cakes` WRITE;
/*!40000 ALTER TABLE `cakes` DISABLE KEYS */
;
INSERT INTO
    `cakes`
VALUES (
        1,
        'Chocolate Truffle Cake',
        'Rich chocolate cake with creamy truffle layers',
        'Chocolate',
        799.00,
        1,
        NULL
    ),
    (
        2,
        'Vanilla',
        'Light, sweet, and made with vanilla extract',
        'Chocolate',
        299.00,
        1,
        NULL
    ),
    (
        3,
        'Red Velvet',
        'Soft red sponge cake with cream cheese frosting',
        'Chocolate',
        399.00,
        1,
        NULL
    ),
    (
        6,
        'Butterscotch',
        'Vanilla cake with caramel crunch bits.',
        'Chocolate',
        499.00,
        1,
        NULL
    ),
    (
        7,
        'Pineapple Cake',
        'Light sponge layered with fresh fruit and cream.',
        'Chocolate',
        599.00,
        1,
        NULL
    ),
    (
        9,
        'Tiramisu',
        'Coffee-flavored Italian sponge cake.',
        'Chocolate',
        199.00,
        1,
        NULL
    );
/*!40000 ALTER TABLE `cakes` ENABLE KEYS */
;
UNLOCK TABLES;