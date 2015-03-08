var React = require('react'),
	D3ItemTooltipArmor = React.createClass({

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