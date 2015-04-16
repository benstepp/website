var React = require('react');

var ClassSelectorButton = React.createClass({

	//state is handled in the parent component
	//this function is up there
	handleClick:function() {
		this.props.updateClass(this.props.name);
	},

	render:function() {

		var buttonClass = 'classSelector';
		if (this.props.selected) {
			buttonClass+= ' selected'
		}

		return (
			<li>
				<button className={buttonClass} onClick={this.handleClick}>
					<img src={this.props.image}></img>
					<span>{this.props.name}</span>
				</button>
			</li>
		);
	}

});

module.exports = ClassSelectorButton;