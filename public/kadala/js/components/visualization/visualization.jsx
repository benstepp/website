var React = require('react');

var AppStore = require('../../stores/AppStore');
var ShardCountByClass = require('./shard-count-by-class.jsx');

//o dear god refacor this when im not tired
var Visualization = React.createClass({
	render:function() {

		//determine screen width to base the size of visualizations on
		var width = (window.innerWidth*0.3) - 30;

		var classes = ['Barbarian','Crusader','Demon Hunter','Monk','Witch Doctor','Wizard'];
		var totalShards = 0;
		var shardsByClass = {
			label:'Shards Spent',
			values:[]
		};
		var classList = [];
		for (var i=0;i < 6; i++) {
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
			classList.push(<li>{byClass.y} on <span className={byClass.x.toLowerCase().replace(' ','')}>{byClass.x}</span></li>);
			shardsByClass.values.push(byClass);
		}

		//initilize the total count for legendaries and set items
		var totals = {
			Magic:0,
			Rare:0,
			Legendary:0,
			Set:0,
			Ancient:0,
			'Ancient Set':0
		};
		for(var i=0;i < 6; i++) {
			var dClass_ = classes[i];

			for (var slot in this.props.rarityCount[dClass_]) {
				var slotData = this.props.rarityCount[dClass_][slot];
				if (slotData.hasOwnProperty('magic')) {
					totals.Magic+= slotData.magic;
				}
				if (slotData.hasOwnProperty('rare')) {
					totals.Rare+= slotData.rare;
				}
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

		var legDataNoClassSpec = {};
		for (var i=0;i < 6;i++) {
			var dClass__ = classes[i];
			for (var slot in this.props.legCount[dClass__]) {
				for (var leg in this.props.legCount[dClass__][slot]) {
					for (var rarity in this.props.legCount[dClass__][slot][leg]) {
						legDataNoClassSpec[leg] = legDataNoClassSpec[leg] || {};
						legDataNoClassSpec[leg][rarity] = (legDataNoClassSpec[leg][rarity]) ?legDataNoClassSpec[leg][rarity] +this.props.legCount[dClass__][slot][leg][rarity] :this.props.legCount[dClass__][slot][leg][rarity];
					}
				}
			}
		}

		var highestLeg;
		var highestAnc;
		var highestSet;
		var highestAncSet;
		for (var legendary in legDataNoClassSpec) {
			var legData = legDataNoClassSpec[legendary];
			//first check if one has not been found yet
			if (legData.hasOwnProperty('legendary')) {
				highestLeg = (typeof highestLeg === 'undefined' || (legDataNoClassSpec[highestLeg].legendary < legDataNoClassSpec[legendary].legendary)) ? legendary : highestLeg;
			}
			if (legData.hasOwnProperty('ancient')) {
				highestAnc = (typeof highestAnc === 'undefined' || (legDataNoClassSpec[highestAnc].ancient < legDataNoClassSpec[legendary].ancient)) ? legendary : highestAnc;
			}
			if (legData.hasOwnProperty('set')) {
				highestSet = (typeof highestSet === 'undefined' || (legDataNoClassSpec[highestSet].set < legDataNoClassSpec[legendary].set)) ? legendary : highestSet;
			}
			if (legData.hasOwnProperty('ancientset')) {
				highestAncSet = (typeof highestAncSet === 'undefined' || (legDataNoClassSpec[highestAncSet].ancientset < legDataNoClassSpec[legendary].ancientset)) ? legendary : highestAncSet;
			}
		}

		var highestLegendary = ((legDataNoClassSpec[highestLeg].legendary > legDataNoClassSpec[highestSet].set) || typeof highestSet ==='undefined') ? highestLeg :highestSet;
		var highestAncient = ((legDataNoClassSpec[highestAnc].ancient > legDataNoClassSpec[highestAncSet].ancientset || typeof highestAncient === 'undefined')) ? highestAnc:highestAncSet;
		var highestLegendaryCount = legDataNoClassSpec[highestLegendary].legendary || legDataNoClassSpec[highestLegendary].set;
		var highestAncientCount = legDataNoClassSpec[highestAncient].ancient || legDataNoClassSpec[highestAncient].ancientset;

		var highLegClass = (legDataNoClassSpec[highestLegendary].legendary) ? 'legendary' : 'set';
		var highAncClass = (legDataNoClassSpec[highestAncient].ancient) ? 'ancient' : 'ancientset';

		return (
			<div className='vis'>

				<div className='row'>
					<div className='col-md-12'>
						<h1 className='vis-center'>You have gambled a total of <span className='d3-color-purple'>{totalShards}</span> Blood Shards</h1>
					</div>
				</div>

				<div className='row'>
					<div className='col-md-4 col-md-offset-2'>
						<ul>
							{classList}
						</ul>
					</div>
					<div className='col-md-4'>
						<ShardCountByClass 
							data={shardsByClass}
							width={width}
							height={width}
						/>
					</div>
				</div>

				<div className='vis-rule'></div>

				<div className='row'>
					<div className='col-md-6 col-md-offset-3'>
						<ul>
							<li><h2>You have found a total of:</h2></li>
							{legCounts}
						</ul>
					</div>
				</div>

				<div className='vis-rule'></div>

				<div className='row'>
					<div className='col-md-12'>
						<h1 className='vis-center'>You have seen <span className={highLegClass}>{highestLegendary}</span> more than any other Legendary item at {highestLegendaryCount} times</h1>
						<h1 className='vis-center'>You have seen <span className={highAncClass}>{highestAncient}</span> more than any other Ancient item at at {highestAncientCount} times</h1>
					</div>
				</div>

				<div className='vis-rule'></div>

				<div className='row'>
					<div className='col-md-12'>
						<p className='vis-center'>More data and visualization fixes coming soon. Every click is already being saved to your browser's local storage</p>
					</div>
				</div>

			</div>
		);
	}
});

module.exports = Visualization;