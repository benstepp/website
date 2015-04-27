var React = require('react');

var D3ItemTooltipHead = React.createClass({

	propTypes:{
		color:React.PropTypes.string,
		name:React.PropTypes.string,
	},

	render: function() {

		//initial class set for the tooltip head
		var divClass='tooltip-head';
		var h3Class='';

		//modify the classes if a color was passed
		//fallback color is handled by d3-tooltip css
		if (this.props.color) {
			divClass += ' tooltip-head-' + this.props.color;
			h3Class += 'd3-color-' + this.props.color;
		}
		//make the font smaller if the name is long
		if (this.props.name.length > 40) {
			h3Class+= ' smallest';
		}
		else if(this.props.name.length >22) {
			h3Class+= ' smaller';
		}

		return (
			<div className={divClass}>
				<h3 className={h3Class}>
					{this.props.name}
				</h3>
			</div>
		);
	}
});

module.exports = D3ItemTooltipHead;