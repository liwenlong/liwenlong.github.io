function Vpromise(fn){
   this.status = "pending";
   this.data = null;
   this.error_cb_list = [];
   this.call_cb_list = [];
   var _this = this;
   setTimeout(function(){
     fn(function(data){
        _this.resolve(data);
     },function(){
        _this.reject(data);
     })
   },0)
   
}


Vpromise.prototype.then = function(callback,errorback){
      console.log(callback);
      var resolve,reject;
      var promise = new Vpromise(function(res,rej){
          resolve = res;
          reject = rej;
      });
      var _this  = this;
      function add_cb(promise,resolve,callback){
          if(!callback){
            _this.call_cb_list.push(resolve);
            return;
          }
          var new_cb = function(promise,resolve,callback){
             return function(data){
                  var result = callback(data);
                  if(result in Vpromise && result.then){
                      result.then(function(data){
                         resolve(data);
                      })
                  }else{
                      resolve(result);
                  }
             }
          }
          _this.call_cb_list.push(new_cb(promise,resolve,callback));
      }
      add_cb(promise,resolve,callback);
      return promise
}
Vpromise.prototype.reject = function(data){
    this.status = "reject";
    this.data = err;
    this.triggle();
}
Vpromise.prototype.resolve = function(data){
      this.status = "resolve";
      this.data = data;
      this.triggle();
}

Vpromise.prototype.triggle = function(){
    console.log(this.call_cb_list);
     if(this.status == 'pending'){
         return ;
     }
     if(this.status == 'resolve'){
        this.call_cb_list = this.call_cb_list || [];
        var value = this.data;
        this.call_cb_list.map(function(each_cb){
            each_cb(value);
        })
     }
     if(this.status == 'resolve'){
        this.error_cb_list = this.error_cb_list || [];
        var value = this.data;
        this.error_cb_list.map(function(each_cb){
            each_cb(value);
        })
     }
}

