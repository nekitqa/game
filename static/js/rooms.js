	const HOSTNODEJS = 'http://localhost';
	const HOST = 'game';
	var rt = io.connect(HOSTNODEJS, {secure:true});
	var join = false;
	var preloader = document.getElementsByClassName('preloader')[0];
	var idRoom = location.href.replace('http://' + HOST + '/room/', '');
	var timer = document.getElementsByClassName('time')[0];
	var iInterval = 0;
	var timerInterval;
	var cardHost = document.getElementsByClassName('card')[0];
	var cardPlayer = document.getElementsByClassName('card')[1];
	var buttons = document.getElementsByClassName('buttons');
	buttonsOnclickArr = ['stone()', 'scissors()', 'paper()'];

	function deactivateButtons(){
		for (var i = 0; i < buttons.length; i++) {
			buttons[i].setAttribute('onclick', '');
			buttons[i].style.opacity = '0.5';
		}	
	}

	function activateButtons(){
		for (var i = 0; i < buttons.length; i++) {
			buttons[i].setAttribute('onclick', buttonsOnclickArr[i]);
			buttons[i].style.opacity = '1';
		}	
	}
	
	activateButtons();

	function getCookie(name){
		var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,'\\$1')+"=([^;]*)"));
		return matches?decodeURIComponent(matches[1]):undefined;
	}

	function message(text){
		var grayBlock = document.createElement('div'),
			windowMsg = document.createElement('div'),
			closeMsg  = document.createElement('div'),
			span      = document.createElement('span');

		grayBlock.className = 'gray_block';
		grayBlock.style.display = 'block';
		document.body.appendChild(grayBlock);

		windowMsg.className = 'windowMsg';
		grayBlock.appendChild(windowMsg);

		closeMsg.id = 'closeMsg';
		windowMsg.appendChild(closeMsg);

		span.innerHTML = text;
		windowMsg.appendChild(span);


		document.getElementById('closeMsg').addEventListener('click', function(){
			document.body.removeChild(grayBlock);
		});

	}

	function stone(){
		rt.emit('strokeGame', {item: 1});
		deactivateButtons();
	}

	function scissors(){
		rt.emit('strokeGame', {item: 2});
		deactivateButtons();
	}

	function paper(){
		rt.emit('strokeGame', {item: 3});
		deactivateButtons();
	}


	function deleteCookie(name){
		var date = new Date(); // Берём текущую дату
	  	date.setTime(date.getTime() - 1); // Возвращаемся в "прошлое"
	  	document.cookie = name += "=; expires=" + date.toGMTString();
	}
		
	function startTimer(countS){
		timer.innerHTML = countS + ' сек';
			timerInterval = setInterval(function(){
			timer.innerHTML = countS + ' сек';
			if(countS == 0){
			}else{
				countS--;
			}
		}, 1000)
	}


	rt.on('connect', function(){
		rt.emit('joinRoom', {token: getCookie('token'), rid: idRoom});
		join = true;
	})

	rt.on('disconnect', function(){
		var preloader = document.getElementsByClassName('preloader')[0];
		preloader.style.display = 'block';
		join = false;
	});

	rt.on('exitC', function(){
		location.reload();
	})

	rt.on('msgErrorC', function(data){
		message(data.textError);
	})

	rt.on('startGame', function(){
		// ставим для карт дефолтные рубашки
		cardPlayer.style.backgroundImage = 'url(/static/img/defCard.png)';
		cardHost.style.backgroundImage = 'url(/static/img/defCard.png)';
		activateButtons();
		if(preloader.style.display != 'none'){
			preloader.style.display = 'none';
		};
		startTimer(10);
	})

	rt.on('endRound', function(data){
		// ставим нужные нам рубашки
		console.log(data);

		if(data.hostStroke == 1){

			cardHost.style.backgroundImage = 'url(/static/img/stone.png)';
			console.log('host stone');

		}else if(data.hostStroke == 2){

			cardHost.style.backgroundImage = 'url(/static/img/scissors.png)';
			console.log('host scissors');

		}else if(data.hostStroke == 3){

			cardHost.style.backgroundImage = 'url(/static/img/paper.png)';
			console.log('host paper');

		}

		if(data.playerStroke == 1){

			cardPlayer.style.backgroundImage = 'url(/static/img/stone.png)';
			console.log('player stone');

		}else if(data.playerStroke == 2){

			cardPlayer.style.backgroundImage = 'url(/static/img/scissors.png)';
			console.log('player scissors');

		}else if(data.playerStroke == 3){

			cardPlayer.style.backgroundImage = 'url(/static/img/paper.png)';
			console.log('player paper');

		}

		clearInterval(timerInterval);
	})

	rt.on('stroke', function(data){
		if(data.who == 'host'){
			cardHost.style.backgroundImage = 'url(/static/img/waitCard.png)';
		}else if(data.who == 'player'){
			cardPlayer.style.backgroundImage = 'url(/static/img/waitCard.png)';
		}
	});

	rt.on('endGame', function(data){
		console.log(data.winner);
		if(data.winner == 'none'){
			location.href = 'http://' + HOST;
			// console.log('winner: none');
		}else{
			if(data.winner == 'host'){
				var winnerAvatar = document.getElementsByClassName('avatar')[0].style.backgroundImage;
				var winnerName = document.getElementsByClassName('name')[0].innerHTML;
			}else if(data.winner == 'player'){
				var winnerAvatar = document.getElementsByClassName('avatar')[1].style.backgroundImage;
				var winnerName = document.getElementsByClassName('name')[1].innerHTML;
			}


			var grayBlock = document.createElement('div'),
				containerWinner = document.createElement('div'),
				crownBlock = document.createElement('div'),
				avatarBlock = document.createElement('div'),
				nameWinner  = document.createElement('span');

			grayBlock.className = 'gray_block';
			grayBlock.style.display = 'block';
			document.body.appendChild(grayBlock);

			containerWinner.className = 'container_winner';
			grayBlock.appendChild(containerWinner);

			crownBlock.className = 'crown';
			containerWinner.appendChild(crownBlock);

			avatarBlock.className = 'avatar_winner';
			avatarBlock.style.backgroundImage = winnerAvatar;
			containerWinner.appendChild(avatarBlock);

			nameWinner.innerHTML = winnerName;
			nameWinner.className = 'winner_name';
			containerWinner.appendChild(nameWinner);


			setTimeout(function(){
				location.href = 'http://' + HOST;
			}, 2500);
		}

	})
