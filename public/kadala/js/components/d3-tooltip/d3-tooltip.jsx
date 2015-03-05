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