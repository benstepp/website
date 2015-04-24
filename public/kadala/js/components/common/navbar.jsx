var React = require('react');
var d3sim = require('d3sim');

var AppActions = require('../../actions/AppActions.js');
var AppStore = require('../../stores/AppStore.js');

var Navbar = React.createClass({
	getInitialState:function() {
		return AppStore.getSettings();
	},
	buyItem:function() {
		var item = d3sim.kadalaRoll(this.state.item.type);
		item.size = this.state.item.size;
		AppActions.addItem(item);
		AppActions.incrementShards(this.state.item.type,this.state.item.cost);
	},

	toggleOptions:function() {
		AppActions.toggleOptions();
	},
	toggleStore:function() {
		AppActions.toggleStore();
	},

	componentDidMount: function() {
		AppStore.addChangeListener(this._onChange);
	},
	componentWillUnmount: function() {
		AppStore.removeChangeListener(this._onChange);
	},
	_onChange:function() {
		this.setState(AppStore.getSettings());
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
				<h1><a href='/kadala/'>Kadala Simulator</a></h1>
				<button className='buy' onClick={this.buyItem}>{this.state.item.text}</button>
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