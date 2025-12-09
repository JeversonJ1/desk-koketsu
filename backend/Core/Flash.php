<?php
namespace App\Koketsu\Core;
class Flash
 {
    public static function set($type = 'success', $message) {
        if (!isset($_SESSION)) {
            session_start();
        }
        $_SESSION['flash'] = [
            'message' => $message,
            'type' => $type
        ];
      
    }

    public static function get() {
        if (!isset($_SESSION)) {
            session_start();
        }
        if (isset($_SESSION['flash'])) {
            $flash = $_SESSION['flash'];
            unset($_SESSION['flash']);
            return $flash;
        }
        return null;
    }
    }
