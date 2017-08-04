<?php

	class Controller_Main extends Controller
	{


		function __construct()
		{
			$this->model = new Model_Main();
			$this->view = new View();
		}
		
		function action_index()
		{		

			if(isset($_GET['code']) xor isset($_COOKIE['token'])){

				$data = $this->model->get_data();
				$this->view->generate(null, 'main_l_view.php', $data);

			}else{

				$data = $this->model->get_data();
				$this->view->generate(null, 'main_nl_view.php', $data);
				
			}

		}
	}