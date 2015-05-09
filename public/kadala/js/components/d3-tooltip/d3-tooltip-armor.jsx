var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var D3ItemTooltipArmor = React.createClass({

	propTypes:{
		armor:React.PropTypes.number
	},

	mixins: [PureRenderMixin],

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