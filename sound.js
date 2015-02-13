/**
 * Constructs a single sound.
 * @param {String} url Url of the sound file.
 * @param {Object} opt_options Options object.
 * @constructor
 */
var MozartSound = function(url, opt_options) {
  /**
   * The Url of the sound file.
   * @type {String}
   * @protected
   */
  this.url = url;

  /**
   * The unique id of this sound.
   */
  this.uid = Mozart.currentUid++;

  this.initialize(opt_options);
};


/**
 * Options object.
 * @type {Object}
 * @protected
 */
MozartSound.prototype.options = {
  'onLoad': function() {},
  'onError': function() {},
  'onPlay': function() {},
  'onFinish': function() {},
  'onPause': function() {},
  'onStop': function() {},
  'scope': {}
};


/**
 * Whether the sound is ready to play or not.
 * @type {Boolean}
 * @protected
 */
MozartSound.prototype.ready = false;


/**
 * Flag to track when a deferred play has been attached.
 * @type {Boolean}
 * @protected
 */
MozartSound.prototype.deferredAttached = false;


/**
 * Sets one of the options post initialize.
 * @param {String} key The name of the option to set.
 * @param {Object} value The value to set.
 */
MozartSound.prototype.set = function(key, value) {
  this.options[key] = value;
};


/**
 * Attaches event listeners and begins loading the sound.
 * @param {Object} opt_options Options object.
 * @protected
 */
MozartSound.prototype.initialize = function(opt_options) {
  for (var name in opt_options) {
    this.options[name] = options[name];
  }
};


/**
 * Callback invoked when the sound is loaded.
 * @protected
 */
MozartSound.prototype.handleLoaded = function() {
  this.ready = true;
  this.options['onLoad'].call(this.options['scope']);
};


/**
 * Callback invoked on error.
 * @protected
 */
MozartSound.prototype.handleError = function() {
  this.options['onError'].call(this.options['scope']);
};


/**
 * Callback invoked on sound end.
 * @protected
 */
MozartSound.prototype.handleFinished = function() {
  this.options['onFinished'].call(this.options['scope']);
};


/**
 * Start playing the sound, if the sound has not finished loading
 * this method will attach a callback to start playing once it is.
 */
MozartSound.prototype.play = function() {
  if (this.ready) {
    this.playInternal();
    this.options['onPlay'].call(this.options['scope']);
  } else {
    this.deferredPlay();
  }
};


/**
 * A direct API call to start playing.
 * @protected
 */
MozartSound.prototype.playInternal = function() {};


/**
 * Attach a callback to start playing once loaded.
 * @protected
 */
MozartSound.prototype.deferredPlay = function() {};


/**
 * Pause the sound.
 */
MozartSound.prototype.pause = function() {};


/**
 * Stop the sound.
 */
MozartSound.prototype.stop = function() {};


/**
 * Gets the current playback time in seconds.
 */
MozartSound.prototype.getTime = function() {};

