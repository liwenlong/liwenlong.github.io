/*
   to do a promise
   @ liwenlong
   @ 2017.9.11
*/

function Lpromise(fn){
    this.data ='';
    this.status = "pending";
    var _this = this;
    function reslove(data) {
        _this.data = data;
        _this.status = "resolve";
        if(_this.resolveHandle){
            _this.resolveHandle(_this.data);
        }
    }
    function reject(data) {
        _this.status = "reject";
        _this.data = data;
        if(_this.rejectHandle){
            _this.rejectHandle(_this.data);
        }
    }
    fn.call(_this,reslove,reject);
}

Lpromise.prototype = {
    then:function(resolveHandle,rejectHandle,processHandle) {
         var result;
         if(this.status == "resolve") {
             result = resolveHandle(this.data);
         }
         if(this.status == "reject"){
            result = rejectHandle(this.data);
         }
         if(this.status =="pending"){
             if(typeof processHandle != 'undefined'){
                result = processHandle(this.data);
             }
             this.resolveHandle = resolveHandle;
             this.rejectHandle = rejectHandle;
         }
        //  判断返回值是否有promise
        // 如果有，则把返回值暴露出去
        // 如果没有，则new 出来一个新的promise,值是数字或者之类的
         if(result == 'promise'){

         }else{
             result = new Lpromise(function(){

             });
             return result;
         }
    }
}


// mocha test
var lwl = new Lpromise(function(resolve,reject){
    setTimeout(function(){
        var ran_number  = Math.random();
        if (ran_number > 0.5){
            resolve(ran_number);
        }else{
            reject(ran_number);
        }
    },1000)
})
lwl.then(function(data){
    console.log("success:" +data);
},function(data){
    console.log("reject:" +data);
})
