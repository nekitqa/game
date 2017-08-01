<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>l</title>
		<link rel="stylesheet" type="text/css" href="/static/style/l_style.css">
		<script type="text/javascript" src="/static/js/jq.js"></script>
		<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.3/socket.io.js"></script>
	</head>
	<body>
		<div class="preloader">
			<div class="spinner">
				<div class="spinnerO"></div>
			</div>
			<span class="spinnerText">Спиннер крутится, сокет мутится</span>
		</div>
		<div class="gray_block">
			<div class="add_room_block">
				<div id="close_add_room_window"></div>
				<span class="count_win">Играем до <input id="count_win_input" value="3" min="1" max="15" type="number"> побед</span>
				<span class="value_bet">На <input id="bet_room" value="100" min="1" type="number">$</span>
				<button id="create_room">Создать игру</button>
			</div>
		</div>
		<header>
			<div class="avatar" data-uid="<?php echo $data['BDInfo']['uid'] ?>" style="background-image: url(<?php echo $data['response'][0]['photo_big'] ?>);"><div id="exit"></div></div>
			<div class="information_block">
				<div class="top_block">
					<span class="name"><?php echo $data['response'][0]['first_name'].' '.$data['response'][0]['last_name'] ?></span>
				</div>
				<span class="win"><?php echo $data['BDInfo']['win'] ?> W</span>
				<span class="loose"><?php echo $data['BDInfo']['lose'] ?> L</span>
				<span class="balance"><?php echo $data['BDInfo']['balance'] ?></span><span style="color: #978147;">$</span>
			</div>
		</header>
		<div class="content">
			<div class="lobbie_block">
				<span class="lobbiy">Лобби</span>
				<div id="add_room"></div>
				<?php
					while($room = $data['Rooms']->fetch(PDO::FETCH_ASSOC)){ 
						if($room['host'] != $_COOKIE['uid']){
						?>

					<div class="room" data-id-room="<?php echo $room['id'] ?>">
						<div class="avatar_host" style="background-image: url(<?php echo $room['image'] ?>);"></div><div class="join" data-id-room="<?php echo $room['id'] ?>"></div><div class="info"><span class="bet">На <?php echo $room['bet'] ?>$</span><span>до <span class="big"><?php echo $room['count_win'] ?></span> побед</span></div>
					</div>

					<?php }else{
						?>

					<div class="room">
						<div class="avatar_host" style="background-image: url(<?php echo $room['image'] ?>);"></div><div class="player"></div><div class="info"><span class="bet">На <?php echo $room['bet'] ?>$</span><span>до <span class="big"><?php echo $room['count_win'] ?></span> побед</span></div><div onclick="delLobbie()" class="del_lobbie"></div>
					</div>
					<?php	
				}
					}
					// var_dump($data);
				?>
				
			</div>
			<div class="chat_block">
				<span class="chat">Чат</span>
				<div class="messages_block">
					<?php

						// while($message = $data['Chat']->fetch(PDO::FETCH_ASSOC)){
						foreach($data['Chat'] as $message){
							# code...
						// }
							?>

					<div class="message">
						<a class="avatar" style="background-image: url(<?php echo $message['image'] ?>)"></a>
						<span class="text"><?php echo $message['text'] ?></span>
					</div>

							<?php
						}

					?>
				</div>
				<div class="my_msg">
					<textarea id="MyMSG" cols="30" placeholder="Enter - отправить сообщение" rows="5"></textarea>
				</div>
			</div>
		</div>
		<script type="text/javascript" src="/static/js/lIndex.js"></script>
	</body>
	</html>







