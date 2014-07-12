 <?php

 function authorize()
  {
    $postdata = http_build_query($this->query);
    $opts = array('http' =>
        array(
            'method' => 'POST',
            'header' => 'Content-type: application/x-www-form-urlencoded',
            'content' => $postdata
        )
    );

    $context = stream_context_create($opts);

    $this->ticket = file_get_contents($this->server_auth, false, $context);
    $this->login();
  }

  function login()
  {
    $postdata = http_build_query(
        array(
            'ticket' => $this->ticket
        )
    );

    $opts = array('http' =>
        array(
            'method' => 'POST',
            'header' => 'Content-type: application/x-www-form-urlencoded',
            'content' => $postdata
        )
    );

    $result = file_get_contents($this->server . '/loginByTicket?os=iOS&osVersion=5.100000&vendor=Apple', false, $context);

    $cookies = array();
    foreach ($http_response_header as $hdr) {
      if (preg_match('/^Set-Cookie:\s*([^;]+)/', $hdr, $matches)) {
        parse_str($matches[1], $tmp);
        $cookies += $tmp;
      }
    }

    $this->cookie = $_SESSION['cookie'] = 'SESSIONID=' . $cookies['SESSIONID'];
    $this->authorized = true;
    $this->cookie;
  }

  ?>