<?php

	class Route
	{

		public $model_name;

		static function start()
		{
			// контроллер и действие по умолчанию
			$controller_name = 'Main';
			$action_name = 'index';
			
			$routes = explode('/', $_SERVER['REQUEST_URI']);
			

			// получаем имя контроллера
			if ( !empty($routes[1]) )
			{	
				if (empty($_GET)) {
					$controller_name = $routes[1];
				}
			}
			
			// получаем имя экшена
			if ( !empty($routes[2]) )
			{
				if (empty($_GET)) {
					if($controller_name == 'room'){
						$id = $routes[2];
					}else{
						$action_name = $routes[2];
					}
				}
			}

			// добавляем префиксы
			$path_for_routes = $controller_name.'/'.$action_name;
			// $indexArray = array_search($path_for_routes, $routes);
			$model_name = 'Model_'.$controller_name;
			$controller_name = 'Controller_'.$controller_name;
			$action_name = 'action_'.$action_name;

			
			// echo "Model: $model_name <br>";
			// echo "Controller: $controller_name <br>";
			// echo "Action: $action_name <br>";
			

			// подцепляем файл с классом модели (файла модели может и не быть)

			$model_file = strtolower($model_name).'.php';
			$model_path = "core/models/".$model_file;
			if(file_exists($model_path))
			{
				include "core/models/".$model_file;
			}

			// подцепляем файл с классом контроллера
			$controller_file = strtolower($controller_name).'.php';
			$controller_path = "core/controllers/".$controller_file;
			if(file_exists($controller_path))
			{
				include "core/controllers/".$controller_file;
			}
			else
			{
				/*
				правильно было бы кинуть здесь исключение,
				но для упрощения сразу сделаем редирект на страницу 404
				*/
				Route::ErrorPage404();
			}
			
			// создаем контроллер
			$controller = new $controller_name;
			$action = $action_name;
			
			if(method_exists($controller, $action))
			{
				// вызываем действие контроллера
				$controller->$action();
			}
			else
			{
				// здесь также разумнее было бы кинуть исключение
				Route::ErrorPage404();
			}
		
		}

		function ErrorPage404()
		{
	        $host = HOST.'/';
	        header('HTTP/1.1 404 Not Found');
			header("Status: 404 Not Found");
			header('Location:'.$host.'404');
	    }
	    
	}

