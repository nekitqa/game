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
		rt.emit('joinGame', {token: getCookie('token'), rid: idRoom});
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
