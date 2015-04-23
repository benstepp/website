var React = require('react');

var D3ItemTooltipHead = React.createClass({
	render: function() {

		//initial class set for the tooltip head
		var divClass='tooltip-head';
		var h3Class='';

		//modify the classes if a color was passed
		//fallback color is handled by d3-tooltip css
		if (this.props.item.color) {
			divClass += ' tooltip-head-' + this.props.item.color;
			h3Class += 'd3-color-' + this.props.item.color;
		}
		//make the font smaller if the name is long
		if (this.props.item.name.length > 40) {
			h3Class+= ' smallest';
		}
		else if(this.props.item.name.length >22) {
			h3Class+= ' smaller';
		}

		return (
			<div className={divClass}>
				<h3 className={h3Class}>
					{this.props.item.name}
				</h3>
			</div>
		);

	}
});

module.exports = D3ItemTooltipHead;