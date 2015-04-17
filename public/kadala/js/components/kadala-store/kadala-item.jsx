var React = require('react');

var KadalaItem = React.createClass({
	render:function() {

		var shardClass = 'shard-count';
		if (typeof this.props.item === 'undefined') {
			shardClass+=' hidden-shards'
		}

		return (
			<div className='kadala-item'>
				<button className='kadala'>
					<img className='kadala-icon'/>
				</button>
				<div className='kadala-content'>
					<span>{this.props.item}</span>
					<span className={shardClass}>{this.props.shardCount || 0}</span>
				</div>
			</div>
		);
	}
});

module.exports = KadalaItem;