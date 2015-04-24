var React = require('react');

var Navbar = require('./components/common/navbar.jsx');
var OptionsPanel = require('./components/kadala-options/options-panel.jsx');
var KadalaStore = require('./components/kadala-store/kadala-store.jsx');
var Inventory = require('./components/inventory/inventory.jsx');
var IndividualItem = require('./components/individual-item/individual-item.jsx');
var Footer = require('./components/common/footer.jsx');

var AppStore = require('./stores/AppStore.js');

var Application = React.createClass({
	getInitialState:function() {
		return AppStore.getSettings();
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
							<KadalaStore/>
							{inventory}
						</div>
					</div>
					<div className='row'>
						<div className='col-sm-12'>
							{individualItem}
						</div>
					</div>
				</div>
				<Footer />
			</div>
		);
	}
});

React.render(
	<Application />,
	document.getElementById('app')
);