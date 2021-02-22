<?php

namespace Database\Seeders;

use Faker\Factory;
use App\Models\Vap;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use App\Models\Cp;
use App\Models\ProductLinks;
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

        $categoryNames = ['Tequila', 'Whisky', 'Vodka', 'Gin'];
        foreach ($categoryNames as $categoryName ) {
            DB::table('categories')->insert(['name' => $categoryName]);
        }

        $discounts = [0.10, 0.15, 0.05, 0.20];
        foreach ($discounts as $disc ) {
            DB::table('discounts')->insert([
            'description' => Factory::create()->sentence(),
            'discount' => $disc
            ]);
        }

        Vap::factory(10)->create();

        DB::table('products')->insert([
            [
                'name' => "Don Julio 70 700ml",
                'description' => Factory::create()->sentence(12),
                'price' => 1.05*650,
                'img' => '1.jpg',
                'category_id' => 1,
            ],
            [
                'name' => "Don Julio Blanco 700ml",
                'description' => Factory::create()->sentence(12),
                'price' => 1.05*440,
                'img' => '2.jpg',
                'category_id' => 1,
            ],
            [
                'name' => "Don Julio Reposado 700ml",
                'description' => Factory::create()->sentence(12),
                'price' => 1.05*510,
                'img' => '3.jpg',
                'category_id' => 1,
            ],
            [
                'name' => "Maestro Dobel 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => 1.05*530,
                'img' => '4.jpg',
                'category_id' => 1,
            ],
            [
                'name' => "Tradicional Reposado 695ml",
                'description' => Factory::create()->sentence(12),
                'price' => 1.05*235,
                'img' => '5.jpg',
                'category_id' => 1,
            ],
            [
                'name' => "Centenario Reposado 950 700ml",
                'description' => Factory::create()->sentence(12),
                'price' => 1.05*230,
                'img' => '6.jpg',
                'category_id' => 1,
            ],
            [
                'name' => "Herradura Reposado 700ml",
                'description' => Factory::create()->sentence(12),
                'price' => 1.05*280,
                'img' => '7.jpg',
                'category_id' => 1,
            ],
            [
                'name' => "Herradura Ultra 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => 1.05*510,
                'img' => '8.jpg',
                'category_id' => 1,
            ],
            [
                'name' => "Chivas 12YO 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => 1.05*440,
                'img' => '9.jpg',
                'category_id' => 2,
            ],
            [
                'name' => "Passport 700ml",
                'description' => Factory::create()->sentence(12),
                'price' => 1.05*110,
                'img' => '10.jpg',
                'category_id' => 2,
            ],
            [
                'name' => "Black & White 700ml",
                'description' => Factory::create()->sentence(12),
                'price' => 1.05*150,
                'img' => '11.jpg',
                'category_id' => 2,
            ],
            [
                'name' => "William Lawsons 700ml",
                'description' => Factory::create()->sentence(12),
                'price' => 1.05*130,
                'img' => '12.jpg',
                'category_id' => 2,
            ],
            [
                'name' => "Ballantines Finest 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => 1.05*170,
                'img' => '13.jpg',
                'category_id' => 2,
            ],
            [
                'name' => "Etiqueta Negra 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => 1.05*540,
                'img' => '14.jpg',
                'category_id' => 2,
            ],
            [
                'name' => "Etiqueta Roja 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => 1.05*240,
                'img' => '15.jpg',
                'category_id' => 2,
            ],
            [
                'name' => "Buchanan's 12YO 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => 1.05*525,
                'img' => '16.jpg',
                'category_id' => 2,
            ],
            [
                'name' => "Smirnoff Tamarindo 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => 1.05*190,
                'img' => '17.jpg',
                'category_id' => 3,
            ],
            [
                'name' => "Stolichnaya 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => 1.05*205,
                'img' => '18.jpg',
                'category_id' => 3,
            ],
            [
                'name' => "Absolut Pera 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => 1.05*190,
                'img' => '19.jpg',
                'category_id' => 3,
            ],
            [
                'name' => "Absolut Azul 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => 1.05*180,
                'img' => '20.jpg',
                'category_id' => 3,
            ],
            [
                'name' => "Absolut Raspberry 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => 1.05*190,
                'img' => '21.jpg',
                'category_id' => 3,
            ],
            [
                'name' => "Grey Goose 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => 1.05*470,
                'img' => '22.jpg',
                'category_id' => 3,
            ],
            [
                'name' => "Beefeater 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => 1.05*330,
                'img' => '23.jpg',
                'category_id' => 4,
            ],
            [
                'name' => "Tanqueray 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => 1.05*360,
                'img' => '24.jpg',
                'category_id' => 4,
            ],
            [
                'name' => "Hendricks 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => 1.05*615,
                'img' => '25.jpg',
                'category_id' => 4,
            ],
            [
                'name' => "Bombay Shappire 750ml",
                'description' => Factory::create()->sentence(12),
                'price' => 1.05*350,
                'img' => '26.jpg',
                'category_id' => 4,
            ],
            [
                'name' => "Beefeater Pink 700ml",
                'description' => Factory::create()->sentence(12),
                'price' => 1.05*430,
                'img' => '27.jpg',
                'category_id' => 4,
            ],
        ]);

        User::factory()->create();

        DB::table('product_links')->insert([
            [
                'product_id' => 1,
                'link' => "https://www.superama.com.mx/catalogo/d-vinos-y-licores/f-aperitivos/l-tequila/tequila-don-julio-70-anejo-cristalino-700-ml/0500028105626",
                'provider' => 'Superama',
                'price' => 854,
            ],
            [
                'product_id' => 1,
                'link' => "https://www.consuvino.com.mx/product-page/don-julio-70-cristalino-700ml",
                'provider' => 'Consuvino',
                'price' => 819,
            ],
            [
                'product_id' => 2,
                'link' => "https://www.superama.com.mx/catalogo/d-vinos-y-licores/f-aperitivos/l-tequila/tequila-don-julio-blanco-700-ml/0500028105627",
                'provider' => 'Superama',
                'price' => 524,
            ],
            [
                'product_id' => 2,
                'link' => "https://www.consuvino.com.mx/product-page/don-julio-blanco-700ml",
                'provider' => 'Consuvino',
                'price' => 517,
            ],
            [
                'product_id' => 5,
                'link' => "https://www.superama.com.mx/catalogo/d-vinos-y-licores/f-aperitivos/l-tequila/tequila-jose-cuervo-tradicional-reposado-695-ml/0750103501202",
                'provider' => 'Superama',
                'price' => 304,
            ],
            [
                'product_id' => 5,
                'link' => "https://www.consuvino.com.mx/product-page/bf-tequila-tradicional-reposado-950ml",
                'provider' => 'Consuvino',
                'price' =>  279,
            ],
            [
                'product_id' => 6,
                'link' => "https://www.superama.com.mx/catalogo/d-vinos-y-licores/f-aperitivos/l-tequila/tequila-gran-centenario-reposado-950-ml/0750104881001",
                'provider' => 'Superama',
                'price' => 314,
            ],
            [
                'product_id' => 6,
                'link' => "https://www.consuvino.com.mx/product-page/gran-centenario-reposado-950-ml",
                'provider' => 'Consuvino',
                'price' => 305,
            ],
            [
                'product_id' => 11,
                'link' => "https://www.superama.com.mx/catalogo/d-vinos-y-licores/f-aperitivos/l-whisky/whisky-black-white-escoces-700-ml/0000005019613",
                'provider' => 'Superama',
                'price' => 196,
            ],
            [
                'product_id' => 11,
                'link' => "https://www.consuvino.com.mx/product-page/whisky-black-white-700ml",
                'provider' => 'Consuvino',
                'price' => 195,
            ],
            [
                'product_id' => 16,
                'link' => "https://www.superama.com.mx/catalogo/d-vinos-y-licores/f-aperitivos/l-whisky/whisky-buchanan-s-de-luxe-12-anos-escoces-750-ml/0000005019638",
                'provider' => 'Superama',
                'price' => 750,
            ],
            [
                'product_id' => 16,
                'link' => "https://www.consuvino.com.mx/product-page/whisky-buchanans-12-a%C3%B1os-750ml",
                'provider' => 'Consuvino',
                'price' => 567,
            ],
            [
                'product_id' => 5,
                'link' => "https://www.superama.com.mx/catalogo/d-vinos-y-licores/f-aperitivos/l-tequila/tequila-maestro-dobel-diamante-700-ml/0750103504316",
                'provider' => 'Superama',
                'price' => 596,
            ],
            [
                'product_id' => 5,
                'link' => "https://www.consuvino.com.mx/product-page/tequila-maestro-dobel-diamante-750ml",
                'provider' => 'Consuvino',
                'price' => 660,
            ],
            [
                'product_id' => 10,
                'link' => "https://www.superama.com.mx/catalogo/d-vinos-y-licores/f-aperitivos/l-whisky/whisky-passport-scotch-escoces-700-ml/0008043240287",
                'provider' => 'Superama',
                'price' => 167,
            ],

        ]);

        Cp::factory(50)->create();
    }
}
