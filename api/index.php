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
$app->get('/exercise/{id}', function (Request $request, Response $response, $args) {
    $id = $args['id'];
    return $response->withJson(json_decode('{ "id" : "'.$id.'" }'));
});

$app->put('/exercise', function (Request $request, Response $response, $args) {
    $body = $request->getBody();
    return $response->withJson(json_decode($body));
});

$app->run();
?>
