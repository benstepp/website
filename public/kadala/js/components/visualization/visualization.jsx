var React = require('react');

var AppStore = require('../../stores/AppStore');
var ShardCountByClass = require('./shard-count-by-class.jsx');

var Visualization = React.createClass({
	render:function() {

		//determine screen width to base the size of visualizations on
		var width = (window.innerWidth/2) - 20;

		var classes = ['Barbarian','Crusader','Demon Hunter','Monk','Witch Doctor','Wizard'];
		var totalShards = 0;
		var shardsByClass = {
			label:'Shards Spent',
			values:[]
		};
		for (var i=0;i < 7; i++) {
			var dClass = classes[i];
			//initialize the class count
			var byClass = {};
			byClass.x = dClass;
			byClass.y = 0;
			for (var slot in this.props.lifetime[dClass]) {
				//add to total and class count
				totalShards+= this.props.lifetime[dClass][slot];
				byClass.y+= this.props.lifetime[dClass][slot];
			}
			shardsByClass.values.push(byClass);
		}

		//initilize the total count for legendaries and set items
		var totals = {
			Legendary:0,
			Set:0,
			Ancient:0,
			'Ancient Set':0
		};
		for(var i=0;i < 7; i++) {
			var dClass_ = classes[i];

			for (var slot in this.props.rarityCount[dClass_]) {
				var slotData = this.props.rarityCount[dClass_][slot];
				//add to total leg type  counts
				if (slotData.hasOwnProperty('legendary')) {
					totals.Legendary+= slotData.legendary;
				}
				if (slotData.hasOwnProperty('set')) {
					totals.Set+= slotData.set;
				}
				if (slotData.hasOwnProperty('ancient')) {
					totals.Ancient+= slotData.ancient;
				}
				if (slotData.hasOwnProperty('ancientset')) {
					totals['Ancient Set']+= slotData.ancientset;
				}
			}
		}

		var legCounts = [];
		var legCountKey = 0;
		for (var key in totals) {
			if (totals[key] > 0) {
				legCounts.push(<li key={legCountKey}>{totals[key]} <span className={key.toLowerCase().replace(' ','')}>{key}</span> items</li>);
				legCountKey++;
			}
		}


		return (
			<div className='vis'>

				<div className='row'>
					<div className='col-md-8 col-md-offset-2'>
						<h1 className='vis-center'>You have spent a total of <span className='d3-color-purple'>{totalShards}</span> Blood Shards</h1>
						<ShardCountByClass 
							data={shardsByClass}
							width={width}
							height={width}
						/>
					</div>
				</div>

				<div className='row'>
					<div className='col-md-4'>
						
					</div>
					<div className='col-md-4'>
						
					</div>
				</div>

				<div className='row'>
					<div className='col-md-4 col-md-offset-2'>
						<h2>You have found a total of:</h2>
						<ul>
							{legCounts}
						</ul>
					</div>
					<div className='col-md-4'>
						
					</div>
				</div>

				<div className='row'>
					<div className='col-md-12'></div>
				</div>
			</div>
		);
	}
});

module.exports = Visualization;