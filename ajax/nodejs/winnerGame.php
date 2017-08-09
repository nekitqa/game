<?php 

	require_once('settings.php');


	$query = mysqli_query($connection, "SELECT * FROM `rooms` WHERE `status` = 'process' AND `id` = ".$_POST['id']);
	$room = mysqli_fetch_assoc($query);
	
	if(mysqli_num_rows($query) == 1){

		if($_POST['winner'] == 'player'){

			$winner = $room['player'];

		}else{

			$winner = $room['host'];

		}

		$bet = $room['bet'] * 2;

		mysqli_query($connection, "UPDATE `rooms` SET `status` = 'close', `winner` = '".$_POST['winner']."' WHERE `id` = ".$_POST['id']);
		mysqli_query($connection, "UPDATE `users` SET `balance` = `balance` + ".$bet." WHERE `uid` = ".$winner);

	}else{

		echo '0';

	}
	
?>