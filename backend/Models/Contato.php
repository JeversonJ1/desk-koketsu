<?php
namespace App\Koketsu\Models;

use PDO;
use PDOException; 

class Contato 
{
    private $id_contato;
    private $email_contato;
    private $criado_em;
    private $atualizado_em;
    private $excluido_em;
    private $db;

     public function __construct($db) {
    $this->db = $db;
    }

    public function buscarContatoPorEmail(string $email)
{ 
    try {
        $sql = "SELECT * FROM tbl_contato WHERE email_contato = :email AND excluido_em IS NULL";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        return $resultado ?: false;

    } catch (PDOException $e) {
       
        return false; 
    }
}

    
    public function inserirNovoContato(string $email)
{
    try {
        $sql = "INSERT INTO tbl_contato (email_contato) VALUES (:email)";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':email', $email);

        if($stmt->execute()){
            return $this->db->lastInsertId();
        } else {
            
            return false;
        }
    } catch (PDOException $e) {
       
        echo "ERRO FATAL NA INSERÇÃO: " . $e->getMessage();
        die(); 
    }
    
}
    public function desativarContato(int $id): bool
    {
        $agora = date("Y-m-d H:i:s");
        $sql = "UPDATE tbl_contato SET excluido_em = :excluido_em WHERE id_contato = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':excluido_em', $agora);
        return $stmt->execute();
    }
    
    public function reativarContato(int $id): bool
    {
        $coluna = NULL;
        $sql = "UPDATE tbl_contato SET excluido_em = :excluido_em WHERE id_contato = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':excluido_em', $coluna, PDO::PARAM_NULL);
        
        return $stmt->execute();
    }
}