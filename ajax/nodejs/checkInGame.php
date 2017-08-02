<?php 

	require_once('settings.php');

	$queryR = mysqli_query($connection, "SELECT * FROM `rooms` WHERE `status` = 'process' AND `host` = ".$_POST['uid']." OR `status` = 'process' AND `player` = ".$_POST['uid']);


	if(mysqli_num_rows($queryR) < 1){
		
		echo 1;

	}else{

		echo 0;

	}

?>