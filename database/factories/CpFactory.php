<?php

namespace Database\Factories;

use App\Models\Cp;
use Faker\Factory as FakerFactory;
use Illuminate\Database\Eloquent\Factories\Factory;

class CpFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Cp::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'cp' => FakerFactory::create()->numberBetween(22, 25) . FakerFactory::create()->numberBetween(100, 999),
            'name' => FakerFactory::create()->city(),
            'state' => FakerFactory::create()->state(),
        ];
    }
}
