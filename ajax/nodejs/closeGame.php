<?php 

	require_once('settings.php');

	$queryR = mysqli_query($connection, "SELECT * FROM `rooms` WHERE `status` = 'process' AND `id` = ".$_POST['id']);
	if(mysqli_num_rows($queryR) == 1){

		$room = mysqli_fetch_assoc($queryR);
		mysqli_query($connection, "UPDATE `rooms` SET `status` = 'close', `winner` = 'none' WHERE `id` = ".$_POST['id']);
		mysqli_query($connection, "UPDATE `users` SET `balance` = `balance` + ".$room['bet']." WHERE `uid` = ".$room['host']);
		mysqli_query($connection, "UPDATE `users` SET `balance` = `balance` + ".$room['bet']." WHERE `uid` = ".$room['player']);

	}else{

		echo '0';

	}

	

?>