<?php
session_start();
$client_id = "709be1fe692639c";

$image = file_get_contents($_FILES['image']['tmp_name']);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.imgur.com/3/image.json');
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($ch, CURLOPT_POST, TRUE);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($ch, CURLOPT_HTTPHEADER, array( 'Authorization: Client-ID ' . $client_id ));
curl_setopt($ch, CURLOPT_POSTFIELDS, array( 'image' => base64_encode($image)));

$reply = curl_exec($ch);

curl_close($ch);
if($_SESSION['role']>1){
    require_once('db.php');
    $reply2 = json_decode($reply);
    $query="INSERT INTO img (id_img,img,deletehash,width,height) VALUES ('".$reply2->data->id."','".$reply2->data->link."','".$reply2->data->deletehash."',".$reply2->data->width.",".$reply2->data->height.")";
    mysql_query($query);
}
echo $reply;

?>