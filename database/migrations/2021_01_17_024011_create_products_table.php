<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->string('description');
            $table->integer('capacity')->default(750);
            $table->integer('price');
            $table->boolean('featured')->default(true);
            $table->string('img')->nullable();

            $table->foreignId('vap_id')->nullable()->constrained('vaps');
            $table->foreignId('category_id')->nullable()->constrained('categories');
            $table->foreignId('discount_id')->nullable()->constrained('discounts');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
}
