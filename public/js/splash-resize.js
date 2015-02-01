(function() {
	var splashImage = document.querySelector('.splash-image');
	var winHeight = window.innerHeight;

	window.addEventListener('scroll',scaleImage);

	function scaleImage() {
		//pageYOffset for Internet Explorer
		var scrollDistance = window.scrollY || window.pageYOffset;

		//return quickly if we are past the splash screen
		if (scrollDistance > winHeight) {
			return;
		}
		else {
			//(max percent to scale/max height) = (current percent to scale/current height)
			//then subtract from 1 to get transform number
			var percentage = 1-(0.05/winHeight)*scrollDistance;
			splashImage.style.transform = 'scale('+percentage+')';
		}
	}


})();