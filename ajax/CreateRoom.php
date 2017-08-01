<?php 

	require_once('settingsAjax.php');

	$queryU = mysqli_query($connection, "SELECT * FROM `users` WHERE `uid` = ".$_COOKIE['uid']);
	$queryR = mysqli_query($connection, "SELECT * FROM `rooms` WHERE `status` = 'wait' AND `host` = ".$_COOKIE['uid']);
	$user = mysqli_fetch_assoc($queryU); 


	$cv = $_POST['cv'];
	if($_POST['cv'] > 15){
		$cv = 15;
	};

	$br = intval($_POST['br']);

	if(mysqli_num_rows($queryR) < 1){
		if($user['balanсe'] != 0){
			if($user['balanсe'] >= $_POST['br']){
				mysqli_query($connection, "INSERT INTO `rooms`(`host`, `image`, `player`, `bet`, `count_win`, `status`) VALUES ('".$_COOKIE['uid']."','".$_COOKIE['image']."',0,".$br.",".$cv.",'wait')");
				mysqli_query($connection, "UPDATE `users` SET `balanсe` = `balanсe` - ".$br." WHERE `uid` = ".$_COOKIE['uid']);
				echo '1';
			}else{
				echo "Недостаточно средств";
			}
		}else{
			echo "Недостаточно средств";
		}
	}else{
		echo 'У вас уже есть открытая комната, дождитесь игрока или удалите её и создайте новую';
	}
		
		

?>