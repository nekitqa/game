<?php 

	require_once('settings.php');

	$query = mysqli_query($connection, "SELECT `balance`,`uid`,`image` FROM `users` WHERE `token` = '".$_POST['token']."'");
	$response = mysqli_fetch_assoc($query);
	if(mysqli_num_rows($query) == 0){
		echo 0;
	}else{
		echo json_encode($response);	
	}
	

?>