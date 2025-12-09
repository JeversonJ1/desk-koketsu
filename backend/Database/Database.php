<?php
namespace App\Koketsu\Database;
use PDO;
use PDOException;
use Exception;
// O projeto pode não ter uma classe Config carregável em todos os ambientes.
// Vamos tentar usar Config::get() se disponível, caso contrário aplicar um fallback por variáveis de ambiente
// e um arquivo sqlite local em backend/storage/database.sqlite.

class Database {
    private static $instance = null;
    private $conn;
    private $config;

    private function __construct() {
        $driver = 'sqlite';
        $dbConfig = [];

        // Tenta usar Config::get() se a função estiver disponível
        if (class_exists('\App\Koketsu\Database\Config') && method_exists('\App\Koketsu\Database\Config', 'get')) {
            try {
                $this->config = \App\Koketsu\Database\Config::get();
                $dbConfig = $this->config['database'] ?? [];
                $driver = $dbConfig['driver'] ?? 'sqlite';
            } catch (Exception $e) {
                // fallback silencioso
            }
        } else {
            // fallback para variáveis de ambiente
            $driver = getenv('DB_DRIVER') ?: 'sqlite';
            $dbConfig['sqlite'] = [
                'path' => getenv('DB_SQLITE_PATH') ?: __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'database.sqlite'
            ];
        }

        try {
            switch ($driver) {
                case 'mysql':
                    $mysqlConfig = $dbConfig['mysql'];
                    $dsn = "mysql:host={$mysqlConfig['host']};dbname={$mysqlConfig['db_name']};charset={$mysqlConfig['charset']}";
                    $this->conn = new PDO($dsn, $mysqlConfig['username'], $mysqlConfig['password'], [PDO::ATTR_PERSISTENT => true]);
                    break;
                case 'sqlite':
                    $sqliteConfig = $dbConfig['sqlite'];
                    $dsn = "sqlite:{$sqliteConfig['path']}";
                    $this->conn = new PDO($dsn, null, null, [PDO::ATTR_PERSISTENT => true]);
                    break;
                case 'sqlsrv':
                    $sqlsrvConfig = $dbConfig['sqlsrv'];
                    $dsn = "sqlsrv:Server={$sqlsrvConfig['host']};Database={$sqlsrvConfig['db_name']}";
                    $this->conn = new PDO($dsn, $sqlsrvConfig['username'], $sqlsrvConfig['password'], [PDO::ATTR_PERSISTENT => true]);
                    break;
                case 'pgsql':
                    $pgsqlConfig = $dbConfig['pgsql'];
                    $dsn = "pgsql:host={$pgsqlConfig['host']};port={$pgsqlConfig['port']};dbname={$pgsqlConfig['db_name']};user={$pgsqlConfig['username']};password={$pgsqlConfig['password']}";
                    $this->conn = new PDO($dsn);
                    break;
            }

            if (in_array($driver, ['mysql', 'sqlite', 'sqlsrv', 'pgsql'])) {
                $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            }
        } catch(PDOException $exception) {
            echo "Erro de conexão: " . $exception->getMessage();
        } catch(Exception $exception) {
            echo "Erro de conexão : " . $exception->getMessage();
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance->conn;
    }

    public static function destroyInstance(){
        self::$instance = null;
    }

}