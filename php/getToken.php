<?php
try {
    $oauth = new OAuth('709be1fe692639c','fd29e664fe1a10a0bdc70f82f884a24853a2b69c',OAUTH_SIG_METHOD_HMACSHA1,'https://api.imgur.com/oauth2/authorize');

/* Uncomment the line below to get lots of debug */
    //$oauth->enableDebug();

    $request_token_info = $oauth->getRequestToken('https://api.imgur.com/oauth2/token');

    printf("I think I got a valid request token, navigate your www client to:\n\n%s?oauth_token=%s\n\nOnce you finish authorizing, hit ENTER or INTERRUPT to exit\n\n", TWITTER_AUTHORIZE_URL, $request_token_info["oauth_token"]);
    
    $in = fopen("php://stdin", "r");
	fgets($in, 255);

    printf("Grabbing an access token...\n");

    /* grab the access token, which is your persistent token which you use for future requests */
    $oauth->setToken($request_token_info["oauth_token"],$request_token_info["oauth_token_secret"]);
    $access_token_info = $oauth->getAccessToken('https://api.imgur.com/oauth2/token');

	printf("Access token: %s\n",$access_token_info["oauth_token"]);
    printf("Access token secret: %s\n",$access_token_info["oauth_token_secret"]);

    //printf("Fetching the public timeline JSON via %s\n",TWITTER_PUBLIC_TIMELINE_API);
    $oauth->setToken($access_token_info["oauth_token"],$access_token_info["oauth_token_secret"]);
    //$oauth->fetch(TWITTER_PUBLIC_TIMELINE_API);

    /* from this point on OAuth is over, now handling the JSON response is in order */
    $json = json_decode($oauth->getLastResponse());
    printf("An item in the decoded JSON: %s\n",print_r($json[0],true));

} catch(OAuthException $E) {
    print_r($E);
}


?>