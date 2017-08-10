<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Document</title>
		<link rel="stylesheet" href="/static/style/roomStyle.css">
		<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.3/socket.io.js"></script>
	</head>
	<body>
	<?php

		// print_r($data);

	?>	
		<div class="preloader">
			<div class="spinner">
				<div class="spinnerO"></div>
			</div>
			<span class="spinnerText">Спиннер крутится, сокет мутится</span>
		</div>
		<div class="container">
			<header class="menu">
				<button class="stone buttons" onclick=""></button>
				<button class="scissors buttons" onclick=""></button>
				<button class="paper buttons" onclick=""></button>
			</header>
			<main class="field">
				<div class="player">
					<span class="name"><?php echo $data['hostInfo']['name'] ?></span>
					<div class="image">
						<div class="avatar" style="background-image: url('<?php echo $data['hostInfo']['image'] ?>')"></div>
					</div>
					<span class="score">0</span>
				</div>
				<div class="card" style="background-image: url('')"></div>		
				<div class="info">
					<span class="time">5 сек</span>
					<span class="big">VS</span>
				</div>
				<div class="card" style="background-image: url('')"></div>
				<div class="player">
					<span class="name"><?php echo $data['playerInfo']['name'] ?></span>
					<div class="image">
						<div class="avatar" style="background-image: url('<?php echo $data['playerInfo']['image'] ?>')"></div>
					</div>
					<span class="score">0</span>		
				</div>
			</main>
			<footer class="score">
				<?php

					for($i = 1; $i < $data['roomInfo']['count_win'] + 1; $i++){ 

						if($i == intdiv($data['roomInfo']['count_win'], 2) + 1){

							echo '<div class="winner point" id="'.$i.'" style="background-image: url("")"></div>';

						}else{

							echo '<div class="point" id="'.$i.'" style="background-image: url("")"></div>';

						}


					}

				?>
				<!-- <div class="point" id="1" style="background-image: url('')"></div>
				<div class="point" id="2" style="background-image: url('')"></div>
				<div class="point" id="3" style="background-image: url('')"></div>
				<div class="point" id="4" style="background-image: url('')"></div>
				<div class="winner point" id="5" style="background-image: url('')"></div>
				<div class="point" id="6" style="background-image: url('')"></div>
				<div class="point" id="7" style="background-image: url('')"></div>
				<div class="point" id="8" style="background-image: url('')"></div>
				<div class="point" id="9" style="background-image: url('')"></div> -->
			</footer>
		</div>
		<script type="text/javascript" src="/static/js/rooms.js"></script>
	</body>
</html>