var React = require('react');

var SimSelector = React.createClass({
	render:function() {
		return (
			<select>
	            <option value='kadala'>Kadala</option>
                <option value='crafting'>Crafting</option>
			</select>
	       	       );
	}
});

module.exports = SimSelector;
