<?php

	$routesArr = array(

		'/' => array(

			'model' => 'Main',
			'controller' => 'Main',
			'action' => 'index'

		),

		'/404' => array(

			'model' => '',
			'controller' => '404',
			'action' => 'index'

		),

		'/room/' => array(

			'model' => 'room',
			'controller' => 'room',
			'action' => 'index',
			'id' => 2
		)


	);
	

?>