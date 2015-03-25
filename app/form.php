<?php
    header("Content-type: text/html; charset=utf-8");
	$form_id = $_GET['form_id'];
	$id_whitelist = array(
        '8PN3GF',
        'd7vq7C',
		'tEZB6h',
    );

    $postFields = '';

	foreach($_GET as $key => $value){
        if(startWith($key, 'field')) {
            $postFields .= "$key=$value&";
        }
	}

    if(!in_array($form_id, $id_whitelist)) {
        echo '{"error":"表格ID错误", "code":"401"}';
        exit();
    }

    if((!$postFields)) {
        echo '{"error":"推送数据为空", "code":"402"}';
        exit();
    }

    $postFields = substr($postFields, 0, strlen($postFields)-1);

	$url = "https://jinshuju.net/api/v1/forms/$form_id";

    //认证
    $auth_name = "HU8iFVwTDkBKGU1BK42Mfw";
    $auth_pass = "U9MAxOdCxSdruSHmXXVXLQ";

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_POST,true);
	curl_setopt($ch, CURLOPT_USERPWD, $auth_name.':'.$auth_pass);
	curl_setopt($ch, CURLOPT_POSTFIELDS,$postFields);
//    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	$result = curl_exec($ch);

	curl_close($ch);



    function startWith($str, $subStr) {
        return strpos($str, $subStr) === 0;
    }

	function p($r)
	{
		if (function_exists('xdebug_var_dump')) {
		    echo '<pre>';
		    xdebug_var_dump($r);
		    echo '</pre>';
		    //(new \Phalcon\Debug\Dump())->dump($r, true);
		} else {
		    echo '<pre>';
		    var_dump($r);
		    echo '</pre>';
		}
	}

	/**
	 * 打印指定的变量并结束程序运行
	 *
	 * @param $r
	 */
	function dd($r)
	{
		p($r);
		exit();
	}
?>
