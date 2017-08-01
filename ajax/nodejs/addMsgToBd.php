<?php 

	require_once('settings.php');


	$query = mysqli_query($connection, "SELECT * FROM `users` WHERE `token` = '".$_POST['token']."'");
	$user = mysqli_fetch_assoc($query);
	
	mysqli_query($connection, "INSERT INTO `chat`(`uid`, `image`, `text`) VALUES (".$user['uid'].", '".$_POST['image']."', '".$_POST['text']."')");
	
?>