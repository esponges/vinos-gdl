<?php

namespace Database\Seeders;

use Faker\Factory;
use App\Models\Vap;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();
        DB::table('categories')->insert([
            [
                'name' => 'Tequila'
            ], [
                'name' => 'Whisky'
            ], [
                'name' => 'Vodka'
            ], [
                'name' => 'Gin'
            ]
        ]);
        DB::table('discounts')->insert([
            'description' => Factory::create()->sentence(4)
        ]);
        Vap::factory(10)->create();
        Product::factory(50)->create();
        User::factory()->create();
    }
}
