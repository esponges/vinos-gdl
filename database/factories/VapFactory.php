<?php

namespace Database\Factories;

use App\Models\Vap;
use Illuminate\Database\Eloquent\Factories\Factory;

class VapFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Vap::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name,
        ];
    }
}
