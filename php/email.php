<?php

function sendMail($to,$user,$password){			
	// subject
	$subject = 'Welcome to Lexicon (On-lingua)';
	
	// message
	$message = '
	<html>
	<head>
	  <title>Welcome to Lexicon</title>
	</head>
	<body>
	 <div>
	 	<h1>
	  		<img src="http://82.165.171.36/lexicon/img/On-lingua_web_peque.png" />
	  	</h1>
	  <p>Estamos muy agradecidos de que haya decidido registrarse!</p>
	  <p>Sus datos son:</p>
	  <ul>
	  	<li>Nombre de usuario: '.$user.'</li>
	  	<li>Contraseña: '.$password.'</li>
	  </ul>	
	 </div>		  
	</body>
	</html>
	';
	
	// To send HTML mail, the Content-type header must be set
	$headers  = 'MIME-Version: 1.0' . "\r\n";
	$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
	
	// Additional headers
	$headers .= 'From: Info Lexicon <info.lexicon@on-lingua.org>' . "\r\n";
	$headers .= 'Bcc: joyr@bixo.org' . "\r\n";
	
	// Mail it
	mail($to, $subject, $message, $headers);
}
?>