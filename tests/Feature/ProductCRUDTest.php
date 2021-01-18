<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Product;
use Faker\Factory;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProductCRUDTest extends TestCase
{
    // use RefreshDatabase;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_example()
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_get_all_products()
    {
        $this->withoutExceptionHandling();

        $response = $this->get('/products');

        $response->assertOk();

        $products = Product::all()->toArray();

        // dd ($products);

        $response->assertJson($products);
    }

    public function test_single_product()
    {
        $this->withoutExceptionHandling();

        $product = Product::first();

        $response = $this->get('products/' . $product->id);
        $response->assertStatus(200);

        $response->assertJson($product->toArray());
    }

    public function test_store_product()
    {
        $this->withoutExceptionHandling();

        $product = [
            'name' => Factory::create()->sentence(2),
            'price' => Factory::create()->numberBetween(400, 700),
            'category_id' => Factory::create()->numberBetween(1, 4),
        ];

        $response = $this->post('/products', [
            'name' => $product['name'],
            'price' => $product['price'],
            'category_id' => $product['category_id']
        ]);

        $response->assertOk();

        // $response->dumpHeaders();

        // $response->dumpSession();

        // $response->dump();

        $response->assertJsonFragment($product);
    }
}
