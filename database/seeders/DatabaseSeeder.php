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
            [
                'description' => Factory::create()->sentence(3),
                'discount' => 0.10,
            ], [
                'description' => Factory::create()->sentence(3),
                'discount' => 0.15,
            ], [
                'description' => Factory::create()->sentence(3),
                'discount' => 0.05,
            ]
        ]);


        Vap::factory(10)->create();



        DB::table('products')->insert([
            [
                'name' => "Don Julio 70 700ml",
                'description' => Factory::create()->sentence(12),
                'price' => Factory::create()->numberBetween(400, 700),
                'img' => '1.jpg',
                'category_id' => 1,
            ],
            [
                'name' => "Don Julio Blanco 700ml",
                'description' => Factory::create()->sentence(12),
                'price' => Factory::create()->numberBetween(400, 700),
                'img' => '2.jpg',
                'category_id' => 1,
            ],
            [
                'name' => "Don Julio Reposado 700ml",
                'description' => Factory::create()->sentence(12),
                'price' => Factory::create()->numberBetween(400, 700),
                'img' => '3.jpg',
                'category_id' => 1,
            ],
            [
                'name' => "Maestro Dobel 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => Factory::create()->numberBetween(400, 700),
                'img' => '4.jpg',
                'category_id' => 1,
            ],
            [
                'name' => "Tradicional Reposado 695ml",
                'description' => Factory::create()->sentence(12),
                'price' => Factory::create()->numberBetween(400, 700),
                'img' => '5.jpg',
                'category_id' => 1,
            ],
            [
                'name' => "Centenario Reposado 950 700ml",
                'description' => Factory::create()->sentence(12),
                'price' => Factory::create()->numberBetween(400, 700),
                'img' => '6.jpg',
                'category_id' => 1,
            ],
            [
                'name' => "Herradura Reposado 700ml",
                'description' => Factory::create()->sentence(12),
                'price' => Factory::create()->numberBetween(400, 700),
                'img' => '7.jpg',
                'category_id' => 1,
            ],
            [
                'name' => "Herradura Ultra 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => Factory::create()->numberBetween(400, 700),
                'img' => '8.jpg',
                'category_id' => 1,
            ],
            [
                'name' => "Chivas 12YO 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => Factory::create()->numberBetween(400, 700),
                'img' => '9.jpg',
                'category_id' => 2,
            ],
            [
                'name' => "Passport 700ml",
                'description' => Factory::create()->sentence(12),
                'price' => Factory::create()->numberBetween(400, 700),
                'img' => '10.jpg',
                'category_id' => 2,
            ],
            [
                'name' => "Black & White 700ml",
                'description' => Factory::create()->sentence(12),
                'price' => Factory::create()->numberBetween(400, 700),
                'img' => '11.jpg',
                'category_id' => 2,
            ],
            [
                'name' => "William Lawsons 700ml",
                'description' => Factory::create()->sentence(12),
                'price' => Factory::create()->numberBetween(400, 700),
                'img' => '12.jpg',
                'category_id' => 2,
            ],
            [
                'name' => "Ballantines Finest 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => Factory::create()->numberBetween(400, 700),
                'img' => '13.jpg',
                'category_id' => 2,
            ],
            [
                'name' => "Etiqueta Negra 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => Factory::create()->numberBetween(400, 700),
                'img' => '14.jpg',
                'category_id' => 2,
            ],
            [
                'name' => "Etiqueta Roja 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => Factory::create()->numberBetween(400, 700),
                'img' => '15.jpg',
                'category_id' => 2,
            ],
            [
                'name' => "Buchanan's 12YO 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => Factory::create()->numberBetween(400, 700),
                'img' => '16.jpg',
                'category_id' => 2,
            ],
            [
                'name' => "Smirnoff Tamarindo 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => Factory::create()->numberBetween(400, 700),
                'img' => '17.jpg',
                'category_id' => 3,
            ],
            [
                'name' => "Stolichnaya 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => Factory::create()->numberBetween(400, 700),
                'img' => '18.jpg',
                'category_id' => 3,
            ],
            [
                'name' => "Absolut Pera 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => Factory::create()->numberBetween(400, 700),
                'img' => '19.jpg',
                'category_id' => 3,
            ],
            [
                'name' => "Absolut Azul 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => Factory::create()->numberBetween(400, 700),
                'img' => '20.jpg',
                'category_id' => 3,
            ],
            [
                'name' => "Absolut Raspberry 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => Factory::create()->numberBetween(400, 700),
                'img' => '21.jpg',
                'category_id' => 3,
            ],
            [
                'name' => "Grey Goose 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => Factory::create()->numberBetween(400, 700),
                'img' => '22.jpg',
                'category_id' => 3,
            ],
            [
                'name' => "Beefeater 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => Factory::create()->numberBetween(400, 700),
                'img' => '23.jpg',
                'category_id' => 4,
            ],
            [
                'name' => "Tanqueray 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => Factory::create()->numberBetween(400, 700),
                'img' => '24.jpg',
                'category_id' => 4,
            ],
            [
                'name' => "Hendricks 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => Factory::create()->numberBetween(400, 700),
                'img' => '25.jpg',
                'category_id' => 4,
            ],
            [
                'name' => "Bombay Shappire 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => Factory::create()->numberBetween(400, 700),
                'img' => '26.jpg',
                'category_id' => 4,
            ],
            [
                'name' => "Beefeater Pink 700ml",
                'description' => Factory::create()->sentence(12),
                'price' => Factory::create()->numberBetween(400, 700),
                'img' => '27.jpg',
                'category_id' => 4,
            ],
        ]);
        User::factory()->create();
    }
}
