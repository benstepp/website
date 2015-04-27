var React = require('react');

var D3ItemTooltipArmor = React.createClass({

	propTypes:{
		armor:React.PropTypes.number
	},

	render: function() {
		return (
			<ul className="item-armor-weapon item-armor-armor">
				<li className="big"><p><span className="value">{this.props.armor}</span></p></li>
				<li>Armor</li>
			</ul>
		);
	}
});

module.exports = D3ItemTooltipArmor;