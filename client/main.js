var socket = io();
var id;
var users = {};

onmousemove = function (e) {
    // console.log("mouse location:", e.clientX, e.clientY)
    if(id) {
        socket.emit('mouse pos', {
            id: id,
            x: e.clientX,
            y: e.clientY
        });   
    }
    
}

var cursorZone = document.getElementById('cursor-zone');

socket.on('nameYourself', function (msg) {
    id = msg;
});

socket.on('mouse pos', function (msg) {
    if(!users.hasOwnProperty(msg.id)) {
        addUser(msg.id);
    } 
    users[msg.id].setAttribute('x', msg.x);
    users[msg.id].setAttribute('y', msg.y);
});

function parseHTML(html) {
    var t = document.createElement('template');
        t.innerHTML = html;
    return t.content.cloneNode(true);
}

var newCursorNodeTemplate = document.createElementNS('http://www.w3.org/2000/svg', 'image');
newCursorNodeTemplate.setAttributeNS(null , 'height', "32");
newCursorNodeTemplate.setAttributeNS(null , 'width', "32");
newCursorNodeTemplate.setAttributeNS('http://www.w3.org/1999/xlink' , 'href', "cursor-png-1105.png");
newCursorNodeTemplate.setAttributeNS(null , 'x', "-32");
newCursorNodeTemplate.setAttributeNS(null , 'y', "-32");
newCursorNodeTemplate.setAttributeNS(null, 'visibility', 'visible');

function addUser (id) {
    var newCursorNode = newCursorNodeTemplate.cloneNode();
    newCursorNode.setAttribute('id', id);
    cursorZone.appendChild(newCursorNode);
    users[id] = newCursorNode;
}

socket.on('newUser', function (msg) {
    addUser(msg);
});

socket.on('deadUser', function (msg) {
    if(users.hasOwnProperty(msg)) {
        users[msg].outerHTML = "";
        delete users[msg];
    }
});

