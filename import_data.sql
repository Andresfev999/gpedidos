-- INSTRUCCIONES:
-- 1. Ve al "SQL Editor" en Supabase.
-- 2. Copia y pega todo este código.
-- 3. Dale click a "Run".

INSERT INTO orders (client, product, cost, price, paid_amount, status, date)
VALUES 
  ('Khaterine Acevedo', 'Trapeador', 36000, 45000, 45000, 'Entregado', '2024-01-20'),
  ('Khaterine Acevedo', 'Set Cocina', 74500, 90000, 0, 'Entregado', '2024-01-20'),
  ('Yeisi', 'Masajeador', 17500, 35000, 0, 'Pendiente por comprar', '2024-01-21');

-- Esto insertará tus 3 pedidos iniciales
