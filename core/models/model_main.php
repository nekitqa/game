<?php

	class Model_Main extends Model
	{
		
		public $auth;
		public $params;
		public $token;
		public $userInfo;
		
		public function get_data()
		{
			if(isset($_GET['code']) and !isset($_COOKIE['token'])){
				
				$this->params = array(
					'client_id' => CLIENTID,
					'client_secret' => CLIENTSECRET,
					'redirect_uri' => HOST,
					'code' => $_GET['code']
				);

				$this->token = json_decode(file_get_contents('https://oauth.vk.com/access_token?'.urldecode(http_build_query($this->params))), true);
				
				if(isset($this->token['access_token'])){

					$this->authorize();

					if($this->connection->query('SELECT * FROM `users` WHERE `uid` = '. $this->token['user_id'])->fetch(PDO::FETCH_ASSOC) == 0){

						$this->connection->query('INSERT INTO `users`(`uid`, `all`, `win`, `lose`, `balance`, `token`, `name`) VALUES ('.$this->token['user_id'].', 0, 0, 0, 500, "'.$this->token['access_token'].'", "")');

					}else{

						$this->connection->query('UPDATE `users` SET `token` = "'.$this->token['access_token'].'" WHERE `uid` = '.$this->token['user_id']);

					};

					header("Location: ".HOST);

				}



			}elseif(isset($_GET['code']) and isset($_COOKIE['token'])){

				header("Location: ".HOST);

			}elseif(isset($_COOKIE['token'])){

				$this->params = array(
					'uids' => $_COOKIE['uid'],
					'fields' => 'uid,first_name,last_name,screen_name,sex,bdate,photo_big',
					'access_token' => $_COOKIE['token']
				);

				$this->userInfo = json_decode(file_get_contents('https://api.vk.com/method/users.get?'.urldecode(http_build_query($this->params))), true);

				setcookie('image', $this->userInfo['response'][0]['photo_big'], time()+84600);

				$this->connection->query('UPDATE `users` SET `name` = "'.$this->userInfo['response'][0]['first_name'].'", `image` = "'.$this->userInfo['response'][0]['photo_big'].'" WHERE `uid` = '.$_COOKIE['uid']);

				$this->userInfo['BDInfo'] = $this->connection->query('SELECT * FROM `users` WHERE `uid` = '.$_COOKIE['uid'])->fetch(PDO::FETCH_ASSOC);
				
				$this->userInfo['Rooms'] = $this->connection->query('SELECT * FROM `rooms` WHERE `status` = "wait" ORDER BY `id` DESC');

				$this->userInfo['Chat'] = array_reverse($this->connection->query('SELECT * FROM `chat` ORDER BY `id` DESC LIMIT 50')->fetchAll(PDO::FETCH_ASSOC));


				return $this->userInfo;

			}elseif(!isset($_COOKIE['token'])){

				return array(
					'href' => 'http://oauth.vk.com/authorize?client_id='.CLIENTID.'&redirect_uri='.HOST.'&display=page&scope=friends&response_type=code',
					'arr' => $model_name
				);

			}
		}

		public function authorize(){

			setcookie('token', $this->token['access_token'], time()+84600);
			setcookie('uid', $this->token['user_id'], time()+84600);
			setcookie('image', $this->userInfo['response'][0]['photo_big'], time()+84600);

		}

		

	}

?>