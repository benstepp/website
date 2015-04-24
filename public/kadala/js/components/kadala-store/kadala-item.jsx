var React = require('react');
var d3sim = require('d3sim');

var AppActions = require('../../actions/AppActions');
var AppStore = require('../../stores/AppStore');

var KadalaItem = React.createClass({

	getInitialState:function() {
		return {
			mobile:AppStore.getSettings().mobile,
			shardCount:AppStore.getShards(this.props.item.type)
		};
	},
	componentDidMount: function() {
		AppStore.addChangeListener(this._onChange);
	},
	componentWillUnmount: function() {
		AppStore.removeChangeListener(this._onChange);
	},
	_onChange:function() {
		this.setState({
			shardCount:AppStore.getShards(this.props.item.type)
		});
	},
	buyItem:function() {
		//increment the blood shard count
		var currentCount = this.state.shardCount;
		currentCount += this.props.item.cost;
		this.setState({shardCount:currentCount});

		var item = d3sim.kadalaRoll(this.props.item.type);
		item.size = this.props.item.size;
		AppActions.addItem(item);
		AppActions.changeSetting('item',this.props.item);
		AppActions.incrementShards(this.props.item.type,this.props.item.cost);

		if (this.state.mobile) {
			AppActions.toggleStore();
		}
	},
	resetCount:function() {
		this.setState({shardCount:0});
	},

	render:function() {

		var iconClass = 'kadala-icon';
		iconClass+=' '+this.props.item.type;

		return (
			<div className='kadala-item'>
				<button className='kadala' onClick={this.buyItem}>
					<div className={iconClass}></div>
					<span>{this.props.item.cost}</span>
				</button>
				<div className='kadala-content'>
					<span className='kadala-item-title' onClick={this.buyItem}>{this.props.item.text}</span>
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