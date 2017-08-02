<?php 

	require_once('settings.php');

	// if()

			$queryU = mysqli_query($connection, "SELECT * FROM `users` WHERE `uid` = ".$_POST['uid']."");
			$user = mysqli_fetch_assoc($queryU); 

			$queryR = mysqli_query($connection, "SELECT * FROM `rooms` WHERE `status` = 'wait' AND `host` = ".$_POST['uid']." OR `status` = 'process' AND `host` = ".$_POST['uid']);


			// $cv = $_POST['count_win'];
			// if($_POST['count_win'] > 15){
			// 	$cv = 15;
			// };

			$br = intval($_POST['br']);

			if(mysqli_num_rows($queryR) < 1){
				if($user['balance'] != 0){
					if($user['balance'] >= $_POST['room_bet']){
						mysqli_query($connection, "INSERT INTO `rooms`(`host`, `image`, `player`, `bet`, `count_win`, `status`) VALUES ('".$user['uid']."','".$user['image']."',0,".$_POST['room_bet'].",".$_POST['count_win'].",'wait')");
						mysqli_query($connection, "UPDATE `users` SET `balance` = `balance` - ".$_POST['room_bet']." WHERE `uid` = ".$user['uid']);
						$queryRN = mysqli_query($connection, "SELECT * FROM `rooms` WHERE `host` = '".$user['uid']."' AND `status` = 'wait'");
						$roomNew = mysqli_fetch_assoc($queryRN);
						echo json_encode(array('res' => 1, 'data' => array('uid' => $user['uid'], 'id' => $roomNew['id'])));
					}else{
						echo json_encode(array('res' => 'Недостаточно средств'));
					}
				}else{
					echo json_encode(array('res' => 'Недостаточно средств'));
				}
			}else{
				echo json_encode(array('res' => 'У вас уже есть открытая комната, дождитесь игрока или удалите её и создайте новую'));
			}

?>