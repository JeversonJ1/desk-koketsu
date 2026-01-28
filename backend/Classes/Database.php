<?php

namespace App\Koketsu\Classes;

use PDO;
use Exception;

class Database
{
    private static $instance;
    private $pdo;
    private $host;
    private $user;
    private $password;
    private $database;
    private $port = 3306;

    private function __construct()
    {
        // Carrega credenciais (pode ser de .env ou config)
        $this->host = $_ENV['DB_HOST'] ?? 'localhost';
        $this->user = $_ENV['DB_USER'] ?? 'root';
        $this->password = $_ENV['DB_PASSWORD'] ?? '';
        $this->database = $_ENV['DB_NAME'] ?? 'koketsu';
        $this->port = $_ENV['DB_PORT'] ?? 3306;

        $this->conectar();
    }

    private function conectar()
    {
        try {
            $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->database};charset=utf8mb4";
            
            $this->pdo = new PDO(
                $dsn,
                $this->user,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );
        } catch (Exception $e) {
            die('Erro ao conectar ao banco de dados: ' . $e->getMessage());
        }
    }

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function conexao()
    {
        return $this->pdo;
    }

    public function prepare($sql)
    {
        return $this->pdo->prepare($sql);
    }

    public function execute($stmt, $params = [])
    {
        return $stmt->execute($params);
    }

    public function query($sql)
    {
        return $this->pdo->query($sql);
    }

    public function lastInsertId()
    {
        return $this->pdo->lastInsertId();
    }

    public function beginTransaction()
    {
        return $this->pdo->beginTransaction();
    }

    public function commit()
    {
        return $this->pdo->commit();
    }

    public function rollBack()
    {
        return $this->pdo->rollBack();
    }

    // Testes de conexão
    public function testar()
    {
        try {
            $stmt = $this->pdo->prepare('SELECT 1');
            $stmt->execute();
            return ['status' => 'sucesso', 'mensagem' => 'Conectado ao banco de dados com sucesso!'];
        } catch (Exception $e) {
            return ['status' => 'erro', 'mensagem' => $e->getMessage()];
        }
    }
}
