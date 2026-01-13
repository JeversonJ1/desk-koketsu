-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 27/10/2025 às 15:06
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `koketsu`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `tbl_avaliacoes`
--

CREATE TABLE `tbl_avaliacoes` (
  `id_avaliacoes` int(11) NOT NULL,
  `id_produto` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `nota_avaliacoes` int(11) DEFAULT NULL CHECK (`nota_avaliacoes` between 1 and 5),
  `comentario_avaliacoes` text DEFAULT NULL,
  `data_avaliacao_avaliacoes` datetime DEFAULT current_timestamp(),
  `criado_em` datetime DEFAULT NULL,
  `atualizado_em` datetime DEFAULT NULL,
  `excluido_em` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tbl_avaliacoes`
--

INSERT INTO `tbl_avaliacoes` (`id_avaliacoes`, `id_produto`, `id_cliente`, `nota_avaliacoes`, `comentario_avaliacoes`, `data_avaliacao_avaliacoes`, `criado_em`, `atualizado_em`, `excluido_em`) VALUES
(1, 1, 1, 5, 'Excelente camiseta, material de ótima qualidade.', '2025-08-28 11:40:33', NULL, NULL, NULL),
(2, 2, 2, 4, 'Calça jeans confortável, só a cor que é um pouco diferente da foto.', '2025-08-28 11:40:33', NULL, NULL, NULL),
(3, 3, 3, 5, 'O vestido é lindo e o caimento perfeito!', '2025-08-28 11:40:33', NULL, NULL, NULL),
(4, 4, 4, 4, 'Saia muito elegante, chegou rápido.', '2025-08-28 11:40:33', NULL, NULL, NULL),
(5, 5, 5, 5, 'Blusa de tricot macia e quentinha, adorei!', '2025-08-28 11:40:33', NULL, NULL, NULL),
(6, 6, 6, 3, 'A jaqueta é boa, mas o tamanho P ficou um pouco grande.', '2025-08-28 11:40:33', NULL, NULL, NULL),
(7, 7, 7, 5, 'Moletom super confortável e estiloso.', '2025-08-28 11:40:33', NULL, NULL, NULL),
(8, 8, 8, 4, 'Bermuda leve e ideal para exercícios.', '2025-08-28 11:40:33', NULL, NULL, NULL),
(9, 9, 9, 5, 'Ótimo cinto, ajustável e resistente.', '2025-08-28 11:40:33', NULL, NULL, NULL),
(10, 10, 10, 4, 'Tênis bonito, mas a forma é um pouco pequena.', '2025-08-28 11:40:33', NULL, NULL, NULL),
(11, 11, 11, 5, 'Biquíni de alta qualidade, veste super bem.', '2025-08-28 11:40:33', NULL, NULL, NULL),
(12, 12, 12, 5, 'Lingerie linda e confortável, recomendo.', '2025-08-28 11:40:33', NULL, NULL, NULL),
(13, 13, 13, 4, 'Calça de academia muito boa, não fica transparente.', '2025-08-28 11:40:33', NULL, NULL, NULL),
(14, 14, 14, 5, 'Vestido infantil adorável, minha filha amou!', '2025-08-28 11:40:33', NULL, NULL, NULL),
(15, 15, 15, 5, 'Blusa plus size perfeita, caimento excelente.', '2025-08-28 11:40:33', NULL, NULL, NULL),
(16, 16, 16, 4, 'Conjunto esportivo de boa qualidade.', '2025-08-28 11:40:33', NULL, NULL, NULL),
(17, 17, 17, 5, 'Camiseta dry-fit ideal para treinar, leve e fresca.', '2025-08-28 11:40:33', NULL, NULL, NULL),
(18, 18, 18, 4, 'Camisa social de bom tecido, a cor é exatamente como na foto.', '2025-08-28 11:40:33', NULL, NULL, NULL),
(19, 19, 19, 5, 'Calça jeans super confortável e estilosa.', '2025-08-28 11:40:33', NULL, NULL, NULL),
(20, 20, 20, 5, 'Macacão lindo e fresco, perfeito para o verão.', '2025-08-28 11:40:33', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `tbl_carrinho`
--

CREATE TABLE `tbl_carrinho` (
  `id_carrinho` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `data_pedido_carrinho` datetime DEFAULT current_timestamp(),
  `total_carrinho` decimal(10,2) NOT NULL,
  `status_carrinho` varchar(50) DEFAULT 'Pendente',
  `criado_em` datetime DEFAULT NULL,
  `atualizado_em` datetime DEFAULT NULL,
  `excluido_em` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tbl_carrinho`
--

INSERT INTO `tbl_carrinho` (`id_carrinho`, `id_cliente`, `data_pedido_carrinho`, `total_carrinho`, `status_carrinho`, `criado_em`, `atualizado_em`, `excluido_em`) VALUES
(1, 1, '2025-08-28 10:00:00', 49.90, 'aberto', NULL, NULL, NULL),
(2, 2, '2025-08-28 10:05:00', 129.90, 'aberto', NULL, NULL, NULL),
(3, 3, '2025-08-28 10:10:00', 89.90, 'fechado', NULL, NULL, NULL),
(4, 4, '2025-08-28 10:15:00', 75.00, 'aberto', NULL, NULL, NULL),
(5, 5, '2025-08-28 10:20:00', 99.90, 'fechado', NULL, NULL, NULL),
(6, 6, '2025-08-28 10:25:00', 189.90, 'aberto', NULL, NULL, NULL),
(7, 7, '2025-08-28 10:30:00', 110.00, 'fechado', NULL, NULL, NULL),
(8, 8, '2025-08-28 10:35:00', 65.00, 'aberto', NULL, NULL, NULL),
(9, 9, '2025-08-28 10:40:00', 55.00, 'fechado', NULL, NULL, NULL),
(10, 10, '2025-08-28 10:45:00', 170.00, 'aberto', NULL, NULL, NULL),
(11, 11, '2025-08-28 10:50:00', 85.00, 'fechado', NULL, NULL, NULL),
(12, 12, '2025-08-28 10:55:00', 79.90, 'aberto', NULL, NULL, NULL),
(13, 13, '2025-08-28 11:00:00', 95.00, 'fechado', NULL, NULL, NULL),
(14, 14, '2025-08-28 11:05:00', 55.00, 'aberto', NULL, NULL, NULL),
(15, 15, '2025-08-28 11:10:00', 70.00, 'fechado', NULL, NULL, NULL),
(16, 16, '2025-08-28 11:15:00', 150.00, 'aberto', NULL, NULL, NULL),
(17, 17, '2025-08-28 11:20:00', 59.90, 'fechado', NULL, NULL, NULL),
(18, 18, '2025-08-28 11:25:00', 120.00, 'aberto', NULL, NULL, NULL),
(19, 19, '2025-08-28 11:30:00', 135.00, 'fechado', NULL, NULL, NULL),
(20, 20, '2025-08-28 11:35:00', 115.00, 'aberto', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `tbl_categorias`
--

CREATE TABLE `tbl_categorias` (
  `id_categorias` int(11) NOT NULL,
  `nome_categorias` varchar(100) NOT NULL,
  `descricao_categorias` text DEFAULT NULL,
  `criado_em` datetime DEFAULT NULL,
  `atualizado_em` datetime DEFAULT NULL,
  `excluido_em` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tbl_categorias`
--

INSERT INTO `tbl_categorias` (`id_categorias`, `nome_categorias`, `descricao_categorias`, `criado_em`, `atualizado_em`, `excluido_em`) VALUES
(1, 'Camisetas', 'Camisetas casuais e esportivas', '2025-08-26 11:47:45', NULL, NULL),
(2, 'Calças', 'Calças jeans, sarja e moletom', '2025-08-26 11:47:45', NULL, NULL),
(3, 'Tênis', 'Tênis esportivos e casuais', '2025-08-26 11:47:45', NULL, NULL),
(4, 'Jaquetas', 'Jaquetas jeans, couro e corta-vento', '2025-08-26 11:47:45', NULL, NULL),
(5, 'Acessórios', 'Bonés, cintos e mochilas', '2025-08-26 11:47:45', NULL, NULL),
(6, 'Camisetas', 'Camisetas em algodão, poliéster e mistas', '2025-08-28 10:59:07', NULL, NULL),
(7, 'Calças', 'Calças jeans, sarja e alfaiataria', '2025-08-28 10:59:07', NULL, NULL),
(8, 'Bermudas', 'Bermudas casuais e esportivas', '2025-08-28 10:59:07', NULL, NULL),
(9, 'Jaquetas', 'Jaquetas jeans, couro e corta-vento', '2025-08-28 10:59:07', NULL, NULL),
(10, 'Moletons', 'Moletons com e sem capuz', '2025-08-28 10:59:07', NULL, NULL),
(11, 'Vestidos', 'Vestidos casuais e sociais', '2025-08-28 10:59:07', NULL, NULL),
(12, 'Saias', 'Saias curtas, midi e longas', '2025-08-28 10:59:07', NULL, NULL),
(13, 'Camisas Sociais', 'Camisas para trabalho e eventos', '2025-08-28 10:59:07', NULL, NULL),
(14, 'Blusas', 'Blusas básicas e fashion', '2025-08-28 10:59:07', NULL, NULL),
(15, 'Shorts', 'Shorts jeans e tecido', '2025-08-28 10:59:07', NULL, NULL),
(16, 'Polos', 'Camisas polo variadas', '2025-08-28 10:59:07', NULL, NULL),
(17, 'Macacões', 'Macacões curtos e longos', '2025-08-28 10:59:07', NULL, NULL),
(18, 'Acessórios', 'Cintos, carteiras, óculos etc.', '2025-08-28 10:59:07', NULL, NULL),
(19, 'Bonés', 'Bonés aba reta e curva', '2025-08-28 10:59:07', NULL, NULL),
(20, 'Meias', 'Meias esportivas e sociais', '2025-08-28 10:59:07', NULL, NULL),
(21, 'Roupa Íntima', 'Lingerie e cuecas', '2025-08-28 10:59:07', NULL, NULL),
(22, 'Moda Praia', 'Biquínis, sungas e saídas', '2025-08-28 10:59:07', NULL, NULL),
(23, 'Calçados', 'Tênis, botas e sandálias', '2025-08-28 10:59:07', NULL, NULL),
(24, 'Fitness', 'Roupas para academia', '2025-08-28 10:59:07', NULL, NULL),
(25, 'Plus Size', 'Modelagens especiais e confortáveis', '2025-08-28 10:59:07', NULL, NULL),
(26, 'Camisetas', 'Camisetas em algodão, poliéster e mistas', '2025-08-28 11:23:33', NULL, NULL),
(27, 'Calças', 'Calças jeans, sarja e alfaiataria', '2025-08-28 11:23:33', NULL, NULL),
(28, 'Bermudas', 'Bermudas casuais e esportivas', '2025-08-28 11:23:33', NULL, NULL),
(29, 'Jaquetas', 'Jaquetas jeans, couro e corta-vento', '2025-08-28 11:23:33', NULL, NULL),
(30, 'Moletons', 'Moletons com e sem capuz', '2025-08-28 11:23:33', NULL, NULL),
(31, 'Vestidos', 'Vestidos casuais e sociais', '2025-08-28 11:23:33', NULL, NULL),
(32, 'Saias', 'Saias curtas, midi e longas', '2025-08-28 11:23:33', NULL, NULL),
(33, 'Camisas Sociais', 'Camisas para trabalho e eventos', '2025-08-28 11:23:33', NULL, NULL),
(34, 'Blusas', 'Blusas básicas e fashion', '2025-08-28 11:23:33', NULL, NULL),
(35, 'Shorts', 'Shorts jeans e tecido', '2025-08-28 11:23:33', NULL, NULL),
(36, 'Polos', 'Camisas polo variadas', '2025-08-28 11:23:33', NULL, NULL),
(37, 'Macacões', 'Macacões curtos e longos', '2025-08-28 11:23:33', NULL, NULL),
(38, 'Acessórios', 'Cintos, carteiras, óculos etc.', '2025-08-28 11:23:33', NULL, NULL),
(39, 'Bonés', 'Bonés aba reta e curva', '2025-08-28 11:23:33', NULL, NULL),
(40, 'Meias', 'Meias esportivas e sociais', '2025-08-28 11:23:33', NULL, NULL),
(41, 'Roupa Íntima', 'Lingerie e cuecas', '2025-08-28 11:23:33', NULL, NULL),
(42, 'Moda Praia', 'Biquínis, sungas e saídas', '2025-08-28 11:23:33', NULL, NULL),
(43, 'Calçados', 'Tênis, botas e sandálias', '2025-08-28 11:23:33', NULL, NULL),
(44, 'Fitness', 'Roupas para academia', '2025-08-28 11:23:33', NULL, NULL),
(45, 'Plus Size', 'Modelagens especiais e confortáveis', '2025-08-28 11:23:33', NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `tbl_clientes`
--

CREATE TABLE `tbl_clientes` (
  `id_cliente` int(11) NOT NULL,
  `nome_clientes` varchar(100) NOT NULL,
  `email_clientes` varchar(150) NOT NULL,
  `senha_clientes` varchar(255) NOT NULL,
  `telefone_clientes` varchar(20) DEFAULT NULL,
  `endereco_clientes` text DEFAULT NULL,
  `data_cadastro` datetime DEFAULT current_timestamp(),
  `criado_em` datetime DEFAULT NULL,
  `atualizado_em` datetime DEFAULT NULL,
  `excluido_em` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tbl_clientes`
--

INSERT INTO `tbl_clientes` (`id_cliente`, `nome_clientes`, `email_clientes`, `senha_clientes`, `telefone_clientes`, `endereco_clientes`, `data_cadastro`, `criado_em`, `atualizado_em`, `excluido_em`) VALUES
(1, 'Ana Silva', 'ana.silva@email.com', 'senha123', '11988887777', 'Rua das Flores, 123 - São Paulo/SP', '2025-08-28 11:04:11', '2025-08-28 11:04:11', NULL, NULL),
(2, 'Bruno Costa', 'bruno.costa@email.com', 'senha123', '21999996666', 'Av. Brasil, 456 - Rio de Janeiro/RJ', '2025-08-28 11:04:11', '2025-08-28 11:04:11', NULL, NULL),
(3, 'Carla Souza', 'carla.souza@email.com', 'senha123', '31988885555', 'Rua Goiás, 789 - Belo Horizonte/MG', '2025-08-28 11:04:11', '2025-08-28 11:04:11', NULL, NULL),
(4, 'Diego Santos', 'diego.santos@email.com', 'senha123', '41977774444', 'Rua Paraná, 321 - Curitiba/PR', '2025-08-28 11:04:11', '2025-08-28 11:04:11', NULL, NULL),
(5, 'Eduarda Lima', 'eduarda.lima@email.com', 'senha123', '51966663333', 'Rua Central, 654 - Porto Alegre/RS', '2025-08-28 11:04:11', '2025-08-28 11:04:11', NULL, NULL),
(6, 'Fernando Alves', 'fernando.alves@email.com', 'senha123', '61955552222', 'Rua Brasília, 987 - Brasília/DF', '2025-08-28 11:04:11', '2025-08-28 11:04:11', NULL, NULL),
(7, 'Gabriela Torres', 'gabriela.torres@email.com', 'senha123', '71944441111', 'Rua Salvador, 147 - Salvador/BA', '2025-08-28 11:04:11', '2025-08-28 11:04:11', NULL, NULL),
(8, 'Henrique Rocha', 'henrique.rocha@email.com', 'senha123', '81933339999', 'Av. Recife, 258 - Recife/PE', '2025-08-28 11:04:11', '2025-08-28 11:04:11', NULL, NULL),
(9, 'Isabela Martins', 'isabela.martins@email.com', 'senha123', '11922228888', 'Rua Paulista, 369 - São Paulo/SP', '2025-08-28 11:04:11', '2025-08-28 11:04:11', NULL, NULL),
(10, 'João Pedro', 'joao.pedro@email.com', 'senha123', '21911117777', 'Rua Copacabana, 741 - Rio de Janeiro/RJ', '2025-08-28 11:04:11', '2025-08-28 11:04:11', NULL, NULL),
(11, 'Karen Oliveira', 'karen.oliveira@email.com', 'senha123', '31900009999', 'Rua Pampulha, 852 - Belo Horizonte/MG', '2025-08-28 11:04:11', '2025-08-28 11:04:11', NULL, NULL),
(12, 'Lucas Ferreira', 'lucas.ferreira@email.com', 'senha123', '41988880000', 'Av. Batel, 963 - Curitiba/PR', '2025-08-28 11:04:11', '2025-08-28 11:04:11', NULL, NULL),
(13, 'Mariana Cunha', 'mariana.cunha@email.com', 'senha123', '51977779999', 'Rua Ipiranga, 159 - Porto Alegre/RS', '2025-08-28 11:04:11', '2025-08-28 11:04:11', NULL, NULL),
(14, 'Nicolas Mendes', 'nicolas.mendes@email.com', 'senha123', '61966668888', 'Av. JK, 357 - Brasília/DF', '2025-08-28 11:04:11', '2025-08-28 11:04:11', NULL, NULL),
(15, 'Olívia Andrade', 'olivia.andrade@email.com', 'senha123', '71955550000', 'Rua Barra, 753 - Salvador/BA', '2025-08-28 11:04:11', '2025-08-28 11:04:11', NULL, NULL),
(16, 'Paulo Ribeiro', 'paulo.ribeiro@email.com', 'senha123', '81944443333', 'Rua Boa Vista, 951 - Recife/PE', '2025-08-28 11:04:11', '2025-08-28 11:04:11', NULL, NULL),
(17, 'Rafaela Costa', 'rafaela.costa@email.com', 'senha123', '11933334444', 'Av. Faria Lima, 147 - São Paulo/SP', '2025-08-28 11:04:11', '2025-08-28 11:04:11', NULL, NULL),
(18, 'Samuel Nunes', 'samuel.nunes@email.com', 'senha123', '21922223333', 'Rua Flamengo, 258 - Rio de Janeiro/RJ', '2025-08-28 11:04:11', '2025-08-28 11:04:11', NULL, NULL),
(19, 'Tatiane Moraes', 'tatiane.moraes@email.com', 'senha123', '31911112222', 'Rua Savassi, 369 - Belo Horizonte/MG', '2025-08-28 11:04:11', '2025-08-28 11:04:11', NULL, NULL),
(20, 'Victor Lima', 'victor.lima@email.com', 'senha123', '41900001111', 'Av. XV de Novembro, 741 - Curitiba/PR', '2025-08-28 11:04:11', '2025-08-28 11:04:11', NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `tbl_cores`
--

CREATE TABLE `tbl_cores` (
  `id_cores` int(11) NOT NULL,
  `id_produto` int(11) NOT NULL,
  `cor_cores` varchar(50) NOT NULL,
  `quantidade_cores` int(11) NOT NULL,
  `criado_em` datetime DEFAULT NULL,
  `atualizado_em` datetime DEFAULT NULL,
  `excluido_em` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tbl_cores`
--

INSERT INTO `tbl_cores` (`id_cores`, `id_produto`, `cor_cores`, `quantidade_cores`, `criado_em`, `atualizado_em`, `excluido_em`) VALUES
(1, 1, 'Branco', 80, '2025-08-28 11:05:15', '2025-08-28 11:05:15', NULL),
(2, 2, 'Preto', 70, '2025-08-28 11:05:15', '2025-08-28 11:05:15', NULL),
(3, 3, 'Azul Escuro', 40, '2025-08-28 11:05:15', '2025-08-28 11:05:15', NULL),
(4, 3, 'Azul Claro', 30, '2025-08-28 11:05:15', '2025-08-28 11:05:15', NULL),
(5, 4, 'Bege', 25, '2025-08-28 11:05:15', '2025-08-28 11:05:15', NULL),
(6, 4, 'Marrom', 20, '2025-08-28 11:05:15', '2025-08-28 11:05:15', NULL),
(7, 5, 'Azul Jeans', 50, '2025-08-28 11:05:15', '2025-08-28 11:05:15', NULL),
(8, 5, 'Preto', 30, '2025-08-28 11:05:15', '2025-08-28 11:05:15', NULL),
(9, 6, 'Cinza', 40, '2025-08-28 11:05:15', '2025-08-28 11:05:15', NULL),
(10, 6, 'Preto', 30, '2025-08-28 11:05:15', '2025-08-28 11:05:15', NULL),
(11, 7, 'Azul Jeans', 25, '2025-08-28 11:05:15', '2025-08-28 11:05:15', NULL),
(12, 7, 'Preto', 20, '2025-08-28 11:05:15', '2025-08-28 11:05:15', NULL),
(13, 8, 'Preto', 30, '2025-08-28 11:05:15', '2025-08-28 11:05:15', NULL),
(14, 8, 'Marrom', 10, '2025-08-28 11:05:15', '2025-08-28 11:05:15', NULL),
(15, 9, 'Cinza', 40, '2025-08-28 11:05:15', '2025-08-28 11:05:15', NULL),
(16, 9, 'Preto', 30, '2025-08-28 11:05:15', '2025-08-28 11:05:15', NULL),
(17, 10, 'Azul Marinho', 30, '2025-08-28 11:05:15', '2025-08-28 11:05:15', NULL),
(18, 10, 'Preto', 20, '2025-08-28 11:05:15', '2025-08-28 11:05:15', NULL),
(19, 11, 'Estampado Floral', 35, '2025-08-28 11:05:15', '2025-08-28 11:05:15', NULL),
(20, 12, 'Preto', 20, '2025-08-28 11:05:15', '2025-08-28 11:05:15', NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `tbl_estoque_movimentacao`
--

CREATE TABLE `tbl_estoque_movimentacao` (
  `id_estoque_movimentacao` int(11) NOT NULL,
  `id_produto` int(11) NOT NULL,
  `tipo_estoque_movimentacao` enum('disponivel','indisponivel') NOT NULL,
  `quantidade_estoque_movimentacao` int(11) NOT NULL,
  `data_movimentacao_estoque_movimentacao` datetime DEFAULT current_timestamp(),
  `descricao_estoque_movimentacao` text DEFAULT NULL,
  `criado_em` datetime DEFAULT NULL,
  `atualizado_em` datetime DEFAULT NULL,
  `excluido_em` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tbl_estoque_movimentacao`
--

INSERT INTO `tbl_estoque_movimentacao` (`id_estoque_movimentacao`, `id_produto`, `tipo_estoque_movimentacao`, `quantidade_estoque_movimentacao`, `data_movimentacao_estoque_movimentacao`, `descricao_estoque_movimentacao`, `criado_em`, `atualizado_em`, `excluido_em`) VALUES
(1, 1, '', 150, '2025-08-15 00:00:00', 'Estoque inicial de Camiseta Casual', NULL, NULL, NULL),
(2, 2, '', 80, '2025-08-15 00:00:00', 'Estoque inicial de Calça Jeans Skinny', NULL, NULL, NULL),
(3, 3, '', 50, '2025-08-15 00:00:00', 'Estoque inicial de Vestido Florido', NULL, NULL, NULL),
(4, 4, '', 45, '2025-08-15 00:00:00', 'Estoque inicial de Saia Plissada', NULL, NULL, NULL),
(5, 5, '', 60, '2025-08-15 00:00:00', 'Estoque inicial de Blusa de Tricot', NULL, NULL, NULL),
(6, 6, '', 30, '2025-08-15 00:00:00', 'Estoque inicial de Jaqueta Jeans', NULL, NULL, NULL),
(7, 7, '', 70, '2025-08-15 00:00:00', 'Estoque inicial de Moletom Canguru', NULL, NULL, NULL),
(8, 8, '', 90, '2025-08-15 00:00:00', 'Estoque inicial de Bermuda Esportiva', NULL, NULL, NULL),
(9, 9, '', 120, '2025-08-15 00:00:00', 'Estoque inicial de Cinto de Couro', NULL, NULL, NULL),
(10, 10, '', 100, '2025-08-15 00:00:00', 'Estoque inicial de Tênis Casual', NULL, NULL, NULL),
(11, 11, '', 70, '2025-08-15 00:00:00', 'Estoque inicial de Biquíni', NULL, NULL, NULL),
(12, 12, '', 65, '2025-08-15 00:00:00', 'Estoque inicial de Lingerie', NULL, NULL, NULL),
(13, 13, '', 110, '2025-08-15 00:00:00', 'Estoque inicial de Calça Legging Fitness', NULL, NULL, NULL),
(14, 14, '', 85, '2025-08-15 00:00:00', 'Estoque inicial de Vestido Infantil', NULL, NULL, NULL),
(15, 15, '', 40, '2025-08-15 00:00:00', 'Estoque inicial de Blusa Plus Size', NULL, NULL, NULL),
(16, 16, '', 50, '2025-08-15 00:00:00', 'Estoque inicial de Conjunto de Moletons', NULL, NULL, NULL),
(17, 17, '', 80, '2025-08-15 00:00:00', 'Estoque inicial de Camiseta Dry-fit', NULL, NULL, NULL),
(18, 18, '', 75, '2025-08-15 00:00:00', 'Estoque inicial de Camisa Social', NULL, NULL, NULL),
(19, 19, '', 60, '2025-08-15 00:00:00', 'Estoque inicial de Calça Jeans Reta', NULL, NULL, NULL),
(20, 20, '', 55, '2025-08-15 00:00:00', 'Estoque inicial de Macacão', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `tbl_imagem`
--

CREATE TABLE `tbl_imagem` (
  `id_imagem` int(11) NOT NULL,
  `id_produto` int(11) NOT NULL,
  `id_cor` int(11) NOT NULL,
  `id_tamanho` int(11) NOT NULL,
  `caminho_imagem` varchar(255) NOT NULL,
  `descricao_imagem` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tbl_imagem`
--

INSERT INTO `tbl_imagem` (`id_imagem`, `id_produto`, `id_cor`, `id_tamanho`, `caminho_imagem`, `descricao_imagem`) VALUES
(1, 1, 1, 1, 'img/camiseta_branca_p.jpg', 'Camiseta branca tamanho P'),
(2, 1, 1, 2, 'img/camiseta_branca_m.jpg', 'Camiseta branca tamanho M'),
(3, 1, 1, 3, 'img/camiseta_branca_g.jpg', 'Camiseta branca tamanho G'),
(4, 2, 2, 4, 'img/camiseta_preta_p.jpg', 'Camiseta preta tamanho P'),
(5, 2, 2, 5, 'img/camiseta_preta_m.jpg', 'Camiseta preta tamanho M'),
(6, 2, 2, 6, 'img/camiseta_preta_g.jpg', 'Camiseta preta tamanho G'),
(7, 3, 3, 7, 'img/calca_jeans_38.jpg', 'Calça jeans azul escuro 38'),
(8, 3, 3, 8, 'img/calca_jeans_40.jpg', 'Calça jeans azul escuro 40'),
(9, 3, 3, 9, 'img/calca_jeans_42.jpg', 'Calça jeans azul escuro 42'),
(10, 4, 5, 10, 'img/calca_sarja_36.jpg', 'Calça sarja bege 36'),
(11, 4, 5, 11, 'img/calca_sarja_38.jpg', 'Calça sarja bege 38'),
(12, 4, 5, 12, 'img/calca_sarja_40.jpg', 'Calça sarja bege 40'),
(13, 5, 7, 13, 'img/bermuda_jeans_p.jpg', 'Bermuda jeans azul P'),
(14, 5, 7, 14, 'img/bermuda_jeans_m.jpg', 'Bermuda jeans azul M'),
(15, 5, 7, 15, 'img/bermuda_jeans_g.jpg', 'Bermuda jeans azul G'),
(16, 6, 9, 16, 'img/bermuda_moletom_p.jpg', 'Bermuda moletom cinza P'),
(17, 6, 9, 17, 'img/bermuda_moletom_m.jpg', 'Bermuda moletom cinza M'),
(18, 6, 9, 18, 'img/bermuda_moletom_g.jpg', 'Bermuda moletom cinza G'),
(19, 7, 11, 19, 'img/jaqueta_jeans_m.jpg', 'Jaqueta jeans azul M'),
(20, 7, 11, 20, 'img/jaqueta_jeans_g.jpg', 'Jaqueta jeans azul G');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tbl_itens_pedidos`
--

CREATE TABLE `tbl_itens_pedidos` (
  `id_itens_pedidos` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `id_produto` int(11) NOT NULL,
  `quantidade` int(11) NOT NULL,
  `preco_unitario` decimal(10,2) NOT NULL,
  `criado_em` datetime DEFAULT NULL,
  `atualizado_em` datetime DEFAULT NULL,
  `excluido_em` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tbl_itens_pedidos`
--

INSERT INTO `tbl_itens_pedidos` (`id_itens_pedidos`, `id_pedido`, `id_produto`, `quantidade`, `preco_unitario`, `criado_em`, `atualizado_em`, `excluido_em`) VALUES
(1, 1, 1, 1, 49.90, NULL, NULL, NULL),
(2, 2, 2, 1, 129.90, NULL, NULL, NULL),
(3, 3, 3, 1, 89.90, NULL, NULL, NULL),
(4, 4, 4, 1, 75.00, NULL, NULL, NULL),
(5, 5, 5, 1, 99.90, NULL, NULL, NULL),
(6, 6, 6, 1, 189.90, NULL, NULL, NULL),
(7, 7, 7, 1, 110.00, NULL, NULL, NULL),
(8, 8, 8, 1, 65.00, NULL, NULL, NULL),
(9, 9, 9, 1, 55.00, NULL, NULL, NULL),
(10, 10, 10, 1, 170.00, NULL, NULL, NULL),
(11, 11, 11, 1, 85.00, NULL, NULL, NULL),
(12, 12, 12, 1, 79.90, NULL, NULL, NULL),
(13, 13, 13, 1, 95.00, NULL, NULL, NULL),
(14, 14, 14, 1, 55.00, NULL, NULL, NULL),
(15, 15, 15, 1, 70.00, NULL, NULL, NULL),
(16, 16, 16, 1, 150.00, NULL, NULL, NULL),
(17, 17, 17, 1, 59.90, NULL, NULL, NULL),
(18, 18, 18, 1, 120.00, NULL, NULL, NULL),
(19, 19, 19, 1, 135.00, NULL, NULL, NULL),
(20, 20, 20, 1, 115.00, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `tbl_pedidos`
--

CREATE TABLE `tbl_pedidos` (
  `id_pedido` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `data_pedido` datetime DEFAULT current_timestamp(),
  `total_pedido` decimal(10,2) NOT NULL,
  `status_pedido` enum('pendente','pago','enviado','concluido','cancelado') DEFAULT 'pendente',
  `criado_em` datetime DEFAULT NULL,
  `atualizado_em` datetime DEFAULT NULL,
  `excluido_em` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tbl_pedidos`
--

INSERT INTO `tbl_pedidos` (`id_pedido`, `id_cliente`, `data_pedido`, `total_pedido`, `status_pedido`, `criado_em`, `atualizado_em`, `excluido_em`) VALUES
(81, 1, '2025-08-28 11:22:43', 159.80, 'pago', '2025-08-28 11:22:43', '2025-08-28 11:22:43', NULL),
(82, 2, '2025-08-28 11:22:43', 229.90, 'pendente', '2025-08-28 11:22:43', '2025-08-28 11:22:43', NULL),
(83, 3, '2025-08-28 11:22:43', 89.90, 'enviado', '2025-08-28 11:22:43', '2025-08-28 11:22:43', NULL),
(84, 4, '2025-08-28 11:22:43', 319.70, 'concluido', '2025-08-28 11:22:43', '2025-08-28 11:22:43', NULL),
(85, 5, '2025-08-28 11:22:43', 199.90, 'cancelado', '2025-08-28 11:22:43', '2025-08-28 11:22:43', NULL),
(86, 6, '2025-08-28 11:22:43', 179.90, 'pago', '2025-08-28 11:22:43', '2025-08-28 11:22:43', NULL),
(87, 7, '2025-08-28 11:22:43', 249.90, 'pendente', '2025-08-28 11:22:43', '2025-08-28 11:22:43', NULL),
(88, 8, '2025-08-28 11:22:43', 119.90, 'enviado', '2025-08-28 11:22:43', '2025-08-28 11:22:43', NULL),
(89, 9, '2025-08-28 11:22:43', 459.60, 'pago', '2025-08-28 11:22:43', '2025-08-28 11:22:43', NULL),
(90, 10, '2025-08-28 11:22:43', 139.90, 'concluido', '2025-08-28 11:22:43', '2025-08-28 11:22:43', NULL),
(91, 11, '2025-08-28 11:22:43', 69.90, 'pago', '2025-08-28 11:22:43', '2025-08-28 11:22:43', NULL),
(92, 12, '2025-08-28 11:22:43', 189.90, 'pendente', '2025-08-28 11:22:43', '2025-08-28 11:22:43', NULL),
(93, 13, '2025-08-28 11:22:43', 209.90, 'pago', '2025-08-28 11:22:43', '2025-08-28 11:22:43', NULL),
(94, 14, '2025-08-28 11:22:43', 349.70, 'enviado', '2025-08-28 11:22:43', '2025-08-28 11:22:43', NULL),
(95, 15, '2025-08-28 11:22:43', 99.90, 'pago', '2025-08-28 11:22:43', '2025-08-28 11:22:43', NULL),
(96, 16, '2025-08-28 11:22:43', 159.90, 'cancelado', '2025-08-28 11:22:43', '2025-08-28 11:22:43', NULL),
(97, 17, '2025-08-28 11:22:43', 279.80, 'pago', '2025-08-28 11:22:43', '2025-08-28 11:22:43', NULL),
(98, 18, '2025-08-28 11:22:43', 199.90, 'pendente', '2025-08-28 11:22:43', '2025-08-28 11:22:43', NULL),
(99, 19, '2025-08-28 11:22:43', 89.90, 'enviado', '2025-08-28 11:22:43', '2025-08-28 11:22:43', NULL),
(100, 20, '2025-08-28 11:22:43', 499.90, 'pago', '2025-08-28 11:22:43', '2025-08-28 11:22:43', NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `tbl_produtos`
--

CREATE TABLE `tbl_produtos` (
  `id_produto` int(11) NOT NULL,
  `nome_produtos` varchar(100) NOT NULL,
  `descricao_produtos` text DEFAULT NULL,
  `preco_produtos` decimal(10,2) NOT NULL,
  `estoque_produtos` int(11) NOT NULL,
  `imagem_produtos` varchar(255) DEFAULT NULL,
  `id_categoria` int(11) DEFAULT NULL,
  `criado_em` datetime DEFAULT NULL,
  `atualizado_em` datetime DEFAULT NULL,
  `excluido_em` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tbl_produtos`
--

INSERT INTO `tbl_produtos` (`id_produto`, `nome_produtos`, `descricao_produtos`, `preco_produtos`, `estoque_produtos`, `imagem_produtos`, `id_categoria`, `criado_em`, `atualizado_em`, `excluido_em`) VALUES
(1, 'Camiseta Oversized Branca', 'Camiseta branca básica, 100% algodão', 59.90, 50, 'img/camiseta_branca.jpg', 1, '2025-08-26 11:47:45', NULL, NULL),
(2, 'Camiseta Preta Slim', 'Camiseta preta justa, confortável e estilosa', 69.90, 40, 'img/camiseta_preta.jpg', 1, '2025-08-26 11:47:45', NULL, NULL),
(3, 'Calça Jeans Slim Azul', 'Calça jeans slim fit azul escuro', 149.90, 30, 'img/calca_jeans.jpg', 2, '2025-08-26 11:47:45', NULL, NULL),
(4, 'Calça Moletom Cinza', 'Calça moletom unissex, confortável', 129.90, 20, 'img/calca_moletom.jpg', 2, '2025-08-26 11:47:45', NULL, NULL),
(5, 'Tênis Running Preto', 'Tênis esportivo leve para corrida', 299.90, 20, 'img/tenis_running.jpg', 3, '2025-08-26 11:47:45', NULL, NULL),
(6, 'Tênis Casual Branco', 'Tênis branco casual em couro sintético', 259.90, 25, 'img/tenis_casual.jpg', 3, '2025-08-26 11:47:45', NULL, NULL),
(7, 'Jaqueta Jeans Azul', 'Jaqueta jeans masculina oversized', 199.90, 15, 'img/jaqueta_jeans.jpg', 4, '2025-08-26 11:47:45', NULL, NULL),
(8, 'Jaqueta Corta-Vento Vermelha', 'Ideal para treinos e dias de vento', 179.90, 10, 'img/jaqueta_cortavento.jpg', 4, '2025-08-26 11:47:45', NULL, NULL),
(9, 'Boné Preto Trucker', 'Boné estilo trucker preto básico', 79.90, 35, 'img/bone_preto.jpg', 5, '2025-08-26 11:47:45', NULL, NULL),
(10, 'Mochila Esportiva Azul', 'Mochila leve com compartimento para notebook', 199.90, 12, 'img/mochila.jpg', 5, '2025-08-26 11:47:45', NULL, NULL),
(11, 'Camiseta Básica Branca', 'Camiseta unissex 100% algodão', 39.90, 150, 'camiseta_branca.jpg', 1, '2025-08-28 11:05:05', '2025-08-28 11:05:05', NULL),
(12, 'Camiseta Preta Slim', 'Camiseta preta modelagem slim', 49.90, 120, 'camiseta_preta.jpg', 1, '2025-08-28 11:05:05', '2025-08-28 11:05:05', NULL),
(13, 'Calça Jeans Azul', 'Calça jeans tradicional masculina', 119.90, 80, 'calca_jeans.jpg', 2, '2025-08-28 11:05:05', '2025-08-28 11:05:05', NULL),
(14, 'Calça Sarja Bege', 'Calça sarja slim feminina', 139.90, 60, 'calca_sarja.jpg', 2, '2025-08-28 11:05:05', '2025-08-28 11:05:05', NULL),
(15, 'Bermuda Jeans', 'Bermuda jeans casual masculina', 89.90, 100, 'bermuda_jeans.jpg', 3, '2025-08-28 11:05:05', '2025-08-28 11:05:05', NULL),
(16, 'Bermuda Moletom', 'Bermuda de moletom confortável', 69.90, 70, 'bermuda_moletom.jpg', 3, '2025-08-28 11:05:05', '2025-08-28 11:05:05', NULL),
(17, 'Jaqueta Jeans', 'Jaqueta jeans azul escura', 179.90, 50, 'jaqueta_jeans.jpg', 4, '2025-08-28 11:05:05', '2025-08-28 11:05:05', NULL),
(18, 'Jaqueta Couro', 'Jaqueta de couro sintético', 229.90, 40, 'jaqueta_couro.jpg', 4, '2025-08-28 11:05:05', '2025-08-28 11:05:05', NULL),
(19, 'Moletom Canguru', 'Moletom com capuz e bolso frontal', 149.90, 90, 'moletom_canguru.jpg', 5, '2025-08-28 11:05:05', '2025-08-28 11:05:05', NULL),
(20, 'Moletom Zíper', 'Moletom com zíper frontal', 159.90, 85, 'moletom_ziper.jpg', 5, '2025-08-28 11:05:05', '2025-08-28 11:05:05', NULL),
(21, 'Vestido Floral', 'Vestido leve estampa floral', 119.90, 70, 'vestido_floral.jpg', 6, '2025-08-28 11:05:05', '2025-08-28 11:05:05', NULL),
(22, 'Vestido Social Preto', 'Vestido social preto longo', 199.90, 40, 'vestido_social.jpg', 6, '2025-08-28 11:05:05', '2025-08-28 11:05:05', NULL),
(23, 'Saia Jeans', 'Saia jeans curta feminina', 89.90, 55, 'saia_jeans.jpg', 7, '2025-08-28 11:05:05', '2025-08-28 11:05:05', NULL),
(24, 'Saia Midi Plissada', 'Saia midi plissada elegante', 139.90, 35, 'saia_midi.jpg', 7, '2025-08-28 11:05:05', '2025-08-28 11:05:05', NULL),
(25, 'Camisa Social Branca', 'Camisa social manga longa', 129.90, 65, 'camisa_branca.jpg', 8, '2025-08-28 11:05:05', '2025-08-28 11:05:05', NULL),
(26, 'Camisa Social Azul', 'Camisa social azul clara', 139.90, 60, 'camisa_azul.jpg', 8, '2025-08-28 11:05:05', '2025-08-28 11:05:05', NULL),
(27, 'Tênis Casual Branco', 'Tênis casual unissex branco', 179.90, 90, 'tenis_branco.jpg', 18, '2025-08-28 11:05:05', '2025-08-28 11:05:05', NULL),
(28, 'Tênis Esportivo Preto', 'Tênis esportivo confortável', 199.90, 70, 'tenis_preto.jpg', 18, '2025-08-28 11:05:05', '2025-08-28 11:05:05', NULL),
(29, 'Biquíni Estampado', 'Biquíni feminino estampa tropical', 99.90, 80, 'biquini_estampado.jpg', 17, '2025-08-28 11:05:05', '2025-08-28 11:05:05', NULL),
(30, 'Sunga Azul', 'Sunga masculina azul marinho', 89.90, 60, 'sunga_azul.jpg', 17, '2025-08-28 11:05:05', '2025-08-28 11:05:05', NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `tbl_tamanhos`
--

CREATE TABLE `tbl_tamanhos` (
  `id_tamanhos` int(11) NOT NULL,
  `id_produto` int(11) NOT NULL,
  `tamanho_tamanhos` varchar(10) NOT NULL,
  `quantidade_tamanhos` int(11) NOT NULL,
  `criado_em` datetime DEFAULT NULL,
  `atualizado_em` datetime DEFAULT NULL,
  `excluido_em` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tbl_tamanhos`
--

INSERT INTO `tbl_tamanhos` (`id_tamanhos`, `id_produto`, `tamanho_tamanhos`, `quantidade_tamanhos`, `criado_em`, `atualizado_em`, `excluido_em`) VALUES
(1, 1, 'P', 40, '2025-08-28 11:04:37', '2025-08-28 11:04:37', NULL),
(2, 1, 'M', 60, '2025-08-28 11:04:37', '2025-08-28 11:04:37', NULL),
(3, 1, 'G', 50, '2025-08-28 11:04:37', '2025-08-28 11:04:37', NULL),
(4, 2, 'P', 30, '2025-08-28 11:04:37', '2025-08-28 11:04:37', NULL),
(5, 2, 'M', 50, '2025-08-28 11:04:37', '2025-08-28 11:04:37', NULL),
(6, 2, 'G', 40, '2025-08-28 11:04:37', '2025-08-28 11:04:37', NULL),
(7, 3, '38', 20, '2025-08-28 11:04:37', '2025-08-28 11:04:37', NULL),
(8, 3, '40', 30, '2025-08-28 11:04:37', '2025-08-28 11:04:37', NULL),
(9, 3, '42', 30, '2025-08-28 11:04:37', '2025-08-28 11:04:37', NULL),
(10, 4, '36', 15, '2025-08-28 11:04:37', '2025-08-28 11:04:37', NULL),
(11, 4, '38', 25, '2025-08-28 11:04:37', '2025-08-28 11:04:37', NULL),
(12, 4, '40', 20, '2025-08-28 11:04:37', '2025-08-28 11:04:37', NULL),
(13, 5, 'P', 35, '2025-08-28 11:04:37', '2025-08-28 11:04:37', NULL),
(14, 5, 'M', 40, '2025-08-28 11:04:37', '2025-08-28 11:04:37', NULL),
(15, 5, 'G', 25, '2025-08-28 11:04:37', '2025-08-28 11:04:37', NULL),
(16, 6, 'P', 20, '2025-08-28 11:04:37', '2025-08-28 11:04:37', NULL),
(17, 6, 'M', 30, '2025-08-28 11:04:37', '2025-08-28 11:04:37', NULL),
(18, 6, 'G', 20, '2025-08-28 11:04:37', '2025-08-28 11:04:37', NULL),
(19, 7, 'M', 25, '2025-08-28 11:04:37', '2025-08-28 11:04:37', NULL),
(20, 7, 'G', 25, '2025-08-28 11:04:37', '2025-08-28 11:04:37', NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `tbl_usuarios`
--

CREATE TABLE `tbl_usuarios` (
  `id_usuarios` int(11) NOT NULL,
  `nome_usuarios` varchar(100) NOT NULL,
  `email_usuarios` varchar(150) NOT NULL,
  `senha_usuarios` varchar(255) NOT NULL,
  `nivel_acesso` enum('admin','vendedor') DEFAULT 'vendedor',
  `criado_em` datetime DEFAULT NULL,
  `atualizado_em` datetime DEFAULT NULL,
  `excluido_em` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tbl_usuarios`
--

INSERT INTO `tbl_usuarios` (`id_usuarios`, `nome_usuarios`, `email_usuarios`, `senha_usuarios`, `nivel_acesso`, `criado_em`, `atualizado_em`, `excluido_em`) VALUES
(1, 'Administrador Master', 'admin.master@email.com', 'senha123', 'admin', '2025-08-28 11:04:20', '2025-08-28 11:04:20', NULL),
(2, 'Vendedor João', 'joao.vendedor@email.com', 'senha123', 'vendedor', '2025-08-28 11:04:20', '2025-08-28 11:04:20', NULL),
(3, 'Vendedor Maria', 'maria.vendedora@email.com', 'senha123', 'vendedor', '2025-08-28 11:04:20', '2025-08-28 11:04:20', NULL),
(4, 'Administrador Loja1', 'admin.loja1@email.com', 'senha123', 'admin', '2025-08-28 11:04:20', '2025-08-28 11:04:20', NULL),
(5, 'Administrador Loja2', 'admin.loja2@email.com', 'senha123', 'admin', '2025-08-28 11:04:20', '2025-08-28 11:04:20', NULL),
(6, 'Vendedor Carlos', 'carlos.vendedor@email.com', 'senha123', 'vendedor', '2025-08-28 11:04:20', '2025-08-28 11:04:20', NULL),
(7, 'Vendedor Ana', 'ana.vendedora@email.com', 'senha123', 'vendedor', '2025-08-28 11:04:20', '2025-08-28 11:04:20', NULL),
(8, 'Administrador Financeiro', 'financeiro.admin@email.com', 'senha123', 'admin', '2025-08-28 11:04:20', '2025-08-28 11:04:20', NULL),
(9, 'Administrador RH', 'rh.admin@email.com', 'senha123', 'admin', '2025-08-28 11:04:20', '2025-08-28 11:04:20', NULL),
(10, 'Vendedor Pedro', 'pedro.vendedor@email.com', 'senha123', 'vendedor', '2025-08-28 11:04:20', '2025-08-28 11:04:20', NULL),
(11, 'Vendedor Júlia', 'julia.vendedora@email.com', 'senha123', 'vendedor', '2025-08-28 11:04:20', '2025-08-28 11:04:20', NULL),
(12, 'Administrador TI', 'ti.admin@email.com', 'senha123', 'admin', '2025-08-28 11:04:20', '2025-08-28 11:04:20', NULL),
(13, 'Administrador Estoque', 'estoque.admin@email.com', 'senha123', 'admin', '2025-08-28 11:04:20', '2025-08-28 11:04:20', NULL),
(14, 'Vendedor Marcos', 'marcos.vendedor@email.com', 'senha123', 'vendedor', '2025-08-28 11:04:20', '2025-08-28 11:04:20', NULL),
(15, 'Vendedor Camila', 'camila.vendedora@email.com', 'senha123', 'vendedor', '2025-08-28 11:04:20', '2025-08-28 11:04:20', NULL),
(16, 'Administrador Regional', 'regional.admin@email.com', 'senha123', 'admin', '2025-08-28 11:04:20', '2025-08-28 11:04:20', NULL),
(17, 'Administrador Nacional', 'nacional.admin@email.com', 'senha123', 'admin', '2025-08-28 11:04:20', '2025-08-28 11:04:20', NULL),
(18, 'Vendedor Felipe', 'felipe.vendedor@email.com', 'senha123', 'vendedor', '2025-08-28 11:04:20', '2025-08-28 11:04:20', NULL),
(19, 'Vendedor Larissa', 'larissa.vendedora@email.com', 'senha123', 'vendedor', '2025-08-28 11:04:20', '2025-08-28 11:04:20', NULL),
(20, 'Administrador Sistema', 'sistema.admin@email.com', 'senha123', 'admin', '2025-08-28 11:04:20', '2025-08-28 11:04:20', NULL);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `tbl_avaliacoes`
--
ALTER TABLE `tbl_avaliacoes`
  ADD PRIMARY KEY (`id_avaliacoes`),
  ADD KEY `id_produto` (`id_produto`),
  ADD KEY `id_cliente` (`id_cliente`);

--
-- Índices de tabela `tbl_carrinho`
--
ALTER TABLE `tbl_carrinho`
  ADD PRIMARY KEY (`id_carrinho`),
  ADD KEY `id_cliente` (`id_cliente`);

--
-- Índices de tabela `tbl_categorias`
--
ALTER TABLE `tbl_categorias`
  ADD PRIMARY KEY (`id_categorias`);

--
-- Índices de tabela `tbl_clientes`
--
ALTER TABLE `tbl_clientes`
  ADD PRIMARY KEY (`id_cliente`),
  ADD UNIQUE KEY `email_clientes` (`email_clientes`);

--
-- Índices de tabela `tbl_cores`
--
ALTER TABLE `tbl_cores`
  ADD PRIMARY KEY (`id_cores`),
  ADD KEY `fk_cor_produto` (`id_produto`);

--
-- Índices de tabela `tbl_estoque_movimentacao`
--
ALTER TABLE `tbl_estoque_movimentacao`
  ADD PRIMARY KEY (`id_estoque_movimentacao`),
  ADD KEY `fk_estoque_produto` (`id_produto`);

--
-- Índices de tabela `tbl_imagem`
--
ALTER TABLE `tbl_imagem`
  ADD PRIMARY KEY (`id_imagem`),
  ADD KEY `id_produto` (`id_produto`),
  ADD KEY `id_cor` (`id_cor`),
  ADD KEY `id_tamanho` (`id_tamanho`);

--
-- Índices de tabela `tbl_itens_pedidos`
--
ALTER TABLE `tbl_itens_pedidos`
  ADD PRIMARY KEY (`id_itens_pedidos`),
  ADD KEY `id_pedido` (`id_pedido`),
  ADD KEY `id_produto` (`id_produto`);

--
-- Índices de tabela `tbl_pedidos`
--
ALTER TABLE `tbl_pedidos`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `id_cliente` (`id_cliente`);

--
-- Índices de tabela `tbl_produtos`
--
ALTER TABLE `tbl_produtos`
  ADD PRIMARY KEY (`id_produto`),
  ADD KEY `fk_produto_categoria` (`id_categoria`);

--
-- Índices de tabela `tbl_tamanhos`
--
ALTER TABLE `tbl_tamanhos`
  ADD PRIMARY KEY (`id_tamanhos`),
  ADD KEY `fk_tamanho_produto` (`id_produto`);

--
-- Índices de tabela `tbl_usuarios`
--
ALTER TABLE `tbl_usuarios`
  ADD PRIMARY KEY (`id_usuarios`),
  ADD UNIQUE KEY `email_usuarios` (`email_usuarios`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `tbl_avaliacoes`
--
ALTER TABLE `tbl_avaliacoes`
  MODIFY `id_avaliacoes` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de tabela `tbl_carrinho`
--
ALTER TABLE `tbl_carrinho`
  MODIFY `id_carrinho` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de tabela `tbl_categorias`
--
ALTER TABLE `tbl_categorias`
  MODIFY `id_categorias` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT de tabela `tbl_clientes`
--
ALTER TABLE `tbl_clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de tabela `tbl_cores`
--
ALTER TABLE `tbl_cores`
  MODIFY `id_cores` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de tabela `tbl_estoque_movimentacao`
--
ALTER TABLE `tbl_estoque_movimentacao`
  MODIFY `id_estoque_movimentacao` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de tabela `tbl_imagem`
--
ALTER TABLE `tbl_imagem`
  MODIFY `id_imagem` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de tabela `tbl_itens_pedidos`
--
ALTER TABLE `tbl_itens_pedidos`
  MODIFY `id_itens_pedidos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de tabela `tbl_pedidos`
--
ALTER TABLE `tbl_pedidos`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT de tabela `tbl_produtos`
--
ALTER TABLE `tbl_produtos`
  MODIFY `id_produto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de tabela `tbl_tamanhos`
--
ALTER TABLE `tbl_tamanhos`
  MODIFY `id_tamanhos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de tabela `tbl_usuarios`
--
ALTER TABLE `tbl_usuarios`
  MODIFY `id_usuarios` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `tbl_avaliacoes`
--
ALTER TABLE `tbl_avaliacoes`
  ADD CONSTRAINT `tbl_avaliacoes_ibfk_1` FOREIGN KEY (`id_produto`) REFERENCES `tbl_produtos` (`id_produto`),
  ADD CONSTRAINT `tbl_avaliacoes_ibfk_2` FOREIGN KEY (`id_cliente`) REFERENCES `tbl_clientes` (`id_cliente`);

--
-- Restrições para tabelas `tbl_carrinho`
--
ALTER TABLE `tbl_carrinho`
  ADD CONSTRAINT `tbl_carrinho_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `tbl_clientes` (`id_cliente`);

--
-- Restrições para tabelas `tbl_cores`
--
ALTER TABLE `tbl_cores`
  ADD CONSTRAINT `fk_cor_produto` FOREIGN KEY (`id_produto`) REFERENCES `tbl_produtos` (`id_produto`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `tbl_estoque_movimentacao`
--
ALTER TABLE `tbl_estoque_movimentacao`
  ADD CONSTRAINT `fk_estoque_produto` FOREIGN KEY (`id_produto`) REFERENCES `tbl_produtos` (`id_produto`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `tbl_imagem`
--
ALTER TABLE `tbl_imagem`
  ADD CONSTRAINT `tbl_imagem_ibfk_1` FOREIGN KEY (`id_produto`) REFERENCES `tbl_produtos` (`id_produto`),
  ADD CONSTRAINT `tbl_imagem_ibfk_2` FOREIGN KEY (`id_cor`) REFERENCES `tbl_cores` (`id_cores`),
  ADD CONSTRAINT `tbl_imagem_ibfk_3` FOREIGN KEY (`id_tamanho`) REFERENCES `tbl_tamanhos` (`id_tamanhos`);

--
-- Restrições para tabelas `tbl_pedidos`
--
ALTER TABLE `tbl_pedidos`
  ADD CONSTRAINT `tbl_pedidos_ibfk_2` FOREIGN KEY (`id_cliente`) REFERENCES `tbl_clientes` (`id_cliente`);

--
-- Restrições para tabelas `tbl_produtos`
--
ALTER TABLE `tbl_produtos`
  ADD CONSTRAINT `fk_produto_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `tbl_categorias` (`id_categorias`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_produtos_categorias` FOREIGN KEY (`id_categoria`) REFERENCES `tbl_categorias` (`id_categorias`);

--
-- Restrições para tabelas `tbl_tamanhos`
--
ALTER TABLE `tbl_tamanhos`
  ADD CONSTRAINT `fk_tamanho_produto` FOREIGN KEY (`id_produto`) REFERENCES `tbl_produtos` (`id_produto`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
