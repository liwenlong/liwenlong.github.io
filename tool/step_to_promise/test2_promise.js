function Vpromise(fn){
    console.log("vpromise");
    this.callback = [];
    this.errorback = [];
    this.status = "pending";
    var _this = this;
    fn(function(value){
        _this.reslove(value);
    },function(value){
        _this.reject(value);
    })
}

Vpromise.prototype = {
    then:function(success_cb,error_cb){
        var resolve,reject;
        var nP = new Vpromise(function(res,rej){
            resolve = res;
            reject = rej;
        });
        var make_cb = function(promise,res,rej,fn){
            return function(value){
                var result = fn(value);
                // debugger;
                 if(typeof result == 'object' && result instanceof Vpromise){
                     result.then(function(value){
                         res(value);
                    })
                 }else{
                     res(result);
                 }
            }
        }
        this.add_cb(make_cb(nP,resolve,reject,success_cb));
        return nP;
    },
    add_cb:function(fn){
        this.callback.push(fn);
        if(this.status =="reslove"){
            this.trigger();
        }
    },
    trigger:function(){
        if(this.callback.length){
            this.callback.map(function(cb){
                cb(this.value);
            },this)
        }
    },
    reslove:function(value){
        if(this.status == "pending"){
            this.value = value;
            this.status ="reslove";
            this.trigger();
        }

    },
    reject:function(value){
        if(this.status == "pending"){
            this.value = value;
            this.status ="reject";
            this.trigger();
        }
    }
}
