<?php
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\App as Slim;
use SleekDB\SleekDB as DB;

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
$app->put('/exercise[/{id}]', function (Request $request, Response $response, $args) {
    $store = prepare();
    $body = $request->getBody();
    $data = json_decode($body);

    if (\array_key_exists('id', $args)){
      $id = $args['id'];
      $exc = $store->where('uuid','=',$id)->fetch();
      if (\count($exc)>0){
        $store->where('uuid','=',$id)->update($data);
      }
    }
    else {
      $exc = $store->insert($data);
    }

    return $response->withJson(json_decode($exc));
});

$app->run();

function prepare(){
    $name = \getenv('PERSISTENCE_NAME');
    $path = \getenv('PERSISTENCE_DIR');
    $store = DB::store($name, $path);
    return $store;
  }
?>
