var parent = typeof(global) != "undefined" ? global : window;

var listeners = {};

parent.sub = function(_event, method){
	if(!listeners[_event]){
		listeners[_event] = [];
	}
	listeners[_event].push(method);
};

parent.pub = function(_event){
	if(listeners[_event]){
		for(var i = 0; i < listeners[_event].length; i++){
			listeners[_event][i].apply(null, Array.prototype.slice.call(arguments, 1));
		}
	}
};
