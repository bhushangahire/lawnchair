/**
 * CookieAdaptor
 * ===================
 * Cookie implementation for Lawnchair for older browsers.
 *
 * Based on ppk's http://www.quirksmode.org/js/cookies.html
 *
 */
var CookieAdaptor = function(options) {
  for (var i in LawnchairAdaptorHelpers) {
    this[i] = LawnchairAdaptorHelpers[i];
  }
  this.init(options);
};

CookieAdaptor.prototype = {
  init:function(options){
    this.keyName = this.merge('key', options.keyName);

    this.createCookie = function(name, value, days) {
      if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
      }
      else var expires = "";
      document.cookie = name+"="+value+expires+"; path=/";
    };
  },
  get:function(key, callback){
    var readCookie = function(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      var len = ca.length;
      for (var i=0; i < len; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      }
      return null;
    };
    var obj = this.deserialize(readCookie(key)) || null;
    if (obj) {
      obj[this.keyName] = key;
    }
    if (callback)
            this.terseToVerboseCallback(callback)(obj);
  },
  save:function(obj, callback){
    var id = obj[this.keyName] || this.uuid();
    delete obj[this.keyName];
    this.createCookie(id, this.serialize(obj), 365);
        obj[this.keyName] = id;
    if (callback)
      this.terseToVerboseCallback(callback)(obj);
  },
  all:function(callback){
    var cb = this.terseToVerboseCallback(callback);
    var ca = document.cookie.split(';');
    var yar = [];
    var c,k,v,o;
    // yo ho yo ho a pirates life for me
    for (var i = 0, l = ca.length; i < l; i++) {
      c = ca[i].split('=');
      k = c[0];
      v = c[1];
      o = this.deserialize(v);
      if (o) {
        o[this.keyName] = k;
        yar.push(o);
      }
    }
    if (cb)
      cb(yar);
  },
  remove:function(keyOrObj, callback) {
    var key = (typeof keyOrObj == 'string') ? keyOrObj : keyOrObj[this.keyName];
    this.createCookie(key, '', -1);
    if (callback)
        this.terseToVerboseCallback(callback)();
  },
  nuke:function(callback) {
    var that = this;
    this.all(function(r){
      for (var i = 0, l = r.length; i < l; i++) {
        if (r[i][that.keyName])
          that.remove(r[i][that.keyName]);
      }
            if (callback) {
                callback = that.terseToVerboseCallback(callback);
                callback(r);
            }
    });
  }
};
