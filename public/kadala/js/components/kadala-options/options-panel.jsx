var React = require('react');
var ClassSelector = require('./class-selector.jsx');

var OptionsPanel = React.createClass({
	render:function() {
		return (
			<section className='options-panel'>
				<ClassSelector />
			</section>
		);
	}
});

module.exports = OptionsPanel;