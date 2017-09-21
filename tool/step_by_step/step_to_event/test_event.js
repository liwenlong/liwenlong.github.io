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
    triggle:function(ev,fn){
       if(typeof fn == 'undefined'){
            for(var i = 0; i<list.length; i++){
                if(cb === list[i]){
                    list[i]();
                }
            }
       }else{
            var list = this.list[ev];
            for(var i = 0; i<list.length; i++){
                if(cb === list[i]){
                    list[i]();
                }
            }
       }
    },
    once:function(ev,cb,number){
        number = number || 1;
        var new_cb = function(){
           if(number){
              cb();
              number--;
           }
        }
        this.on(ev,new_cb)
    }
}

Event.prototype.constructor = Event;
