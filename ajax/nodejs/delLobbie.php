<?php 

	require_once('settings.php');


	$queryU = mysqli_query($connection, "SELECT * FROM `rooms` WHERE `status` = 'wait' AND `host` = ".$_POST['uid']);
	$user = mysqli_fetch_assoc($queryU);

	mysqli_query($connection, "DELETE FROM `rooms` WHERE `status` = 'wait' AND `host` = ".$_POST['uid']);
	mysqli_query($connection, "UPDATE `users` SET `balanсe` = `balanсe` + ".$user['bet']." WHERE `uid` = ".$_POST['uid']);
	
?>