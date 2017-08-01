<?php

	require_once('settingsAjax.php');
	$queryU = mysqli_query($connection, "SELECT * FROM `users` WHERE `uid` = ".$_COOKIE['uid']);
	$queryR = mysqli_query($connection, "SELECT * FROM `rooms` WHERE `id` = ".$_POST['roomId']);

	$user = mysqli_fetch_assoc($queryU);
	$room = mysqli_fetch_assoc($queryR);

	if($user['balanсe'] - $room['bet'] >= 0){
		echo '1';
		if($room['player'] == '0' xor $room['player'] == ''){
			mysqli_query($connection, "UPDATE `rooms` SET `player` = ".$_COOKIE['uid']." WHERE `id` = ".$_POST['roomId']);
		}
	}else{
		echo '0';
	}
?>