<?php
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\App as Slim;

require __DIR__ . '/../vendor/autoload.php';

// ENV
$dotenv = Dotenv\Dotenv::create(__DIR__);
$dotenv->load();

// Slim
$app = new Slim;

// Basic Auth
$app->add(new Tuupola\Middleware\HttpBasicAuthentication([
    "secure" => true,
    "users" => [
        getenv('API_USER') => getenv('API_PASSWORD')
    ]
]));

// Add routes
$app->put('/exercise/{id}', Storage::class . ':save');

$app->get('/exercise/{id}', Storage::class . ':load');

$app->run();
?>
