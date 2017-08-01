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
			$this->model->auth = $this->model->auth();
			if($this->model->auth == 0){
				$data = $this->model->get_data();
				$this->view->generate(null, 'main_nl_view.php', $data);
			}else{
				$data = $this->model->get_data();
				$this->view->generate(null, 'main_l_view.php', $data);
			}
		}
	}