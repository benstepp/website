var React = require('react');

var D3ItemTooltip = require('../d3-tooltip/d3-tooltip.jsx');

var InventorySlot = React.createClass({
	componentDidMount:function() {
		this.setTooltipOffset();
	},
	componentDidUpdate:function() {
		this.setTooltipOffset();
	},

	setTooltipOffset:function() {
		var elem = React.findDOMNode(this);

		//if the inventory slot has children (content)
		if (elem.children && elem.children.length > 0) {
			var elemLocation = elem.getBoundingClientRect().top;
			var tooltipHeight = elem.children[4].getBoundingClientRect().height;
			var windowHeight = window.innerHeight;

			//check if the tooltip fits where it currently is
			if (!(tooltipHeight + elemLocation < windowHeight)) {
				var offset = (tooltipHeight + elemLocation - windowHeight);

				//if the tooltip is bigger than window, just show at top of window
				if (offset > windowHeight) {
					elem.children[4].style.top = '-'+(elemLocation-20)+'px';
				}
				else {
					//just move it up a little with a bit at bottom
					elem.children[4].style.top = '-'+(offset+10)+'px';
				}

			}
		}
	},

	render:function() {

		var slotContent= [];
		var slotContentKey = 0;

		var slotClass='inventory-slot';
		//check to make sure an actual item is in the inventory slot
		if (typeof this.props.data !== 'undefined') {
			//change the size to large if it is a large item
			if(this.props.data.hasOwnProperty('size') && this.props.data.size === 2) {
				slotClass += ' large';
			}

			if(this.props.data.hasOwnProperty('rarity')) {
				var bgurl;
				var borderColor='#302a21';

				switch(this.props.data.rarity) {
					case 'magic':
						bgurl='//us.battle.net/d3/static/images/item/icon-bgs/blue.png';
						borderColor='#7979d4';
						break;
					case 'rare':
						bgurl='//us.battle.net/d3/static/images/item/icon-bgs/yellow.png';
						borderColor='#f8cc35';
						break;
					case 'legendary':
						bgurl='//us.battle.net/d3/static/images/item/icon-bgs/orange.png';
						borderColor='#bf642f';
						break;
					case 'ancient':
						bgurl='//us.battle.net/d3/static/images/item/icon-bgs/orange.png';
						borderColor='#bf642f';
						break;
					default:
						//noop
				}

				//switch bg to green if item is part of a set
				if (this.props.data.hasOwnProperty('set')) {
					bgurl='//us.battle.net/d3/static/images/item/icon-bgs/green.png';
					borderColor='#8bd442';
				}

				if (typeof bgurl !== 'undefined') {
					var inline = {
						backgroundImage:'url('+bgurl+')'
					};
					slotContent.push(<div style={inline} className='inventory-bg' key={slotContentKey}></div>)
					slotContentKey++;
				}
			}

			//set the item image
			if (this.props.data.hasOwnProperty('image')) {
				var inline = {backgroundImage:'url('+this.props.data.image+')'};
				slotContent.push(<div style={inline} className='inventory-image' key={slotContentKey}></div>);
				slotContentKey++;
			}

			//add a link to activate tooltip
			slotContent.push(<a className='tooltip-link' key={slotContentKey}></a>);
			slotContentKey++;

			//add a gradient mask
			slotContent.push(<div className='inventory-item-gradient' key={slotContentKey}></div>);
			slotContentKey++;

			//add a hidden tooltip
			var inline;
			if (this.props.column < 5) {
				inline = {left:'50px'};
			}
			else {
				inline = {right:'50px'};
			}

			slotContent.push(
				<div className='tooltip-container' style={inline} key={slotContentKey}>
					<D3ItemTooltip item={this.props.data}/>
				</div>
			);
			slotContentKey++;

			//add sockets on hover
			if (this.props.data.hasOwnProperty('primaries') && this.props.data.primaries.hasOwnProperty('Socket')) {
				var sockets;
				var socketCount = this.props.data.primaries.Socket.value;
				var socketContents = [];
				for (var i =0; i < socketCount; i++) {
					socketContents.push(<div className='socket' key={i}></div>);
				}
				sockets = <div className='sockets-wrapper' key={slotContentKey}><div className='sockets-align'>{socketContents}</div></div>;
				slotContent.push(sockets);
				slotContentKey++;
			}

		}

		return (
			<div className={slotClass} style={{borderColor:borderColor}}>
				{slotContent}
			</div>
		);
	}
});

module.exports = InventorySlot;