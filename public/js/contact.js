(function() {
	'use-strict';

	var form = document.getElementById('contact');
	var formMask = document.getElementById('form-mask');

	//collects the form data and puts into json
	function submitForm() {
		var elems = form.elements;
		var elemsLength = elems.length;
		var formData = {};

		for (var i =0;i < elemsLength;i++) {
			var element = elems[i];
			if (element.name && element.name.length >0) {
				formData[element.name] = element.value;
			}
		}

		maskForm();
		apiRequest(formData);
	}

	function maskForm() {
		document.getElementById('say-hello').style.visibility = 'hidden';
		formMask.className = 'active';
	}

	function success() {
		//green form mask
		formMask.className+=' success';
		var header = formMask.getElementsByTagName('h3')[0].childNodes[0];

		var interval = window.setInterval(function() {
			if (header.nodeValue.length > 3) {
				header.nodeValue = header.nodeValue.slice(0,-1);
			}
			else {
				header.nodeValue +='t';
				clearInterval(interval);
			}
		},80);

	}

	function error(code) {
		//red form mask
		formMask.className+= ' error';
		var er = document.getElementById('error');
		er.style.display = 'block';

		var header = formMask.getElementsByTagName('h3')[0].childNodes[0].nodeValue = 'Error';

		//error code and not a message
		if (code && code.toString().length === 1) {
			er.childNodes[0].nodeValue = (code = 1)? 'The is a problem between our server and the email service.':'There is a problem between you and the server.';
		}
		else if(code) {
			er.childNodes[0].nodeValue = code;
		}
		//otherwise default error message shows up because it is no longer hidden

		//add event handler for clicking anywhere on the error message to hide it
		//but wait a second so users dont hide it before it appears
		window.setTimeout(function() {
			formMask.addEventListener('click',hideError);
		},1000);

		function hideError() {
			formMask.className = 'error';
			document.getElementById('say-hello').style.visibility = 'visible';

			//wait a second for the mask to hide then change content
			window.setTimeout(function() {
				formMask.className = ''; //remove class for default color
				er.childNodes[0].nodeValue = 'ErrorMessage'; //default error
				formMask.getElementsByTagName('h3')[0].childNodes[0].nodeValue = 'Sending Message'; //default sending text
			},1000);
		}
	}

	function apiRequest(data) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState === 4) {
				if(xmlhttp.status === 200) {
					success();
				}
				else {
					//either the error code from server or a 2 for something wrong in between
					error(JSON.parse(xmlhttp.responseText).error || 2);
				}
			}
		};
		xmlhttp.open('POST','api/contact/email',true);
		xmlhttp.setRequestHeader('content-type','application/json');
		xmlhttp.send(JSON.stringify(data));
	}

	function init() {
		//adds functionality to form submit
		form.addEventListener('submit',function(event) {
			event.preventDefault();
			submitForm();
		});
	}

	document.addEventListener('DOMContentLoaded',init);

})();