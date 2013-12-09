$(document).ready(function() {

    var host = window.location.host;
    var socket = new WebSocket('ws://' + host + ':443/control');

    var states = [
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0]
    ];

    socket.addEventListener('message', function(evt) {
        var data = JSON.parse(evt.data);

        if(data.type == 'updateStates') {
            states = data.states;
            updateUI();
        } else if(data.type == 'updateSpeed') {
            $('.speed').val(data.speed);
        } else if(data.type == 'timesync') {
            var target = $('.sequencer .line');
            $('.sequencer .line')[0].style.left = 0;
            $('.sequencer .line')[0].style.webkitAnimationDuration = data.speed + 'ms';
        }
    });

    function updateUI() {
        for(i in states) {
            for(x in states[i]) {
                if(states[i][x] == 1) {
                    $('tr[data-channel='+i+'] td[data-timebox='+x+']').addClass('selected');
                } else {
                    $('tr[data-channel='+i+'] td[data-timebox='+x+']').removeClass('selected');
                }
            }
        }
    }

    $(function() {
        // Open the socket

        socket.onopen = function(event) {

        };

        socket.onerror = socket.onclose = function(event) {
            $('#content').html("<div class=\"message error\">Sorry, the server is currently unavailable. Please try again later.</div>");
        }

        $('.sequencer td').click(function(evt) {
            var t = $(this);

            var channel = t.parent().data('channel');
            var timebox = t.data('timebox');

            if(t.data('selected') == 'true') {
                t.data('selected', 'false');
                t.removeClass('selected');
                states[channel][timebox] = 0;
            } else {
                t.data('selected', 'true');
                t.addClass('selected');
                states[channel][timebox] = 1;
            }

            socket.send(JSON.stringify({
                type: 'setState',
                states: states
            }));
        });

        $('.speed').change(function() {
            socket.send(JSON.stringify({
                type: 'setSpeed',
                speed: $(this).val()
            }));
        });

    }); 

});