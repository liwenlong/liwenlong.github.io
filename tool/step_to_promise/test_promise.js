/*
   to do a promise
   @ liwenlong
   @ 2017.9.11
*/

function Lpromise(fn){
    this.data ='';
    this._status = "pending";
    this._callbacks = [];
    this._errbacks = [];
    var _this = this;
    fn(function (value) {
        _this.resolve(value);
    }, function (reason) {
        _this.reject(reason);
    });
}
Lpromise.prototype = {
    resolve:function(value){
        if(this._status === "pending"){
            this._status = "reslove";
            this._value = value;
            if ((this._callbacks && this._callbacks.length) ||
                (this._errbacks && this._errbacks.length)) {
                this._unwrap(this._value);
            }
        }
    },
    reject:function(reason) {
        if(this._status === "pending"){
            this._status = "rejected";
            this._result = reason;
            this._callbacks = [];
        }
    },
    then:function(resolveHandle,rejectHandle,processHandle) {
        var result;
        var res,rej;
        var newProm = new Lpromise(function(reslove,reject){
            res  = reslove;
            rej  = reject;
        })
        this.add_list(this.make_callback(newProm,res,rej,resolveHandle));
        return newProm;
    },
    _unwrap:function(value){
        var self = this, unwrapped = false, then;

        if (!value || (typeof value !== 'object' &&
            typeof value !== 'function')) {
            this._result = value;
            if(this._callbacks.length){
                this._callbacks.map(function(cb){
                    cb(this._result);
                },this)
            }

            return;
        }
        try {
            then = value.then;
            if (typeof then === 'function') {
                then.call(value, function (value) {
                    if (!unwrapped) {
                        unwrapped = true;
                        self._unwrap(value);
                    }
                }, function (reason) {
                    if (!unwrapped) {
                        unwrapped = true;
                        self.reject(reason);
                    }
                });
            } else {
                self.fulfill(value);
            }
        } catch (e) {
            if (!unwrapped) {
                self.reject(e);
            }
        }
    },
    make_callback:function(newProm,resolve,reject,fn){
        return function(valueOrReason){
            var result;

            // Promises model exception handling through callbacks
            // making both synchronous and asynchronous errors behave
            // the same way
            try {
                // Use the argument coming in to the callback/errback from the
                // resolution of the parent promise.
                // The function must be called as a normal function, with no
                // special value for |this|, as per Promises A+
                result = fn(valueOrReason);
            } catch (e) {
                // calling return only to stop here
                reject(e);
                return;
            }

            resolve(result);
        }
    },
    add_list:function(callback, errback){
        var callbackList = this._callbacks,
            errbackList  = this._errbacks;

        // Because the callback and errback are represented by a Resolver, it
        // must be fulfilled or rejected to propagate through the then() chain.
        // The same logic applies to resolve() and reject() for fulfillment.
        if (callbackList) {
            callbackList.push(callback);
        }
        if (errbackList) {
            errbackList.push(errback);
        }
        console.log(this._status);
        switch (this._status) {
            case 'reslove':
                this._unwrap(this._value);
                break;
            case 'rejected':
                this.reject(this._result);
                break;
        }
    }
}




// mocha test
// var lwl = new Lpromise(function(resolve,reject){
//     setTimeout(function(){
//         var ran_number  = Math.random();
//         if (ran_number > 0.5){
//             resolve(ran_number);
//         }else{
//             reject(ran_number);
//         }
//     },1000)
// })
// lwl.then(function(data){
//     console.log("success:" +data);
// },function(data){
//     console.log("reject:" +data);
// }).then(function(data){
//     console.log("true ok");
// })
//
//
// // 实际上内容
//
// var lwl = new Promise(function(resolve,reject){
//     setTimeout(function(){
//         var ran_number  = Math.random();
//         if (ran_number > 0.5){
//             resolve(ran_number);
//         }else{
//             reject(ran_number);
//         }
//     },1000)
// })
// lwl.then(function(data){
//     console.log("success:" +data);
// },function(data){
//     console.log("reject:" +data);
// }).then(function(data){
//     console.log(" true ok");
// },function(){
//     console.log("reject second");
// })
//
//
//
// var lwl = new Promise(function(resolve,reject){
//     setTimeout(function(){
//         var ran_number  = Math.random();
//         if (ran_number > 0.5){
//             resolve(ran_number);
//         }else{
//             reject(ran_number);
//         }
//     },1000)
// })
// lwl.then(function(data){
//     console.log("success:" +data);
// }).then(function(data){
//     console.log(" true ok");
// })
// .catch(function(data){
//     console.log("erroe")
// })
