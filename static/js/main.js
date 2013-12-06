$(document).ready(function() {

	function change(evt) {
		var value = this.value;
		var channel = $(this).data('channel');

		socket.send(JSON.stringify({
			'value': value,
			'channel': parseInt(channel)
		}));
	}

	socket.addEventListener('message', function(evt) {
		var data = JSON.parse(evt.data);

		if(data.type == 'update') {
			$('.lightSlider[data-channel='+data.channel+']').val(data.value);
		}
	});

	$(function() {
		// Open the socket
		try {
			var host = window.location.host;
			var socket = new WebSocket('ws://' + host + '/control');

			socket.onopen = function(event) {
				alert('Socket Opened');
				$('.lightSlider').change(change);
			};
		} catch(e) {
			alert('Some sort of error happened....');
		}
	}); 

});