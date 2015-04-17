var React = require('react');

var KadalaItem = require('./kadala-item.jsx');

var KadalaStore = React.createClass({
	render:function() {

		//another nested array to represent each column of store
		var itemsForSale = [
			[{helm:'Mystery Helmet'},{boots:'Mystery Boots'},{belt:'Mystery Belt'},{pants:'Mystery Pants'}],
			[{gloves:'Mystery Gloves'},{chest:'Mystery Chest'},{shoulders:'Mystery Shoulders'},{bracers:'Mystery Bracers'}],
			[{quiver:'Mystery Quiver'},{mojo:'Mystery Mojo'},{source:'Mystery Orb'},{shield:'Mystery Shield'}],
			[{onehand:'1-H Mystery Weapon'},{twohand:'2-H Mystery Weapon'},{ring:'Mystery Ring'},{amulet:'Mystery Amulet'}]
		];

		var kadalaSlots = [];
		var key = 0;
		//loop through each column of store
		for (var i =0; i < 4; i++) {
			var rowCount = itemsForSale[i].length;
			for (var j=0; j < rowCount ; j++) {
				kadalaSlots.push(<KadalaItem key={key} item={itemsForSale[i][j]}/>);
				key++;
			}

		}

		return (
			<div className='kadala-store'>
				{kadalaSlots}
			</div>
		);
	}
});

module.exports = KadalaStore;