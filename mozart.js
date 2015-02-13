/**
 * @fileoverview Mozart.js is a simple interface to html5 audio with legacy
 * fallback to flash. Currently only supports MP3s.
 *
 * @author m@murz.net (Mike Murray)
 */


/**
 * Constructs a new instance of Mozart.
 * @param {Object} A map of options. See below for defaults.
 * @constructor
 */
var Mozart = function(opt_options) {
  this.initializeOptions_(opt_options);
  this.detectAudioApi_();
};


/**
 * Options object.
 * @type {Object}
 * @private
 */
Mozart.prototype.options = {
  "flashPath": "/public/flash/tmb_flashAudioApi.swf",
  "flashElementId": "tmb-mozart-flashplayer",
  "flashElementHostId": "tmb-audio-player",
  "swfobjectPath": "//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js",
  // "swfobjectPath": "/public/scripts/swfobject.js",
  "swfobjectElementId": "tmb-mozart-swfobject"
};


/**
 * Whether we are in legacy (flash) mode or not.
 * @type {Boolean}
 * @private
 */
Mozart.prototype.flashMode_ = false;


/**
 * Whether the swfobject and swf have been fully loaded yet.
 * @type {boolean}
 * @private
 */
Mozart.prototype.flashReady_ = false;


/**
 * Cache of preloaded sounds.
 * @type {Object}
 * @private
 */
Mozart.prototype.soundCache_ = {};


/**
 * Load a sound from it's url.
 * @param {String} url The url to load from.
 * @param {Object=} callbacks Optional object containing callbacks.
 * @return {MozartSound} The resulting sound object.
 */
Mozart.prototype.load = function(url, callbacks) {
	if (this.flashMode_) {
    return new MozartFlashSound(url, callbacks, this.options["flashElementId"]);
	} else {
    return new MozartHtmlSound(url, callbacks);
	}
};


/**
 * Overwrite custom options with the ones that are passed in.
 * @param {Object=} opt_options The options object.
 */
Mozart.prototype.initializeOptions_ = function(opt_options) {
  if (!opt_options) return;

  for (var name in opt_options) {
    if (opt_options[name]) {
      this.options[name] = opt_options[name];
    }
  }
};


/**
 * Detects which audio api to use (flash or html5) and kicks off the loading
 * of the swf file if using flash.
 * @private
 */
Mozart.prototype.detectAudioApi_ = function() {
  if (!window.document) {
    throw new Error("Mozart must be initialized within the context of an HTML document.");
  }

  var audioEl = window.document.createElement('audio');
  // TODO(mike): this check needs to change if we ever support non-mp3.
  this.flashMode_ =
      !audioEl.canPlayType ||
      (audioEl.canPlayType('audio/mpeg').match(/maybe|probably/i) ? false : true);
  
  if (this.flashMode_) {
    this.loadSwfScript_(this.handleSwfScriptReady_, this);
  }
};


/**
 * Callback when the swfobject scripts are loaded.
 * @private
 */
Mozart.prototype.handleSwfScriptReady_ = function() {
	window['swfobject'].embedSWF(this.options["flashPath"], this.options["flashElementHostId"], "0", "0", "9.0.0", "flash/expressInstall.swf", false, false, {id:this.options["flashElementId"]});
  tmb.log('swf embedded');
  Mozart.SWF_READY = true;
  for (var i = 0; i < Mozart.swfReadyCallbacks.length; i++) {
    Mozart.swfReadyCallbacks[i].call();
  }
};


/**
 * Helper function to load in the swfobject JS.
 * @param {Function=} opt_fn Callback function.
 * @param {Object=} opt_scope Scope to use when calling back.
 * @private
 */
Mozart.prototype.loadSwfScript_ = function(fn, scope) {
    scope = scope || {};
    fn = fn || function() {};

    var s = document.createElement('script');
    s.setAttribute("type", "text/javascript");
    s.setAttribute("src", this.options["swfobjectPath"]);
    s.setAttribute('id', this.options["swfobjectElementId"]);

    var done = false;
    s.onerror = s.onload = s.onreadystatechange = function(){
        if (!done && (!this.readyState || /loaded|complete/.test(this.readyState))) {
                done = true;
                // Handle memory leak in IE
                s.onerror = s.onload = s.onreadystatechange = null;
                fn.call(scope);
        }
    };
    document.getElementsByTagName('head')[0].appendChild(s);
};


/**
 * Simple inheritance helper.
 * @param {Function} child Child class.
 * @param {Function} parent Parent class.
 */
Mozart.inherit = function(child, parent) {
  var temp = function() {};
  temp.prototype = parent.prototype;
  child.super_ = parent.prototype;
  child.prototype = new temp();
  child.prototype.constructor = child;
};


/**
 * Helper to bind a function to a given scope.
 * @param {Function} fn Function to bind.
 * @param {Object} scope Scope to bind.
 */
Mozart.bind = function(fn, scope) {
  return function() {
    fn.call(scope);
  };
};


/**
 * Helper to log a string to the console if it's availible.
 * @param {String} msg The string to log.
 */
Mozart.log = function(msg) {
  if (console && typeof console.log == 'function') {
    console.log(msg);
  }
};

/**
 * Helper to attach an event.
 * @param {String} type Event type.
 * @param {Function} callack Callback function.
 */
 Mozart.addEventListener = function(type, callback) {
   if (!Mozart.EVENTS.hasOwnProperty(type)) {
     Mozart.EVENTS[type] = [];
   }
   Mozart.EVENTS[type].push(callback);
 };


 /**
  * Helper to fire an event.
  * @param {String} type Event type.
  */
Mozart.dispatchEvent = function(type) {
  Mozart.log("dispatch: "+type);
  if (!Mozart.EVENTS.hasOwnProperty(type)) {
    return;
  }
  for (var i = 0; i < Mozart.EVENTS[type].length; i++) {
    Mozart.EVENTS[type][i].call();
  }
};


/**
 * An associative array of events.
 * @type {Object}
 */
Mozart.EVENTS = {};


/**
 * A static list of functions to be called when flash is ready.
 * @type {Array.<Function>}
 */
Mozart.swfReadyCallbacks = [];


/**
 * A flag which indicates whether we are ready to play flash audio or not.
 * @type {Boolean}
 */
Mozart.SWF_READY = false;


/**
 * Used to generate globally uid for Mozart sounds.
 */
Mozart.currentUid = 0;



