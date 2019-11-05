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
    $data = json_decode($body, JSON_PRETTY_PRINT);

    if (\array_key_exists('id', $args)){
      $id = $args['id'];
      $exc = $store->where('_id','=',$id)->fetch();
      if (\count($exc)>0){
        $store->where('_id','=',$id)->update($data);
      }
      else{
        return $response->withStatus(404);
      }
    }
    else {
      $exc = $store->insert($data);
    }

    return $response->withJson(json_encode($exc, JSON_PRETTY_PRINT));
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
  $whereId = "uuid";
  if (is_numeric($id)){
    $whereId = "_id";
  }
  $data = $store->where($whereId,'=',$id)->fetch();
  if (count($data)==0){
    return NULL;
  }
  else if (count($data)==1){
    return \json_encode($data[0], JSON_PRETTY_PRINT);
  }
  return \json_encode($data, JSON_PRETTY_PRINT);
}
?>
