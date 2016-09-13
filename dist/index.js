module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var PythonShell = __webpack_require__(1);
	var appRoot = __webpack_require__(2);

	function NonExistentSubtitleError(message) {
	  this.message = message;
	  this.stack = new Error().stack;
	}
	NonExistentSubtitleError.prototype = Error.prototype;

	function getAutoSubs(videoId) {
	  return new Promise(function (resolve, reject) {
	    var url = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"file!./index.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	    console.log(url);
	    PythonShell.run('__main__.py', {
	      scriptPath: __dirname + '/youtube-dl/youtube_dl',
	      args: ['--write-auto-sub', '--skip-download', '--sub-format', 'vtt', 'https://www.youtube.com/watch?v=' + videoId]
	    }, function (err, results) {
	      if (err) {
	        reject(err);
	      } else {
	        if (results.indexOf('Default Subtitle:') === -1) {
	          reject(new Error('No subtitles for video: ' + videoId + ' '));
	        } else {
	          resolve(results[results.indexOf('Default Subtitle:') + 1]);
	        }
	      }
	    });
	  });
	}

	function getNonAutoSubs(videoId) {
	  return new Promise(function (resolve, reject) {
	    PythonShell.run('__main__.py', {
	      scriptPath: __dirname + '/youtube-dl/youtube_dl',
	      args: ['--write-sub', '--skip-download', '--sub-format', 'vtt', 'https://www.youtube.com/watch?v=' + videoId]
	    }, function (err, results) {
	      if (err) {
	        reject(err);
	      } else {
	        if (results.indexOf('Default Subtitle:') === -1) {
	          reject(new Error('No subtitles for video: ' + videoId + ' '));
	        } else {
	          resolve(results[results.indexOf('Default Subtitle:') + 1]);
	        }
	      }
	    });
	  });
	}

	function getYoutubeSubtitleUrl(videoId) {
	  var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  var type = 'either';
	  // onlye accepts auto and nonauto type
	  if (opts.type && opts.type !== 'auto' && opts.type !== 'nonauto' && opts.type !== 'either') {
	    throw new Error('type is not valid');
	  }
	  // default should be either 
	  if (opts.type === 'auto' || opts.type === 'nonauto') {
	    type = opts.type;
	  }
	  return new Promise(function (resolve, reject) {
	    if (type === 'nonauto') {
	      getNonAutoSubs(videoId).then(function (url) {
	        var result = {
	          automaticallyGenerated: false,
	          url: url
	        };
	        resolve(result);
	      }).catch(function (err) {
	        if (err.message.indexOf("video doesn't have subtitles")) {
	          reject(new NonExistentSubtitleError('Non-auto Subtitles dont exist for ' + videoId));
	        } else {
	          reject(err);
	        }
	      });
	    } else if (type === 'auto') {
	      getAutoSubs(videoId).then(function (url) {
	        var result = {
	          automaticallyGenerated: true,
	          url: url
	        };
	        resolve(result);
	      }).catch(function (err) {
	        if (err.message.indexOf("Couldn't find automatic captions for")) {
	          reject(new NonExistentSubtitleError('Auto Subtitles dont exist for ' + videoId));
	        } else {
	          reject(err);
	        }
	      });
	    } else if (type === 'either') {
	      getNonAutoSubs(videoId).then(function (url) {
	        var result = {
	          automaticallyGenerated: false,
	          url: url
	        };
	        resolve(result);
	      }).catch(function () {
	        getAutoSubs(videoId).then(function (url) {
	          var result = {
	            automaticallyGenerated: true,
	            url: url
	          };
	          resolve(result);
	        }).catch(function (err) {
	          console.log(err);
	          if (err.message.indexOf("Couldn't find automatic captions for")) {
	            reject(new NonExistentSubtitleError('Subtitles dont exist for ' + videoId));
	          } else {
	            reject(err);
	          }
	        });
	      });
	    }
	  });
	}

	exports.default = getYoutubeSubtitleUrl;
	/* WEBPACK VAR INJECTION */}.call(exports, ""))

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("python-shell");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("app-root-path");

/***/ }
/******/ ]);