<?php

	class Controller_Room extends Controller
	{

		function __construct($ID){

			$this->model = new Model_Room();
			$this->view = new View();
			$this->id = $ID;

		}
		
		function action_index(){		
			
			if(isset($_COOKIE['token'])){

				$this->model->issetGame();

				if($this->model->issetGame != false){

					if($this->model->roomInfo['id'] == $this->id){

						$data = $this->model->get_data();

						$this->view->generate(null, 'room_view.php', $data);

					}else{

						header('Location:'.HOST.'/404');

					}

				}else{

					header('Location:'.HOST.'/404');

				}

			}else{

				header('Location:'.HOST.'/404');

			}

		}

	}