	const HOSTNODEJS = 'http://localhost';
	const HOST = 'game';




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




	function deleteCookie(name){
		var date = new Date(); // Берём текущую дату
	  	date.setTime(date.getTime() - 1); // Возвращаемся в "прошлое"
	  	document.cookie = name += "=; expires=" + date.toGMTString();
	}

	var rt = io.connect(HOSTNODEJS, {secure:true});
	var join = false;
	var preloader = document.getElementsByClassName('preloader')[0];
	var idRoom = location.href.replace('http://' + HOST + '/room/', '');
	console.log(idRoom);

	rt.on('connect', function(){
		rt.emit('joinRoom', {token: getCookie('token'), rid: idRoom});
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

	rt.on('endGame', function(data){
		console.log(data);
		if(data.winner = 'host'){
			var winnerAvatar = document.getElementsByClassName('avatar')[0].style.backgroundImage;
			var winnerName = document.getElementsByClassName('name')[0].innerHTML;
		}else{
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


		// setTimeout(function(){
		// 	location.href = 'http://' + HOST;
		// }, 2500);

	})
