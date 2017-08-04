<?php

	class Model_Room extends Model
	{

		// public $issetGame;

		public function get_data(){

			if($this->roomInfo['host'] == $this->userinfo['uid']){

				$this->hostInfo = $this->userinfo;
				$this->playerInfo = $this->connection->query('SELECT * FROM `users` WHERE `uid` = '.$this->roomInfo['player'])->fetch(PDO::FETCH_ASSOC);

			}else{

				$this->playerInfo = $this->userinfo;
				$this->hostInfo = $this->connection->query('SELECT * FROM `users` WHERE `uid` = '.$this->roomInfo['host'])->fetch(PDO::FETCH_ASSOC);

			}
			
			// unset($this->userinfo['uid']);

			$this->info['roomInfo'] = $this->roomInfo;
			$this->info['playerInfo'] = $this->playerInfo;
			$this->info['hostInfo'] = $this->hostInfo;

			return($this->info);
			
		}

		public function issetGame()
		{

			$this->userinfo = $this->connection->query('SELECT * FROM `users` WHERE `token` = "'.$_COOKIE['token'].'"')->fetch(PDO::FETCH_ASSOC);
			
			$this->issetGame = $this->connection->query('SELECT * FROM `rooms` WHERE `host` = "'.$this->userinfo['uid'].'" AND `status` = "process" OR `player` = "'.$this->userinfo['uid'].'" AND `status` = "process"');
			

			if($this->issetGame->rowCount() == 1){

				$this->roomInfo = $this->issetGame->fetch(PDO::FETCH_ASSOC);

			}else{

				$this->issetGame = false;

			}

		}

	}

?>