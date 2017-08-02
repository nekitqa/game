	const HOSTNODEJS = 'http://localhost';
	const HOST = 'game';

	var gray_block = document.getElementsByClassName('gray_block');



	var rt = io.connect(HOSTNODEJS, {secure:true});
	var join = false;
	var preloader = document.getElementsByClassName('preloader')[0];

	rt.on('connect', function(){
		rt.emit('join', {token: getCookie('token')});
		preloader.style.display = 'none';
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

	rt.on('chat_error', function(msg){
		var messgaBlockU = document.createElement('div'),
			textU        = document.createElement('span'),
			allMSG       = document.getElementsByClassName('messages_block');

		messgaBlockU.className = 'message';
		messgaBlockU.style.textAlign = 'center';
		textU.className = 'text';
		textU.style.color = '#4F4F4F';
		textU.innerHTML = msg.text;
		messgaBlockU.appendChild(textU);
		allMSG[0].appendChild(messgaBlockU);
		var block = document.getElementsByClassName("messages_block");
	  	block[0].scrollTop = block[0].scrollHeight;
	})

	rt.on('messageC', function(msg){
		var messgaBlockU = document.createElement('div'),
			avatarU      = document.createElement('a'),
			textU        = document.createElement('span'),
			allMSG       = document.getElementsByClassName('messages_block');


		messgaBlockU.className = 'message';
		avatarU.className = 'avatar';
		avatarU.style.backgroundImage = 'url(' + msg.image + ')';
		textU.className = 'text';
		textU.innerHTML = msg.text;
		messgaBlockU.appendChild(textU);
		messgaBlockU.appendChild(avatarU);
		allMSG[0].appendChild(messgaBlockU);
		var block = document.getElementsByClassName("messages_block");
	  	block[0].scrollTop = block[0].scrollHeight;
	})

	rt.on('CreateRoomC', function(data){

		gray_block[0].style.display = 'none';
		if(data.uidHost == getCookie('uid')){
			var lobbieBlock = document.getElementsByClassName('lobbie_block');
				roomBlock = document.createElement('div'),
				avatarHost = document.createElement('div'),
				playerBlock = document.createElement('div'),
				infoBlock = document.createElement('div'),
				spanBet = document.createElement('span'),
				countWinSpan = document.createElement('span'),
				bigSpan = document.createElement('span'),
				delLobbieBlock = document.createElement('div');

			roomBlock.className = 'room';
			roomBlock.setAttribute('data-id-room', data.id);
			avatarHost.className = 'avatar_host';
			avatarHost.style.backgroundImage = 'url("' + data.image + '")';	
			playerBlock.className = 'player';
			infoBlock.className = 'info';
			spanBet.className = 'bet';
			spanBet.innerHTML = 'На ' + data.betRoom + '$';
			countWinSpan.innerHTML = 'до <span class="big">' + data.countWin + '</span> побед';
			delLobbieBlock.className = 'del_lobbie';
			delLobbieBlock.setAttribute('onclick', 'delLobbie()');

			roomBlock.appendChild(avatarHost);
			roomBlock.appendChild(playerBlock);
			infoBlock.appendChild(spanBet);
			infoBlock.appendChild(countWinSpan);
			roomBlock.appendChild(infoBlock);
			roomBlock.appendChild(delLobbieBlock);
			lobbieBlock[0].appendChild(roomBlock);
		}else{
			var lobbieBlock = document.getElementsByClassName('lobbie_block');
				roomBlock = document.createElement('div'),
				avatarHost = document.createElement('div'),
				joinBlock = document.createElement('div'),
				infoBlock = document.createElement('div'),
				spanBet = document.createElement('span'),
				countWinSpan = document.createElement('span'),
				bigSpan = document.createElement('span');

			roomBlock.className = 'room';
			roomBlock.setAttribute('data-id-room', data.id);
			avatarHost.className = 'avatar_host';
			avatarHost.style.backgroundImage = 'url("' + data.image + '")';	
			joinBlock.className = 'join';
			joinBlock.setAttribute('onclick', 'join()');
			joinBlock.setAttribute('data-id-room', data.id);
			infoBlock.className = 'info';
			spanBet.className = 'bet';
			spanBet.innerHTML = 'На ' + data.betRoom + '$';
			countWinSpan.innerHTML = 'до <span class="big">' + data.countWin + '</span> побед';

			roomBlock.appendChild(avatarHost);
			roomBlock.appendChild(joinBlock);
			infoBlock.appendChild(spanBet);
			infoBlock.appendChild(countWinSpan);
			roomBlock.appendChild(infoBlock);
			lobbieBlock[0].appendChild(roomBlock);

			var joinC = document.getElementsByClassName('join');
			for (var i = 0; i < joinC.length; i++) {
				joinC[i].addEventListener('click', function(){
					var id = this.getAttribute('data-id-room');
					// alert(id);
					rt.emit('joinGameS', {roomId: id});

					// 	url: '/ajax/joinGame.php',

				});
			}

		}
		



	})

	rt.on('joinGameC', function(data){
		var spinnerText = document.getElementsByClassName('spinnerText')[0],
			spinner = document.getElementsByClassName('spinner')[0],
			spinnerO = document.getElementsByClassName('spinnerO')[0];
		spinner.style.animation = 'spinner 1.5s infinite alternate cubic-bezier(0.57, 0, 0.35, 1)'
		spinnerO.style.animation = 'spinner 1.5s infinite alternate cubic-bezier(0.57, 0, 0.35, 1)'
		spinnerText.innerHTML = 'Подключаюсь!'
		preloader.style.display = 'block';
		setTimeout(function(){
			location.href='http://' + HOST + '/room/' + data.id;
		}, 1500)
	})

	rt.on('msgErrorC', function(data){
		message(data.textError);
	})

	rt.on('balance', function(data){
		if(data.function == '-'){
			var balance = document.getElementsByClassName('balance');
			balance[0].innerHTML = parseInt(balance[0].innerHTML) - parseInt(data.number);
		}else if(data.function == '+'){
			var balance = document.getElementsByClassName('balance');
			balance[0].innerHTML = parseInt(balance[0].innerHTML) + parseInt(data.number);
		}
	})

	rt.on('deleteRoomC', function(data){
		var lobbieBlock = document.getElementsByClassName('lobbie_block');
		lobbieBlock[0].removeChild(lobbieBlock[0].querySelectorAll('div[data-id-room="' + data.id + '"]')[0]);
	})

	function getCookie(name){
		var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,'\\$1')+"=([^;]*)"));
		return matches?decodeURIComponent(matches[1]):undefined;
	}

	var block = document.getElementsByClassName("messages_block");
  	block[0].scrollTop = block[0].scrollHeight;


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


	function deleteCookie(name){
		var date = new Date(); // Берём текущую дату
	  	date.setTime(date.getTime() - 1); // Возвращаемся в "прошлое"
	  	document.cookie = name += "=; expires=" + date.toGMTString();
	}
	
	document.getElementById('exit').addEventListener('click', function(){
		rt.emit('exitS', {});
   		deleteCookie('uid');
   		deleteCookie('token');
   		deleteCookie('image');
   		location.reload();
	});

	var joinC = document.getElementsByClassName('join');




	for (var i = 0; i < joinC.length; i++) {
		joinC[i].addEventListener('click', function(){
			var id = this.getAttribute('data-id-room');
			// alert(id);
			rt.emit('joinGameS', {roomId: id});

			// 	url: '/ajax/joinGame.php'

		});
	}





	document.getElementById('add_room').addEventListener('click', function(){
		gray_block[0].style.display = 'block';
		close_add_room_window.onclick = function(){
			gray_block[0].style.display = 'none';
		}
	});

	document.getElementById('create_room').addEventListener('click', function(){
		var count_win = count_win_input.value,
			bet       = bet_room.value;

		rt.emit('CreateRoomS', {countWin: count_win, roomBet: bet});

	});


	// if(document.getElementsByClassName('del_lobbie')[0] != undefined){
	// 	document.getElementsByClassName('del_lobbie')[0].addEventListener('click', function(){
	// 		$.ajax({
	// 			type: 'POST',
	// 			url: '/ajax/DeleteRoom.php',
	// 			dataType: 'text',
	// 			success: function(data){
	// 				if(data == '1'){
	// 					//delete lobbie from front-end

	// 					// socket send and render


	// 				}
	// 			}
	// 		})

	// 	});	
	// }

	function delLobbie(){
		rt.emit('deleteRoomS', {});
	}
	
	var textMyMSG = document.getElementById('MyMSG');

	textMyMSG.addEventListener('keypress', function(){
		if(event.shiftKey && event.keyCode==13){
			textMyMSG.value += '\n';
			event.preventDefault()
		}else if(!event.shiftKey && event.keyCode==13){
			event.preventDefault()
			if(getCookie('token') != '' && join == true){
				if(textMyMSG.value != ''){
					rt.emit('messageS', {'text': textMyMSG.value});
				}
			}
			textMyMSG.value = '';
		}
	});

