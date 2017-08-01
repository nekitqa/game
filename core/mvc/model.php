<?php

	class Model
	{
		public function __construct()
		{
			try{
				$this->connection = new PDO('mysql:dbname='.DBNAME.';host='.MYSQLHOST.'', MYSQLUSER, MYSQLPASSWORD);
			}catch(PDOException $e) {
				die('Подключение не удалось: ' . $e->getMessage());
			}
		}


		/*
			Модель обычно включает методы выборки данных, это могут быть:
				> методы нативных библиотек pgsql или mysql;
				> методы библиотек, реализующих абстракицю данных. Например, методы библиотеки PEAR MDB2;
				> методы ORM;
				> методы для работы с NoSQL;
				> и др.
		*/

		// метод выборки данных
		public function get_data()
		{
			// todo
		}
	}

?>