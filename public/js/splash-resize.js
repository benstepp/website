(function() {
	'use-strict';

	var splashImage = document.querySelector('.splash-image');
	var winHeight = window.innerHeight;

	//only on non-mobile devices. lots of scroll lag there
	if (window.innerWidth >= 768 ) {
		window.addEventListener('scroll',scaleImage);
	}

	function scaleImage() {
		//pageYOffset for Internet Explorer
		var scrollDistance = window.scrollY || window.pageYOffset;

		//only if we are scrolled within splash screen
		if (scrollDistance < winHeight) {
			//(max percent to scale/max height) = (current percent to scale/current height)
			//then subtract from 1 to get transform number
			var percentage = 1-(0.05/winHeight)*scrollDistance;
			splashImage.style.transform = 'scale('+percentage+')';
		}
	}

})();