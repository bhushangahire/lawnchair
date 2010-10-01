/**
 * UserDataAdaptor
 * ===================
 * UserData implementation for Lawnchair for older IE browsers.
 *
 */
var UserDataAdaptor = function(options) {
    for (var i in LawnchairAdaptorHelpers) {
        this[i] = LawnchairAdaptorHelpers[i];
    }
    this.init(options);
};

UserDataAdaptor.prototype = {
  init:function(options){
    this.keyName = merge('key', options.keyName);
    var s = document.createElement('span');
    s.style.behavior = 'url(\'#default#userData\')';
    s.style.position = 'absolute';
    s.style.left = 10000;
    document.body.appendChild(s);
    this.storage = s;
    this.storage.load('lawnchair');
  },
  get:function(key, callback){

    var obj = this.deserialize(this.storage.getAttribute(key));
          if (obj) {
              obj[this.keyName] = key;

          }
      if (callback)
                  callback(obj);
  },
  save:function(obj, callback){
    var id = obj[this.keyName] || 'lc' + this.uuid();
          delete obj[this.keyName];
    this.storage.setAttribute(id, this.serialize(obj));
    this.storage.save('lawnchair');
    if (callback){
      obj[this.keyName] = id;
      callback(obj);
      }
  },
  all:function(callback){
    var cb = this.terseToVerboseCallback(callback);
    var ca = this.storage.XMLDocument.firstChild.attributes;
    var yar = [];
    var v,o;
    // yo ho yo ho a pirates life for me
    for (var i = 0, l = ca.length; i < l; i++) {
      v = ca[i];
      o = this.deserialize(v.nodeValue);
      if (o) {
        o[this.keyName] = v.nodeName;
        yar.push(o);
      }
    }
    if (cb)
      cb(yar);
  },
  remove:function(keyOrObj,callback) {
    var key = (typeof keyOrObj == 'string') ?  keyOrObj : keyOrObj[this.keyName];
    this.storage.removeAttribute(key);
    this.storage.save('lawnchair');
    if(callback)
      callback();
  },
  nuke:function(callback) {
    var that = this;
    this.all(function(r){
      for (var i = 0, l = r.length; i < l; i++) {
        if (r[i][that.keyName])
          that.remove(r[i][that.keyName]);
      }
      if(callback)
        callback();
    });
  }
};
