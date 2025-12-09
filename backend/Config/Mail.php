<?php
namespace App\Koketsu\Config;

class Mail{
    public static function get(){
        return [
            'host' => 'smtp.gmail.com',
            'port' => 587,
            'username'=> 'gregory.lvgg1212@gmail.com',
            'password'=> 'zsvq hnsu tvey vssi',
            'encryption'=> 'tls',
            'from_address'=> 'noreply@Koketsu.com',
            'from_name'=> 'Koketsu',
            
        ];
    }
}