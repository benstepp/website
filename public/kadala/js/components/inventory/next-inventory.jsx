var React = require('react');
var AppActions = require('../../actions/AppActions');

var NextInventory = React.createClass({
	_handleClick:function() {
		AppActions.nextInventory();
	},

	render:function() {

		var buttonClass = 'inventory-button';
		if (!this.props.hasNext) {
			buttonClass+= ' disabled';
		}

		return (
			<div className='inventory-button-container'>
				<button className={buttonClass} onClick={this._handleClick}>
					{/*From Material Design icons by Google (CC by 4.0)*/}
					<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
						<path d="M15 9l-2.12 2.12L19.76 18l-6.88 6.88L15 27l9-9z"/>
					</svg>
				</button>
			</div>
		);
	}
});

module.exports = NextInventory;