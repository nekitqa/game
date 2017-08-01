<?php

	class Route{

		static function start($routesArray){

			$client_url = $_SERVER['REQUEST_URI'];
			$client_routes = explode('/', $_SERVER['REQUEST_URI']);
			$circleI = 0;
			foreach($_GET as $key => $value){
				
				if($circleI == 0){

					$_get = '?'.$key.'='.$value;

				}else{

					$_get .= '&'.$key.'='.$value;

				}

				$circleI++;

			};

			$client_url = str_ireplace($_get, '', $client_url);


			foreach($routesArray as $key => $value){

				$key = str_replace('/', '\/', $key);
				$key = '/'.$key.'/';
				preg_match_all($key,  $client_url, $out, PREG_SET_ORDER);

			};

			$andID = false;

			if(isset($out[0][0])){

				// echo 'norm;';


				if(array_key_exists($out[0][0], $routesArray) == true){

					$andID = true;

					$controller_name = $routesArray[$out[0][0]]['controller'];
					$model_name = 'Model_'.$routesArray[$out[0][0]]['model'];
			 		$action_name = $routesArray[$out[0][0]]['action'];


			 		$controller_name = 'Controller_'.$controller_name;
			 		$action_name = 'action_'.$action_name;
				 		

				 	$controller_file = strtolower($controller_name).'.php';
					include "core/controllers/".$controller_file;

			 		if($model_name != 'Model_'){

				 		$model_file = strtolower($model_name).'.php';

						include "core/models/".$model_file;

			 		};


			 		if(array_key_exists('id', $routesArray[$out[0][0]]) == true){

			 			$id = $routesArray[$out[0][0]]['id'];
						$controller = new $controller_name($client_routes[$id]);

			 		}else{

						$controller = new $controller_name;

			 		};

					$action = $action_name;
					
					if(method_exists($controller, $action)){

						$controller->$action();

					}else{

						Route::Page404();

					}

				}else{

					Route::Page404();

				}

			}


			if($andID != true){

				if(array_key_exists($client_url, $routesArray) == true){

					$controller_name = $routesArray[$client_url]['controller'];
					$model_name = 'Model_'.$routesArray[$client_url]['model'];
			 		$action_name = $routesArray[$client_url]['action'];

			 		$controller_name = 'Controller_'.$controller_name;
			 		$action_name = 'action_'.$action_name;
				 		

				 	$controller_file = strtolower($controller_name).'.php';
					include "core/controllers/".$controller_file;

			 		if($model_name != 'Model_'){

				 		$model_file = strtolower($model_name).'.php';

						include "core/models/".$model_file;

			 		};


			 		if(array_key_exists('id', $routesArray[$client_url]) == true){

			 			$id = $routesArray[$client_url]['id'];
						$controller = new $controller_name($id);

			 		};

					$controller = new $controller_name;
					$action = $action_name;
					
					if(method_exists($controller, $action)){

						$controller->$action();

					}else{

						Route::Page404();

					}

				}else{

					Route::Page404();

				}

			}

		}
			
		function Page404(){

	        $host = HOST.'/';
	        header('HTTP/1.1 404 Not Found');
			header("Status: 404 Not Found");
			header('Location:'.$host.'404');
			// echo '404';

	    }

	}