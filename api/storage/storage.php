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

    // todo error!!!
    $response->withStatus(404);
    return $response;
  }

  public function load($request, $response, $args) {
    $id = $args['id'];
    $data = $this->collect($id);

    if (!empty($data)){
      $newResponse = $response->withJson(json_decode($data));
    }
    else {
      $newResponse = $response->withStatus(404);
    }
    return $newResponse;
  }

  private function collect($id){
    $store = self::prepare();
    $data = $store->where('uuid','=',$id)->fetch();
    // TODO: what about more than one result??
    if (count($data)==0){
      return NULL;
    }
    return \json_encode($data[0]['form'], JSON_PRETTY_PRINT);
  }

  private static function prepare(){
    $name = \getenv('PERSISTENCE_NAME');
    $path = \getenv('PERSISTENCE_DIR');
    $store = DB::store($name, $path);
    return $store;
  }
}
?>
