<?php
namespace Exercir\Storage;

use Psr\Container\ContainerInterface;
use SleekDB\SleekDB as DB;

class Storage {

  protected $container;

  public function __construct(ContainerInterface $container) {
    $this->container = $container;
    // ENV
    $dotenv = Dotenv\Dotenv::create(__DIR__ .'/../');
    $dotenv->load();
  }

  public function save($request, $response, $args) {
    $store = self::prepare();
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
  }

  public function load($request, $response, $args) {
    $id = $args['id'];
    $data = self::collect($id);

    if (!empty($data)){
      $newResponse = $response->withJson(json_decode($data));
    }
    else {
      $newResponse = $response->withStatus(404);
    }
    return $newResponse;
  }

  private static function collect($id){
    $store = self::prepare();
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

  private static function prepare(){
    $name = \getenv('PERSISTENCE_NAME');
    $path = \getenv('PERSISTENCE_DIR');
    $store = DB::store($name, $path);
    return $store;
  }
}
?>
