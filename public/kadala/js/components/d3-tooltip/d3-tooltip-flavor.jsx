var React = require('react');

var D3ItemTooltipFlavor = React.createClass({
	render:function() {
		return (
			<div className='tooltip-extension'>
				<div className='flavor'>{this.props.flavor}</div>
			</div>
		);
	}
});

module.exports = D3ItemTooltipFlavor;