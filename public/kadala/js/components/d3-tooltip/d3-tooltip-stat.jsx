var D3ItemTooltipStat= React.createClass({

	render: function() {

		var text;

		text = <p><span className="value">+{this.props.value}</span> {this.props.name}</p>;

		return (

			<li className="d3-color-blue d3-item-property-default">
				{text}
			</li>

		);

	}

});