var React = require('react');

var Navbar = React.createClass({
	render:function() {
		return(
			<nav>
				<button className='ham'>ham</button>
				<h1>Kadala Simulator</h1>
				<button className='buy'>buy</button>
				<button className='shop'>shop</button>
			</nav>
		);
	}
});

module.exports = Navbar;