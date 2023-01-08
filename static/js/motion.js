var keys = {};

var vel = [0,0];
var pos = [0,0];

document.addEventListener('keydown', function(e) {
    keys[e.key] = true;
});

document.addEventListener('keyup', function(e) {
    keys[e.key] = false;
});

window.setInterval(function() {
    var isShift = keys['q'];
    vel[0] += ((keys['a'] ? 1 : 0) - (keys['d'] ? 1 : 0)) * (isShift ? 5 : 1);
    vel[1] += ((keys['w'] ? 1 : 0) - (keys['s'] ? 1 : 0)) * (isShift ? 5 : 1);

    vel[0] *= 0.9;
    vel[1] *= 0.9;

    pos[0] += vel[0];
    pos[1] += vel[1];

    area.style.left = pos[0] + 'px';
    area.style.top = pos[1] + 'px';
},10);
