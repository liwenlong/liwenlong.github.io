!(function(name,definition){
    var hasDefine = typeof define === 'function';
        hasExports = typeof module !== 'undefined' && module.exports;
    if(hasDefine) {
        define('eventproxy_debug',function(){
            return function(){}
        })
        define(['eventproxy_debug'],definition);
    } else if (hasExports) {
        module.exports = definition(require('debug')('eventproxy'));
    } else{
        this[name] = definition();
    }
}('EventProxy', function(debug){
    debug = debug || function() {} ;

    var SLICE = Array.prototype.slice;
    var CONCAT = Array.prototype.concat;
    var ALL_EVENT = '__all__';
    
    var EventProxy = function() {
        if(!(this instanceof EventProxy)) {
            return new EventProxy();
        }
        this._callbacks = {};
        this._fired = {};
    }

    EventProxy.prototype.addListener = function(ev, callback){
        debug('Add listener for %s',ev);
        this._callbacks[ev] = this._callbacks[ev] || [];
        this._callbacks[ev].push(callback);
        return this;
    }

    EventProxy.prototype.bind = EventProxy.prototype.addListener;
    EventProxy.prototype.on = EventProxy.prototype.addListener;
    EventProxy.prototype.subscribe = EventProxy.prototype.addListener;

    EventProxy.prototype.headbind = function (ev, callback) {
       debug('Add head listener fo %s', ev);
       this._callbacks[ev] = this._callbacks[ev] || [];
       this._callbacks[ev].unshift(callback);
       return this;
    };

    EventProxy.prototype.removeListener = function (eventname, callback) {
        var calls = this._callbacks;
        if(!eventname) {
            debug('Remove all listeners');
            this._callbacks = {};
        } else if(typeof callback == 'undefined'){
            this._callbacks[eventname] = [];
        } else {
            var list = calls[eventname];
            if(list) {
                var l = list.length;
                for(var i =0; i<l;i++){
                    if(callback === list[i]){
                        debug('Remove a listener of %s',eventname);
                        list[i] = null;
                    }
                }
            }
        }
        return this;
    }
    EventProxy.prototype.unbind = EventProxy.prototype.removeListener;
    EventProxy.prototype.off = EventProxy.prototype.removeListener;

}))