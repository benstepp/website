var React = require('react');
var assign = require('object-assign');

var Navbar = require('./components/common/navbar.jsx');
var OptionsPanel = require('./components/kadala-options/options-panel.jsx');
var KadalaStore = require('./components/kadala-store/kadala-store.jsx');
var Inventory = require('./components/inventory/inventory.jsx');
var IndividualItem = require('./components/individual-item/individual-item.jsx');
var Visualization = require('./components/visualization/visualization.jsx');
var Footer = require('./components/common/footer.jsx');

var AppStore = require('./stores/AppStore.js');

var Application = React.createClass({
	getInitialState:function() {
		return assign({},AppStore.getSettings(),AppStore.getLifetime());
	},
	componentDidMount: function() {
		AppStore.addChangeListener(this._onChange);

		//opacity on loader for the nice fade effect via css transition
		var loader = document.getElementById('loading');
		loader.style.opacity = '0';

		//display none so we can click through it as pointer-events is buggy
		window.setTimeout(function() {
			loader.style.display = 'none';
		},1000);
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
		var vis;

		if (this.state.mobile) {
			individualItem = <IndividualItem />
		}
		else {
			inventory = <Inventory />
			vis = <Visualization
					lifetime={this.state.lifetime}
					legCount={this.state.legCount}
					rarityCount={this.state.rarityCount}
					currentClass={this.state.dClass}
					slot={this.state.item.type}
					/>
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

					{vis}

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