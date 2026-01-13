<?php

namespace App\Koketsu\Database;

class Config
{
    public static function get()
    {
        return [
            'database' => array (
  'driver' => 'mysql',
    'mysql' =>
  array (
    'host' => '127.0.0.1',
    'db_name' => 'koketsu',
    'username' => 'root',
    'password' => '',
    'charset' => 'utf8',
    'port' => '3306',
  ),
)
        ];

//         return [
//             'database' => array (
//   'driver' => 'mysql',
//   'mysql' =>
//   array (
//     'host' => '216.172.172.207',
//     'db_name' => 'faust537_time6_ti29',
//     'username' => 'faust537_time6_ti29',
//     'password' => 'zSXibN6l$.R}',
//     'charset' => 'utf8',
//     'port' => '3306',
//   ),
// )
//         ];
    }
}
