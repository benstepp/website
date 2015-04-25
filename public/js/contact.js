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
		//apiRequest(formData);
	}

	function maskForm() {
		formMask.style.opacity = 1;
		formMask.style['pointer-events'] = 'auto';
	}

	function apiRequest(data) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readystate === 4 & xmlhttp.status === 200) {
			}
		};
		xmlhttp.open('POST','api/contact/email',true);
		xmlhttp.setRequestHeader('content-type','application/json');
		xmlhttp.send(JSON.stringify(data));
	}

	function init() {
		form.addEventListener('submit',function(event) {
			event.preventDefault();
			submitForm();
		});
	}

	document.addEventListener('DOMContentLoaded',init);

})();