var React = require('react');
var PieChart = require('../../../../../node_modules/react-d3-components/lib/PieChart');

var ShardCountByClass = React.createClass({
	render:function() {

		var colorScale = function(a) {
			var colorMap = {
				Barbarian:'#b52615',
				Crusader:'#ccc',
				'Demon Hunter':'#735289',
				Monk:'#e5d34d',
				'Witch Doctor':'#46c230',
				Wizard:'#5fc6e5'
			};
			return colorMap[a] || '#111';
		};

		return(
			<div className='vis-center'>
				<PieChart 
					data={this.props.data}
					height={this.props.height}
					width={this.props.width}
					title='Shards Spent By Class'
					colorScale={colorScale}
				/>
			</div>
		);
	}
});

module.exports = ShardCountByClass;