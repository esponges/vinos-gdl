<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class FrontEndHelpTest extends TestCase
{
    public function test_getDeliveryDays()
    {
        $this->withoutExceptionHandling();

        $response = $this->get('/api/delivery-days');

        $response->assertOk();
        $response->assertJsonFragment(['Próximo Lunes']);
    }
}
