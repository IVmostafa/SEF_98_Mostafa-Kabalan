<?php

use Illuminate\Database\Seeder;
use Instagram\User;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = factory(User::class, 10)->create();
    }
}
