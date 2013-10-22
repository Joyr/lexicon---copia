<?php
	session_start();
	require_once '../db.php';
	$lang = $_POST['lang'];

	$query = "SELECT MD5(le.id),l.code, le.name
			FROM language l,levels le
			WHERE l.id=".$lang;
	$notions = mysql_query($query);
	print('<thead>
				<tr>
					<th>ID</th>
					<th data-priority="1">Langauge</th>
					<th>NAME</th>
				</tr>
			</thead>
			<tbody>
		');
	while($notion = mysql_fetch_array($notions)){
		print('<tr>
					<td><a href="#" class="info-lessons-units" title="Go to level '.$notion[2].'">'.$notion[0].'</a></td>
					<td>'.$notion[1].'</td>
					<td>'.$notion[2].'</td></tr>
			');
	}					  
	print('</tbody>');

?>