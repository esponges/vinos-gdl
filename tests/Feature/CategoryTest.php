<?php

namespace Tests\Feature;

use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CategoryTest extends TestCase
{
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

    public function test_products_by_category_are_shown()
    {
        $this->withoutExceptionHandling();

        $response = $this->get('categories');
        $response->assertOk();


        $categories = Category::all();
        $categoriesProducts = [];

        for ($i=0; $i < sizeOf($categories); $i++) {
            array_push($categoriesProducts, [$categories[$i]->name => $categories[$i]->products]);
        }

        $this->assertEquals(json_encode($response->original), json_encode($categoriesProducts));
    }

    public function test_category_is_shown()
    {
        $this->withoutExceptionHandling();

        $category = Category::first();

        $response = $this->get('categories/' . $category->name);

        $response->assertOk();

        $response->assertJson($category->products->toArray());
    }
}
