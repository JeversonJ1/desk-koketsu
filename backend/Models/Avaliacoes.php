<?php

namespace App\Koketsu\Models;

use PDO;
use App\Koketsu\Database\Database;

class Avaliacaos
{
    private $db;
    
    // Suas propriedades de Avaliações
    public $id_avaliacao;
    public $nota_avaliacao;
    public $id_produto;

    public function __construct($db)
    {
        $this->db = $db;
    }

    /**
     * Conta a frequência de cada nota (de 1 a 5 estrelas) na tabela tbl_avaliacoes.
     * @return array Ex: [{'nota': 5, 'contagem': 120}, ...]
     */
    public function contarAvaliacoesPorNota()
    {
        // Usa a tabela e coluna identificadas na sua estrutura de banco
        $sql = "
            SELECT 
                nota_avaliacao AS nota, 
                COUNT(id_avaliacao) AS contagem
            FROM tbl_avaliacoes
            WHERE excluido_em IS NULL
            GROUP BY nota_avaliacao
            ORDER BY nota_avaliacao ASC
        ";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}