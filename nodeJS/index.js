	function ecran(str){

		return str.replace(/[\u00A0-\u9999<>\&]/gim, i => '&#' + i.charCodeAt(0) + ';');

	};


	const HOST = 'http://game';

	var request = require('request'),
		http    = require('http'),
		app     = http.createServer().listen(process.env.PORT || 80),
		io 		= require('socket.io')(app);

	var users = [];
	var users_room = [];
	var notJoin = [];
	var chatBanned = [];
	var rooms = [];
	var rooms_process = [];

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

			if(msg.token != '' || msg.token != undefined){

				var sToken = ecran(msg.token);

				request.post({url: HOST + '/ajax/nodejs/messages.php', form: {token: sToken}}, function(err,httpResponse,body){

					if(body != 0){

						var joinJson = JSON.parse(body);

						users.push({socketId: socket.id ,token: sToken, uid: joinJson.uid, balance: joinJson.balance, image: joinJson.image, lastMsg: new Date().getTime(), spamCount: 0, betRoom: 0});
						notJoin.splice(notJoin.findIndex(nj => nj.id == socket.id), 1);
						socket.join(joinJson.uid);

					}

				});

			}

		});

		socket.on('messageS', function(msg){

			console.log(' notJoin - ');
			console.log(notJoin);
			console.log('\n');
			console.log(' users - ');
			console.log(users);
			console.log('\n');
			console.log(' chatBanned - ');
			console.log(chatBanned);
			console.log('\n');

			if(notJoin.findIndex(nj => nj.id == socket.id) == -1){

				var item = users[users.findIndex(ues => ues.socketId == socket.id)];

				if(msg.text != ''){

					if(users.findIndex(ues => ues.socketId == socket.id) != -1){

						if(chatBanned.indexOf(item.uid) == -1){

							if(item.spamCount < 7){

								if(new Date().getTime() - item.lastMsg < 1000){

									item.lastMsg = new Date().getTime();
									item.spamCount++;
									if(item.spamCount == 5){

										socket.emit('chat_error', {text: 'Сейчас забаню!'});

									}
									socket.emit('messageC', {image: item.image, text: ecran(msg.text)});
									socket.broadcast.emit('messageC', {image: item.image, text: ecran(msg.text)});
									request.post({url: HOST + '/ajax/nodejs/addMsgToBd.php', form: {token: item.token, text: ecran(msg.text), image: item.image}}, function(err,httpResponse,body){});

								}else{

									item.lastMsg = new Date().getTime();
									if(item.spamCount > 0){

										setTimeout(function(){

											item.spamCount = 0;

										}, 10000)

									};
									request.post({url: HOST + '/ajax/nodejs/addMsgToBd.php', form: {token: item.token, text: ecran(msg.text), image: item.image}}, function(err,httpResponse,body){});
									socket.emit('messageC', {image: item.image, text: ecran(msg.text)});
									socket.broadcast.emit('messageC', {image: item.image, text: ecran(msg.text)});

								}

							}else{

								socket.emit('chat_error', {text: 'Лови бан!'});
								socket.emit('chat_error', {text: 'Вы заблокированны на 15 минут за спам!'});
								chatBanned.push(item.uid);

								if('banTimeout' in item != true){

									item.banTimeout = setTimeout(function(){

										chatBanned.splice(chatBanned.indexOf(item.uid), 1);
										item.spamCount = 0;

									}, 900000)

									console.log(chatBanned);

								}

							}

						}else{

							socket.emit('chat_error', {text: 'Ранее вы были заблокированны на 15 минут за спам!'});

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

						if(parseInt(data.countWin) > 15){

							var countWin = 15;

						}else if(parseInt(data.countWin) < 1){

							var countWin = 1;

						}else{

							var countWin = parseInt(data.countWin);

						}

						request.post({url: HOST + '/ajax/nodejs/createRoom.php', form: {uid: item.uid, count_win: countWin, room_bet: data.roomBet}}, function(err,httpResponse,body){

							var json = JSON.parse(body);

							if(json.res == 1){

								socket.emit('CreateRoomC', {image: item.image, betRoom: data.roomBet, countWin: countWin, uidHost: json.data.uid, id: json.data.id});
								socket.broadcast.emit('CreateRoomC', {image: item.image, betRoom: data.roomBet, countWin: countWin, uidHost: json.data.uid, id: json.data.id});
								socket.emit('balance', {function: '-', number: data.roomBet});
								socket.to(item.uid).emit('balance', {function: '-', number: data.roomBet});
								users[users.findIndex(ues => ues.socketId == socket.id)].betRoom = data.roomBet;
								users[users.findIndex(ues => ues.socketId == socket.id)].balance = parseInt(users[users.findIndex(ues => ues.socketId == socket.id)].balance) - parseInt(data.roomBet);

								rooms.push({idRoom: json.data.id, hostUid: json.data.uid, valueBet: data.roomBet, countWin: countWin})
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

					users[users.findIndex(ues => ues.socketId == socket.id)].betRoom = 0;
					rooms.splice(rooms.findIndex(ros => ros.hostUid == item.uid), 1);

				}

			}

		})

		socket.on('joinGameS', function(data){

			if(notJoin.findIndex(nj => nj.id == socket.id) == -1){

				item = users[users.findIndex(ues => ues.socketId == socket.id)];

				if(rooms.findIndex(ros => ros.idRoom == data.roomId) != -1){

					request.post({url: HOST + '/ajax/nodejs/joinGame.php', form: {id: data.roomId, uid: item.uid, bet: rooms[rooms.findIndex(ros => ros.idRoom == data.roomId)].valueBet}}, function(err,httpResponse,body){

						if(body != 1){

							socket.emit('msgErrorC', {textError: body});

						}else if(body == 1){

							io.sockets.in(item.uid).emit('joinGameC', {id: data.roomId});
							io.sockets.in(rooms[rooms.findIndex(ros => ros.idRoom == data.roomId)].hostUid).emit('joinGameC', {id: data.roomId});

							var thisRoom = rooms[rooms.findIndex(ros => ros.idRoom == data.roomId)];

							// console.log(thisRoom);

							rooms_process.push({id: thisRoom.idRoom, host: thisRoom.hostUid, player: item.uid, countWin: thisRoom.countWin, bet: thisRoom.valueBet, scoreHost: 0, scorePlayer: 0, strokeHost: 0, strokePlayer: 0, findWinner: function(){

								var This = this;
								var obj = This;
								clearTimeout(This.timeoutFunc);

								// console.log(This);

								if(obj.strokePlayer == 0 && obj.strokeHost == 0){

									request.post({url: HOST + '/ajax/nodejs/closeGame.php', form: {id: This.id}}, function(err,httpResponse,body){

										if(body != '0'){

											io.sockets.in('room_' + This.id).emit('endGame', {winner: 'none'});
											if(rooms_process.findIndex(rmp => rmp.id == This.id) != -1){

												rooms_process.splice(rooms_process.findIndex(rmp => rmp.id == This.id), 1);

											}
									
										}

									})

								}else if(obj.strokePlayer != 0 && obj.strokeHost == 0){

									request.post({url: HOST + '/ajax/nodejs/winnerGame.php', form: {id: This.id, winner: 'player'}}, function(err,httpResponse,body){

										if(body != '0'){

											io.sockets.in('room_' + This.id).emit('endGame', {winner: 'player'});

											if(rooms_process.findIndex(rmp => rmp.id == This.id) != -1){

												rooms_process.splice(rooms_process.findIndex(rmp => rmp.id == This.id), 1);

											}
									
										}

									})

								}else if(obj.strokePlayer == 0 && obj.strokeHost != 0){

									request.post({url: HOST + '/ajax/nodejs/winnerGame.php', form: {id: This.id, winner: 'host'}}, function(err,httpResponse,body){

										if(body != '0'){

											io.sockets.in('room_' + This.id).emit('endGame', {winner: 'host'});

											if(rooms_process.findIndex(rmp => rmp.id == This.id) != -1){

												rooms_process.splice(rooms_process.findIndex(rmp => rmp.id == This.id), 1);

											}
									
										}

									})

								}else{

									if(obj.strokePlayer == 1 && obj.strokeHost == 1){

										// ничья
										console.log('11');

									}else if(obj.strokePlayer == 1 && obj.strokeHost == 2){

										rooms_process[rooms_process.findIndex(rps => rps.id == This.id)].scorePlayer++;
										console.log('12');
										// send add 1 point for player on clients

									}else if(obj.strokePlayer == 1 && obj.strokeHost == 3){

										rooms_process[rooms_process.findIndex(rps => rps.id == This.id)].scoreHost++;
										console.log('13');
										// send add 1 point for host on clients

									}else if(obj.strokePlayer == 2 && obj.strokeHost == 1){

										rooms_process[rooms_process.findIndex(rps => rps.id == This.id)].scoreHost++;
										console.log('21');
										// send add 1 point for host on clients

									}else if(obj.strokePlayer == 2 && obj.strokeHost == 2){

										// ничья
										console.log('22');

									}else if(obj.strokePlayer == 2 && obj.strokeHost == 3){

										rooms_process[rooms_process.findIndex(rps => rps.id == This.id)].scorePlayer++;
										console.log('23');
										// send add 1 point for player on clients

									}else if(obj.strokePlayer == 3 && obj.strokeHost == 1){

										rooms_process[rooms_process.findIndex(rps => rps.id == This.id)].scorePlayer++;
										console.log('31');
										// send add 1 point for player on clients

									}else if(obj.strokePlayer == 3 && obj.strokeHost == 2){

										rooms_process[rooms_process.findIndex(rps => rps.id == This.id)].scoreHost++;
										console.log('32');
										// send add 1 point for host on clients

									}else if(obj.strokePlayer == 3 && obj.strokeHost == 3){

										// ничья
										console.log('33');

									}

									io.sockets.in('room_' + obj.id).emit('endRound', {playerStroke: obj.strokePlayer, hostStroke: obj.strokeHost, scorePlayer: obj.scorePlayer, scoreHost: obj.scoreHost});
									rooms_process[rooms_process.findIndex(rps => rps.id == This.id)].strokeHost = 0; 
									rooms_process[rooms_process.findIndex(rps => rps.id == This.id)].strokePlayer = 0;  
										

									if(rooms_process[rooms_process.findIndex(rps => rps.id == This.id)].scorePlayer != rooms_process[rooms_process.findIndex(rps => rps.id == This.id)].countWin && rooms_process[rooms_process.findIndex(rps => rps.id == This.id)].scoreHost != rooms_process[rooms_process.findIndex(rps => rps.id == This.id)].countWin){


											This.startGame();

									}else if(rooms_process[rooms_process.findIndex(rps => rps.id == This.id)].scorePlayer == rooms_process[rooms_process.findIndex(rps => rps.id == This.id)].countWin){

										request.post({url: HOST + '/ajax/nodejs/winnerGame.php', form: {id: This.id, winner: 'player'}}, function(err,httpResponse,body){

											if(body != '0'){

												io.sockets.in('room_' + This.id).emit('endGame', {winner: 'player'});

												if(rooms_process.findIndex(rmp => rmp.id == This.id) != -1){

													rooms_process.splice(rooms_process.findIndex(rmp => rmp.id == This.id), 1);

												}

											}

										});

									}else if(rooms_process[rooms_process.findIndex(rps => rps.id == This.id)].scoreHost == rooms_process[rooms_process.findIndex(rps => rps.id == This.id)].countWin){

										request.post({url: HOST + '/ajax/nodejs/winnerGame.php', form: {id: This.id, winner: 'host'}}, function(err,httpResponse,body){

											if(body != '0'){

												io.sockets.in('room_' + This.id).emit('endGame', {winner: 'host'});

												if(rooms_process.findIndex(rmp => rmp.id == This.id) != -1){

													rooms_process.splice(rooms_process.findIndex(rmp => rmp.id == This.id), 1);

												}

											}

										});

									}

								}

							}, startGame: function(){

								var This = this;

								This.timeoutFunc2sec = setTimeout(function(object){

									This.timeoutFunc = setTimeout(function(obj){

										This.findWinner();

									}, 11000, This);

									io.sockets.in('room_' + This.id).emit('startGame', {});

								}, 2000)

									

								console.log('startgame()');

							}, functionTimeout: function(){

								var This = this;

								setTimeout(function(obj){

									if(users_room.findIndex(usr => usr.uid == obj.host) == -1 && users_room.findIndex(usr => usr.uid == obj.player) != -1){

										request.post({url: HOST + '/ajax/nodejs/winnerGame.php', form: {id: This.id, winner: 'player'}}, function(err,httpResponse,body){

											if(body != '0'){

												io.sockets.in('room_' + This.id).emit('endGame', {winner: 'player'});

												if(rooms_process.findIndex(rmp => rmp.id == This.id) != -1){

													rooms_process.splice(rooms_process.findIndex(rmp => rmp.id == This.id), 1);

												}

												// console.log('io.sockets.in player');

											}

										});

									}else if(users_room.findIndex(usr => usr.uid == obj.host) != -1 && users_room.findIndex(usr => usr.uid == obj.player) == -1){

										request.post({url: HOST + '/ajax/nodejs/winnerGame.php', form: {id: This.id, winner: 'host'}}, function(err,httpResponse,body){

											if(body != '0'){

												io.sockets.in('room_' + This.id).emit('endGame', {winner: 'host'});

												if(rooms_process.findIndex(rmp => rmp.id == This.id) != -1){

													rooms_process.splice(rooms_process.findIndex(rmp => rmp.id == This.id), 1);

												}

												// console.log('io.sockets.in host');

											}

										});

									}else if(users_room.findIndex(usr => usr.uid == obj.host) == -1 && users_room.findIndex(usr => usr.uid == obj.player) == -1){

										request.post({url: HOST + '/ajax/nodejs/closeGame.php', form: {id: This.id}}, function(err,httpResponse,body){

											if(body != '0'){

												io.sockets.in('room_' + This.id).emit('endGame', {winner: 'none'});
												if(rooms_process.findIndex(rmp => rmp.id == This.id) != -1){

													rooms_process.splice(rooms_process.findIndex(rmp => rmp.id == This.id), 1);

												}

											}

										});

									}else if(users_room.findIndex(usr => usr.uid == obj.host) != -1 && users_room.findIndex(usr => usr.uid == obj.player) != -1){
										
										This.startGame();

									}

								}, 3500, This);

							}});

							rooms_process[rooms_process.findIndex(ros => ros.id == thisRoom.idRoom)].functionTimeout();


							// rooms_process[rooms_process.findIndex(ues => ues.idRoom == thisRoom.idRoom)].timeoutFunc = setTimeout(function(obj){console.log(obj)}, 5500, rooms_process[rooms_process.findIndex(ues => ues.idRoom == thisRoom.idRoom)]);
							// rooms_process[rooms_process.findIndex(ues => ues.idRoom == thisRoom.idRoom)].qwe = 54;
							// console.log(rooms_process[rooms_process.findIndex(ues => ues.idRoom == thisRoom.idRoom)].qwe);
							// rooms_process[rooms_process.findIndex(ues => ues.idRoom == thisRoom.idRoom)].timeout = setTimeout(this.timeoutFunc(), 1000);
							// send connect to room   socket.emit();socket.broadcast.emit();
							// and create private room for players this game
							// and add string to database

						}

					})

				}else{

					socket.emit('msgErrorC', {textError: 'Вы не успели :('});

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

				item = users[users.findIndex(ues => ues.socketId == socket.id)] || users_room[users_room.findIndex(ues => ues.socketId == socket.id)];

				// console.log('================');
				// console.log('item');
				// console.log('================');
				// console.log(item);

				

				if(rooms.findIndex(ros => ros.hostUid == item.uid) != -1){

					request.post({url: HOST + '/ajax/nodejs/delLobbie.php', form: {uid: item.uid}}, function(err,httpResponse,body){});
					socket.broadcast.emit('deleteRoomC', {id: rooms[rooms.findIndex(ros => ros.hostUid == item.uid)].idRoom})
					// socket.emit('deleteRoomC', {id: rooms[rooms.findIndex(ros => ros.hostUid == item.uid)].idRoom})
					// users[users.findIndex(ues => ues.socketId == socket.id)].betRoom = 0;
					rooms.splice(rooms.findIndex(ros => ros.hostUid == item.uid), 1);
							
				}

				if('inRoomID' in item == true){

					// console.log('inRoomID in item == true');

					if(users_room.findIndex(ues => ues.socketId == socket.id) != -1){

						// console.log('users_room.findIndex(ues => ues.socketId == socket.id) != -1');

						var item = users_room[users_room.findIndex(ues => ues.socketId == socket.id)];

						if(rooms_process.findIndex(rps => rps.id == item.inRoomID) != -1){

							// console.log('rooms_process.findIndex(rps => rps.id == item.inRoomID) != -1');

							var itemRoom = rooms_process[rooms_process.findIndex(rps => rps.id == item.inRoomID)];

							if(itemRoom.host == item.uid){

								// console.log('itemRoom.host == item.uid');

								request.post({url: HOST + '/ajax/nodejs/winnerGame.php', form: {id: itemRoom.id, winner: 'player'}}, function(err,httpResponse,body){

									if(body != '0'){

										io.sockets.in('room_' + itemRoom.id).emit('endGame', {winner: 'player'});
										// console.log('io.sockets.in(room_ + itemRoom.id).emit(endGame, {winner: player});');

										// console.log('room_' + itemRoom.id);

									}

								});

							}else if(itemRoom.player == item.uid){

								// console.log('itemRoom.player == item.uid');

								request.post({url: HOST + '/ajax/nodejs/winnerGame.php', form: {id: itemRoom.id, winner: 'host'}}, function(err,httpResponse,body){

									if(body != '0'){

										io.sockets.in('room_' + itemRoom.id).emit('endGame', {winner: 'host'});
										// console.log('io.sockets.in(room_ + itemRoom.id).emit(endGame, {winner: host});');

										// console.log('room_' + itemRoom.id);
									}

								});

							}

							rooms_process.splice(rooms_process.findIndex(rps => rps.id == item.inRoomID), 1);

						}
						users_room.splice(users_room.findIndex(ues => ues.socketId == socket.id), 1);

					}

				}else{

					if(users.findIndex(ues => ues.socketId == socket.id) != -1){

						users.splice(users.findIndex(ues => ues.socketId == socket.id), 1);

					}

				}

					
	
				
				
			}else{

				notJoin.splice(notJoin.findIndex(nj => nj.id == socket.id), 1);

			}

		})

// ===============================    ROOMS    ==============================================


		socket.on('joinRoom', function(data){

			if(data.token != '' && data.rid != ''){

				var sToken = ecran(data.token);

				request.post({url: HOST + '/ajax/nodejs/messages.php', form: {token: sToken}}, function(err,httpResponse,body){

					if(body != 0){

						var joinJson = JSON.parse(body);

						users_room.push({socketId: socket.id ,token: sToken, uid: joinJson.uid, inRoomID: data.rid});
						notJoin.splice(notJoin.findIndex(nj => nj.id == socket.id), 1);
						socket.join(joinJson.uid);
						socket.join('room_' + data.rid);

						// console.log('connect to ==  room_' + data.rid);

					}

				});

			}

		});

		socket.on('strokeGame', function(data){

			item = users_room[users_room.findIndex(ues => ues.socketId == socket.id)];
			if(rooms_process[rooms_process.findIndex(rps => rps.id == item.inRoomID)] != -1){

				itemRoom = rooms_process[rooms_process.findIndex(rps => rps.id == item.inRoomID)];

				if(item.uid == itemRoom.host){

					if(rooms_process[rooms_process.findIndex(rps => rps.id == item.inRoomID)].strokeHost == 0){

						rooms_process[rooms_process.findIndex(rps => rps.id == item.inRoomID)].strokeHost = data.item;

						// send in room replace card host
						io.sockets.in('room_' + itemRoom.id).emit('stroke', {who: 'host'});

						if(rooms_process[rooms_process.findIndex(rps => rps.id == item.inRoomID)].strokePlayer != 0){

							rooms_process[rooms_process.findIndex(rps => rps.id == item.inRoomID)].findWinner();

							console.log('player - ' + rooms_process[rooms_process.findIndex(rps => rps.id == item.inRoomID)].scorePlayer + ':' + rooms_process[rooms_process.findIndex(rps => rps.id == item.inRoomID)].scoreHost + ' - host');

						}

					}else{

						socket.emit('msgErrorC', {textError: 'Вы уже сходили!'});

					}

				}else if(item.uid == itemRoom.player){

					if(rooms_process[rooms_process.findIndex(rps => rps.id == item.inRoomID)].strokePlayer == 0){

						rooms_process[rooms_process.findIndex(rps => rps.id == item.inRoomID)].strokePlayer = data.item;

						// send in room replace card player
						io.sockets.in('room_' + itemRoom.id).emit('stroke', {who: 'player'});

						if(rooms_process[rooms_process.findIndex(rps => rps.id == item.inRoomID)].strokeHost != 0){

							rooms_process[rooms_process.findIndex(rps => rps.id == item.inRoomID)].findWinner();

							console.log('player - ' + rooms_process[rooms_process.findIndex(rps => rps.id == item.inRoomID)].scorePlayer + ':' + rooms_process[rooms_process.findIndex(rps => rps.id == item.inRoomID)].scoreHost + ' - host');

						}	

					}else{

						socket.emit('msgErrorC', {textError: 'Вы уже сходили!'});

					}

				}

			}

		})

	});

