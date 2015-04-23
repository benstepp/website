var React = require('react');

var Navbar = require('./components/nav/navbar.jsx');
var OptionsPanel = require('./components/kadala-options/options-panel.jsx');
var KadalaStore = require('./components/kadala-store/kadala-store.jsx');
var Inventory = require('./components/inventory/inventory.jsx');

var Application = React.createClass({
	render:function() {
		return (
			<div>
			<Navbar />
			<div className="container-fluid">
				<div className="row">
					<div className="col-sm-3">
						<OptionsPanel />
					</div>
					<div className="col-sm-9">
						<KadalaStore />
						<Inventory />
					</div>
				</div>
				<div className="row">
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