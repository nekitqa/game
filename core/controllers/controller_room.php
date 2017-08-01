<?php

	class Controller_Room extends Controller
	{

		function __construct($ID){

			$this->model = new Model_Room();
			$this->view = new View();
			$this->id = $ID;

		}
		
		function action_index(){		
			
			$this->view->generate(null, 'room_view.php', $this->id);

		}

	}