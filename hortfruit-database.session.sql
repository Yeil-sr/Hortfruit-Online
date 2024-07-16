CREATE TABLE pedido_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    valor_produto DECIMAL(10, 2) NOT NULL,
    user_id INT NOT NULL
);
