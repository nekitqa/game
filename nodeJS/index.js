	
	function ecran(str){

		return str.replace(/[\u00A0-\u9999<>\&]/gim, i => '&#' + i.charCodeAt(0) + ';');

	}


	const HOST = 'http://game';

	var request = require('request'),
		http    = require('http'),
		app     = http.createServer().listen(process.env.PORT || 80),
		io 		= require('socket.io')(app);

	var users = [];
	var notJoin = [];
	var chatBanned = [];
	var rooms = [];

	setInterval(function(){

		console.log(' notJoin - ');
		console.log(notJoin);
		console.log('\n');
		console.log(' users - ');
		console.log(users);
		console.log('\n');
		console.log(' chatBanned - ');
		console.log(chatBanned);
		console.log('\n');

	}, 900000)

	io.on('connection', function(socket){


		notJoin.push({id: socket.id});

		socket.on('join', function(msg){

			if(msg.token != ''){

				var sToken = ecran(msg.token);

				request.post({url: HOST + '/ajax/nodejs/messages.php', form: {token: sToken}}, function(err,httpResponse,body){

					if(body != 0){

						var joinJson = JSON.parse(body);

						users.push({socketId: socket.id ,token: sToken, uid: joinJson.uid, balance: joinJson.balance, image: joinJson.image, lastMsg: new Date().getTime(), spamCount: 0, betRoom: 0});
						notJoin.splice(notJoin.findIndex(nj => nj.id == socket.id), 1);
						socket.join(joinJson.uid);
						console.log(joinJson);


					}

				});


			}

		});

		socket.on('messageS', function(msg){

			if(notJoin.findIndex(nj => nj.id == socket.id) == -1){

				var item = users[users.findIndex(ues => ues.socketId == socket.id)];

				if(msg.text != ''){

					if(users.findIndex(ues => ues.socketId == socket.id) != -1){

						if(chatBanned.indexOf(item.uid) == -1){

							if(item.spamCount < 7){

								if(new Date().getTime() - item.lastMsg < 750){

									item.lastMsg = new Date().getTime();
									item.spamCount++;
									// socket.emit('chat_error', {text: 'Не так часто!'});
									socket.emit('messageC', {image: item.image, text: ecran(msg.text)});
									request.post({url: HOST + '/ajax/nodejs/addMsgToBd.php', form: {token: item.token, text: ecran(msg.text), image: item.image}}, function(err,httpResponse,body){});

								}else{

									item.lastMsg = new Date().getTime();
									item.spamCount = 0;
									request.post({url: HOST + '/ajax/nodejs/addMsgToBd.php', form: {token: item.token, text: ecran(msg.text), image: item.image}}, function(err,httpResponse,body){});
									socket.emit('messageC', {image: item.image, text: ecran(msg.text)});
									socket.broadcast.emit('messageC', {image: item.image, text: ecran(msg.text)});

								}

							}else{

								socket.emit('chat_error', {text: 'Вы заблокированны на 15 минут за спам!'});
								chatBanned.push(item.uid);

							}

						}else{

							socket.emit('chat_error', {text: 'Ранее вы были заблокированны на 15 минут за спам!'});

							if('banTimeout' in item != true){

								item.banTimeout = setTimeout(function(){

									chatBanned.splice(chatBanned.indexOf(item.uid), 1);
									item.spamCount = 0;

								}, 900000)

							}

						}

					};

				}

			}

		});

		socket.on('CreateRoomS', function(data) {

			if(notJoin.findIndex(nj => nj.id == socket.id) == -1){

				if(data.countWin != '' && data.roomBet != ''){

					item = users[users.findIndex(ues => ues.socketId == socket.id)];

					if(data.countWin.match(/^\d+$/) != null && data.roomBet.match(/^\d+$/) != null){

						request.post({url: HOST + '/ajax/nodejs/createRoom.php', form: {uid: item.uid, count_win: ecran(data.countWin), room_bet: ecran(data.roomBet)}}, function(err,httpResponse,body){

							var json = JSON.parse(body);

							if(json.res == 1){

								socket.emit('CreateRoomC', {image: item.image, betRoom: data.roomBet, countWin: data.countWin, uidHost: json.data.uid, id: json.data.id});
								socket.broadcast.emit('CreateRoomC', {image: item.image, betRoom: data.roomBet, countWin: data.countWin, uidHost: json.data.uid, id: json.data.id});
								socket.emit('balance', {function: '-', number: data.roomBet});
								socket.to(item.uid).emit('balance', {function: '-', number: data.roomBet});
								users[users.findIndex(ues => ues.socketId == socket.id)].betRoom = data.roomBet;
								users[users.findIndex(ues => ues.socketId == socket.id)].balance = parseInt(users[users.findIndex(ues => ues.socketId == socket.id)].balance) - parseInt(data.roomBet);
					
								console.log(users[users.findIndex(ues => ues.socketId == socket.id)]);

								rooms.push({idRoom: json.data.id, hostUid: json.data.uid, valueBet: data.roomBet})
							}else{

								socket.emit('msgErrorC', {textError: json.res});

							}

						});

					}else{

						socket.emit('msgErrorC', {textError: 'Ах ты ж хакер, фиг тебе!'});

					}

				}

			}

		})


		socket.on('deleteRoomS', function(data) {

			if(notJoin.findIndex(nj => nj.id == socket.id) == -1){

				item = users[users.findIndex(ues => ues.socketId == socket.id)];
					
				if(rooms.findIndex(ros => ros.hostUid == item.uid) != -1){

					request.post({url: HOST + '/ajax/nodejs/delLobbie.php', form: {uid: item.uid}}, function(err,httpResponse,body){});
					socket.broadcast.emit('deleteRoomC', {id: rooms[rooms.findIndex(ros => ros.hostUid == item.uid)].idRoom})
					socket.emit('deleteRoomC', {id: rooms[rooms.findIndex(ros => ros.hostUid == item.uid)].idRoom})
					socket.emit('balance', {function: '+', number: item.betRoom});
					socket.to(item.uid).emit('balance', {function: '+', number: item.betRoom});
					users[users.findIndex(ues => ues.socketId == socket.id)].balance = parseInt(users[users.findIndex(ues => ues.socketId == socket.id)].balance) + parseInt(item.betRoom);

					console.log(users[users.findIndex(ues => ues.socketId == socket.id)]);

					users[users.findIndex(ues => ues.socketId == socket.id)].betRoom = 0;
					rooms.splice(rooms.findIndex(ros => ros.hostUid == item.uid), 1);

				}

			}

		})


		socket.on('joinGameS', function(data){

			if(notJoin.findIndex(nj => nj.id == socket.id) == -1){

				console.log(data.roomId + '\n' + rooms);

				item = users[users.findIndex(ues => ues.socketId == socket.id)];
				

				if(rooms.findIndex(ros => ros.hostUid == item.uid) == -1){
					
					if(rooms.findIndex(ros => ros.idRoom == data.roomId) != -1){

						// send connect to room   socket.emit();socket.broadcast.emit();
						// and create private room for players this game
						// and add string to database
						socket.emit('msgErrorC', {textError: 'connect'});

					}else{

						socket.emit('msgErrorC', {textError: 'Вы не успели :('});

					}
					// console.log(rooms);
				}else{

					socket.emit('msgErrorC', {textError: 'У вас уже есть созданная комната'});

				}

			}

		})

		socket.on('exitS', function(){

			if(notJoin.findIndex(nj => nj.id == socket.id) == -1){

				item = users[users.findIndex(ues => ues.socketId == socket.id)];

				socket.to(item.uid).emit('exitC', {});

			}

		})

		socket.on('disconnect', function() {

			if(notJoin.findIndex(nj => nj.id == socket.id) == -1){

				item = users[users.findIndex(ues => ues.socketId == socket.id)];
					
				if(rooms.findIndex(ros => ros.hostUid == item.uid) != -1){

					request.post({url: HOST + '/ajax/nodejs/delLobbie.php', form: {uid: item.uid}}, function(err,httpResponse,body){});
					socket.broadcast.emit('deleteRoomC', {id: rooms[rooms.findIndex(ros => ros.hostUid == item.uid)].idRoom})
					socket.emit('deleteRoomC', {id: rooms[rooms.findIndex(ros => ros.hostUid == item.uid)].idRoom})
					users[users.findIndex(ues => ues.socketId == socket.id)].betRoom = 0;
					// socket.emit('deleteRoom', {id: rooms[rooms.findIndex(ros => ros.hostUid == item.uid)].idRoom})
					rooms.splice(rooms.findIndex(ros => ros.hostUid == item.uid), 1);
							
				}

				users.splice(users.findIndex(ues => ues.socketId == socket.id), 1);

			}else{

				notJoin.splice(notJoin.findIndex(nj => nj.id == socket.id), 1);

			}

		})

	});

