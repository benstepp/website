var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var D3ItemTooltipHead = require('./d3-tooltip-head.jsx');
var D3ItemTooltipBody = require('./d3-tooltip-body.jsx');
var D3ItemTooltipFlavor = require('./d3-tooltip-flavor.jsx');

var D3ItemTooltip = React.createClass({

	propTypes:{
		item:React.PropTypes.object
	},

	mixins: [PureRenderMixin],

	render: function() {

		var tooltipClass ='d3-tooltip d3-tooltip-item';
		if (this.props.item.rarity === 'ancient') {
			tooltipClass+=' ancient'
		}

		//determine whether or not to add flavor
		var flavor;
		if (this.props.item.hasOwnProperty('flavor')) {
			flavor = <D3ItemTooltipFlavor flavor={this.props.item.flavor} />
		}

		return (
			<div className='tooltip-content'>
				<div className={tooltipClass}>
					<D3ItemTooltipHead color={this.props.item.color} name={this.props.item.name} />
					<D3ItemTooltipBody item={this.props.item} />
					{flavor}
				</div>
			</div>
		);
	}
});

module.exports = D3ItemTooltip;