var React = require('react'),

	D3ItemTooltipHead = require('./d3-tooltip-head.jsx'),
	D3ItemTooltipBody = require('./d3-tooltip-body.jsx');


var D3ItemTooltip = React.createClass({
	render: function() {

		return (
			<div className="tooltip-content">
				<div className="d3-tooltip d3-tooltip-item">
					<D3ItemTooltipHead item={this.props.item} />
					<D3ItemTooltipBody item={this.props.item} />
				</div>
			</div>
		);

	}
});

module.exports = D3ItemTooltip;