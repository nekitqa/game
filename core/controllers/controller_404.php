<?php

	class Controller_404 extends Controller
	{
		
		function action_index()
		{
			$this->view->generate(null, '404_view.php', null);
		}

	}
