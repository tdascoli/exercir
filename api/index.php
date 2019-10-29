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
    $data = collect($id);

    if (!empty($data)){
      $newResponse = $response->withJson(json_decode($data));
    }
    else {
      $newResponse = $response->withStatus(404);
    }
    return $newResponse;
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
      // else 404 oder insert??
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
function collect($id){
  $store = prepare();
  $data = $store->where('uuid','=',$id)->fetch();
  // TODO: what about more than one result??
  if (count($data)==0){
    return NULL;
  }
  return \json_encode($data[0]['form'], JSON_PRETTY_PRINT);
}
?>
