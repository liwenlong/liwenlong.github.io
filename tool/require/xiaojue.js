/**
 * @author xiaojue[designsor@gmail.com]
 * @date 20141112
 * @fileoverview core for iwo,a easy module control
 */
(function(win, doc, undef) {
    
      var cache = {},
      loadings = {},
      queue = [],
      scripts = doc.getElementsByTagName('script'),
      root = scripts[scripts.length - 1].src,
      basepath = root.slice(0, root.lastIndexOf('/') + 1);
    
      
    
      var utils = {
        addLoading: function(deps) {
          for (var i = 0; i < deps.length; i++) {
            var id = deps[i],stat = loadings[id];
            loadings[id] = stat ? stat : 0;
          }
        },
        _r: function(id) {
          var mod = cache[id];
          return mod.exports || (mod.exports = mod.compile());
        },
        checkLoading: function() {
          for (var id in loadings) {
            if (loadings[id] < 2) return false;
          }
          return true;
        },
        loadDeps: function() {
          for (var id in loadings){
            if (loadings[id] < 1) utils.loadMod(id);
          }
        },
        loadScript: function(path, cb) {
          var script = doc.createElement('script'),
          parent = doc.getElementsByTagName('head')[0];
          script.onload = script.onreadystatechange = script.onerror = function() {
            if (/loaded|complete|undefined/.test(script.readyState)) {
              script.onload = script.onerror = script.onreadystatechange = null;
              script.parentNode.removeChild(script);
              script = undef;
              if(cb) cb();
            }
          };
          script.src = basepath + path + '.js';
          parent.appendChild(script);
        },
        loadMod: function(id) {
          loadings[id] = 1;
          utils.loadScript(id, function() {
            if (utils.checkLoading()) {
              while (queue.length) {
                cache[queue.shift()].compile();
              }
            } else {
              utils.loadDeps();
            }
          });
        },
        run: function(path) {
          queue.push(path);
          utils.addLoading([path]);
          utils.loadDeps();
        },
        define: function(path, deps, factory) {
          new Module(path, deps, factory);
        }
      };
      function Module(path, deps, factory) {
        this.id = path;
        this.deps = factory ? deps : [];
        this.factory = factory ? factory : deps;
        utils.addLoading(this.deps);
        cache[path] = this;
        loadings[path] = 2;
      }
    
      Module.prototype = {
        constructor: Module,
        compile: function() {
          return this.factory(utils._r);
        }
      };
    
      win.iwo = {
        version: '0.0.1',
        core: 'iwo.core',
        run: utils.run,
        define: utils.define
      };
    
      iwo.run(iwo.core);
    
    })(window, document);
    