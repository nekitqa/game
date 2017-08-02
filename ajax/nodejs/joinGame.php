<?php 

	require_once('settings.php');
	
	$roomsWaitQ = mysqli_query($connection, "SELECT * FROM `rooms` WHERE `host` = '".$_POST['uid']."' AND `status` = 'wait'");

	if(mysqli_num_rows($roomsWaitQ) == 0){

		$roomsProcessQ = mysqli_query($connection, "SELECT * FROM `rooms` WHERE `host` = '".$_POST['uid']."' AND `status` = 'process' OR `player` = '".$_POST['uid']."' AND `status` = 'process'");

		if(mysqli_num_rows($roomsProcessQ) == 0){

			$userBalanceQ = mysqli_query($connection, "SELECT `balance` FROM `users` WHERE `uid` = ".$_POST['uid']);
			$userBalance = mysqli_fetch_assoc($userBalanceQ);

			if($userBalance['balance'] >= $_POST['bet']){

				echo 1;

			}else{

				echo 'Недостаточно средств';

			}

		}else{

			echo 'Вы ещё находитесь в незавершённой игре';

		}

	}else{

		echo 'У вас уже есть созданная комната';

	}

?>