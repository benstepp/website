var React = require('react');

var Navbar = require('./components/nav/navbar.jsx');
var OptionsPanel = require('./components/kadala-options/options-panel.jsx');
var KadalaStore = require('./components/kadala-store/kadala-store.jsx');
var Inventory = require('./components/inventory/inventory.jsx');
var IndividualItem = require('./components/individual-item/individual-item.jsx');

var AppStore = require('./stores/AppStore.js');

var Application = React.createClass({
	getInitialState:function() {

		var mobile = this.mobileCheck();
		//add a listner to the resize event
		window.onresize = this.mobileCheck;

		return {
			mobile:mobile
		}
	},

	mobileCheck:function() {
		var mobile = (window.innerWidth <= 768);

		//if the app is mounted (has a state) and they are different set it
		if (this.isMounted() && mobile !== this.state.mobile) {
			this.setState({
				mobile:mobile
			});
		}

		//boolean based on bootstrap breakpoint of 768px
		return mobile;
	},

	render:function() {

		//conditionally render either the inventory or individual item based on screen size
		var inventory;
		var individualItem;
		if (this.state.mobile) {
			individualItem = <IndividualItem />
		}
		else {
			inventory = <Inventory />
		}

		return (
			<div>
			<Navbar mobile={this.state.mobile} />
			<div className='container-fluid'>
				<div className='row'>
					<div className='col-sm-3'>
						<OptionsPanel />
					</div>
					<div className='col-sm-9'>
						<KadalaStore />
						{inventory}
					</div>
				</div>
				<div className='row'>
					<div className='col-sm-12'>
						{individualItem}
					</div>
				</div>
			</div>
			</div>
		);
	}
});

React.render(
	<Application />,
	document.getElementById('app')
);