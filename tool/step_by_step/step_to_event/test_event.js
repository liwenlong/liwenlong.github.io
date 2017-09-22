function Event(){
    this.list = {};
}

Event.prototype  ={
    on:function(ev,cb){
       this.list[ev]  = this.list[ev] || [];
       this.list[ev].push(cb);
       return this;
    },
    off:function(ev,cb){
       if(!this.list[ev] || typeof cb == 'undefined'){
           return this;
       }else{
           var list = this.list[ev];
           for(var i = 0; i<list.length; i++){
               if(cb === list[i]){
                   list[i] = null;
               }
           }
       }
       return this;
    },
    trigger:function(ev,cb){
       var list = this.list[ev];
       if(typeof cb == 'undefined'){
            for(var i = 0; i<list.length; i++){
                list[i]();
            }
       }else{
            for(var i = 0; i<list.length; i++){
                if(cb === list[i]){
                    list[i]();
                }
            }
       }
    },
    once:function(ev,cb,number){
        number = number || 1;
        var _this = this;
        function wrap(){
            cb.apply(_this,argument);
             _this.off(ev,wrap);
             _this = null;
        }
        this.on(ev,wrap)
    }
}
Event.prototype.fire = Event.prototype.trigger;
Event.prototype.constructor = Event;
