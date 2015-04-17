var React = require('react');

var D3ItemTooltip = require('./components/d3-tooltip/d3-tooltip.jsx');
var OptionsPanel = require('./components/kadala-options/options-panel.jsx');
var Inventory = require('./components/inventory/inventory.jsx');

React.render(
	<OptionsPanel />,
	document.getElementById('options-panel')
);
React.render(
	<Inventory />,
	document.getElementById('inventory')
);