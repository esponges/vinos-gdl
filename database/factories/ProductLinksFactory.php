<?php

namespace Database\Factories;

use App\Models\ProductLinks;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductLinksFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ProductLinks::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            [
                'product_id' => 1,
                'link' => "https://www.superama.com.mx/catalogo/d-vinos-y-licores/f-aperitivos/l-tequila/tequila-don-julio-70-anejo-cristalino-700-ml/0500028105626"
            ],
            [
                'product_id' => 1,
                'link' => "https://www.consuvino.com.mx/product-page/don-julio-70-cristalino-700ml"
            ]
        ];
    }
}
