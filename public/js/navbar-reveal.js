(function() {
	var navbar = document.getElementsByTagName('nav')[0];
	var minHeight = window.innerHeight*0.75;
	var maxHeight = window.innerHeight - 50; //50 is navbar height
	var hidden;
	var shown;

	window.addEventListener('scroll',revealNavbar);

	function revealNavbar() {
		//pageYOffset for Internet Explorer
		var scrollDistance = window.scrollY || window.pageYOffset;

		//return if past header and shown
		if (scrollDistance > maxHeight && shown) {
			return;
		}
		//return if before threshold and hidden
		else if (scrollDistance < minHeight && hidden) {
			return;
		}
		//scroll distance is between the min and max height
		else {
			var opacity = (scrollDistance - minHeight)/(maxHeight - minHeight);

			//if less than 0 hide completely
			if(opacity <= 0) {
				hidden = true;
				shown = false;
				navbar.style.opacity = '0';
				navbar.style.display = 'none';
			}
			//if greater than 1 complete
			else if (opacity >= 1) {
				navbar.style.opacity = '1.0';
				navbar.style.position = 'fixed';
				navbar.style.display = 'block';
				navbar.style.top = '50px';
				navbar.style.left = '0';
				navbar.style.right = '0';
				shown = true;
				hidden = false;
			}
			//neither shown not complete
			else {
				shown = false;
				hidden = false;
				navbar.style.position = 'static';
				navbar.style.display = 'block';
				navbar.style.opacity = opacity;
			}
			
		}

	}


})();