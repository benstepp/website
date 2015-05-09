var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var D3ItemTooltipFlavor = React.createClass({

	propTypes:{
		flavor:React.PropTypes.string
	},

	mixins: [PureRenderMixin],

	render:function() {
		return (
			<div className='tooltip-extension'>
				<div className='flavor'>{this.props.flavor}</div>
			</div>
		);
	}
});

module.exports = D3ItemTooltipFlavor;