function Vpromise(fn){

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
    }
}
