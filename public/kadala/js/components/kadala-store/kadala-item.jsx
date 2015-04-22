var React = require('react');
var d3sim = require('d3sim');

var AppActions = require('../../actions/AppActions');

var KadalaItem = React.createClass({

	getInitialState:function() {
		return {shardCount:0};
	},
	buyItem:function() {
		//increment the blood shard count
		var currentCount = this.state.shardCount;
		currentCount += this.props.item.cost;
		this.setState({shardCount:currentCount});

		var item = d3sim.kadalaRoll(this.props.item.type);
		item.size = this.props.item.size;
		AppActions.addItem(item);
	},
	resetCount:function() {
		this.setState({shardCount:0});
	},

	render:function() {
		return (
			<div className='kadala-item'>
				<button className='kadala' onClick={this.buyItem}>
					<img className='kadala-icon'/>
					<span>{this.props.item.cost}</span>
				</button>
				<div className='kadala-content'>
					<span className='kadala-item-title'>{this.props.item.text}</span>
					<span className='shard-count'>
						{this.state.shardCount}
						<a className='shard-delete' onClick={this.resetCount}>
							{/*From Material Design icons by Google (CC by 4.0)*/}
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
								<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
							</svg>
						</a>
					</span>
				</div>
			</div>
		);
	}
});

module.exports = KadalaItem;