var React = require('react');

var Navbar = React.createClass({
	getInitialState:function() {
		return {
			options:false,
			store:false
		};
	},
	toggleOptions:function() {
		//toggle the option panel and the state
		document.getElementById('options-panel').style.display = (this.state.options)? 'none':'block';
		this.setState({options:!this.state.options});
	},
	toggleStore:function() {
		document.getElementById('kadala-store').style.display = (this.state.store)? 'none':'block';
		this.setState({store:!this.state.store});
	},
	render:function() {
		return(
			<nav>
				<button className='ham' onClick={this.toggleOptions}>
					{/*From Material Design icons by Google (CC by 4.0)*/}
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
						<path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
					</svg>
				</button>
				<h1>Kadala Simulator</h1>
				<button className='buy'>Buy more Shit</button>
				<button className='shop' onClick={this.toggleStore}>
					{/*From Material Design icons by Google (CC by 4.0)*/}
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
						<path d="M16 6V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H2v13c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6h-6zm-6-2h4v2h-4V4zM9 18V9l7.5 4L9 18z"/>
					</svg>
				</button>
			</nav>
		);
	}
});

module.exports = Navbar;