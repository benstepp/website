module.exports = function(zEvents, socket) {

	zEvents.on('add', function(data) {
		console.log(data);
    		socket.emit('addEvent', data);
	});

	zEvents.on('remove', function(data) {
    		socket.emit('removeEvent', data);
	});

};