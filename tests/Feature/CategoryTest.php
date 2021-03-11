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

    public function test_products_by_all_categories_are_shown()
    {
        $this->withoutExceptionHandling();

        $response = $this->get('categories');
        $response->assertOk();

        $categories = Category::orderBy('score', 'desc')->get();
        $categoriesProducts = [];

        for ($i = 0; $i < sizeOf($categories); $i++) {

            $category = $categories[$i];
            $productsFromCategory = $category
                ->products()
                ->orderBy('score', 'desc')
                ->get(); // call relationship

            array_push($categoriesProducts, array(
                'id' => $category->id,
                'category_name' => $category->name,
                'products' => $productsFromCategory->toArray()
            ));
        }

        $this->assertEquals(json_encode($response->original), json_encode($categoriesProducts));
    }

    public function test_single_category_displayed()
    {
        $this->withoutExceptionHandling();
        $categoryName = Category::find(2);

        $response = $this->get(route('categories.show', $categoryName->name));

        // $response->dump();

        $response->assertOk();
    }

    public function test_category_is_shown()
    {
        $this->withoutExceptionHandling();

        $category = Category::first();

        $response = $this->get('categories/' . $category->name);

        $response->assertOk();

        $response->assertJson($category->products->toArray());
    }

    public function test_getCategoryNames()
    {
        $this->withoutExceptionHandling();
        $categories = Category::all()->pluck('name')->toArray();

        $response = $this->get(route('category.names'));

        $response->assertOk();
        $response->assertJson($categories);
    }
}
