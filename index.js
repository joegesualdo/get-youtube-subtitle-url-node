"use strict"

const PythonShell = require('python-shell');
var appRoot = require('app-root-path');

const loudRejection = require('loud-rejection');
loudRejection();

function NonExistentSubtitleError(message) {
  this.message = message;
  this.stack = (new Error().stack);
}
NonExistentSubtitleError.prototype = Error.prototype;

function getAutoSubs(videoId) {
  return new Promise((resolve, reject) => {
    PythonShell.run('__main__.py', {
      scriptPath: `${__dirname}/youtube-dl/youtube_dl`,
      args: [
        '--write-auto-sub',
        '--skip-download',
        '--sub-format',
        'vtt',
        `https://www.youtube.com/watch?v=${videoId}`],
    }, (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.indexOf('Default Subtitle:') === -1) {
          reject(new Error(`No subtitles for video: ${videoId} `));
        } else {
          resolve(results[results.indexOf('Default Subtitle:') + 1]);
        }
      }
    });
  });
}

function getNonAutoSubs(videoId) {
  return new Promise((resolve, reject) => {
    PythonShell.run('__main__.py', {
      scriptPath: `${__dirname}/youtube-dl/youtube_dl`,
      args: [
        '--write-sub',
        '--skip-download',
        '--sub-format',
        'vtt',
        `https://www.youtube.com/watch?v=${videoId}`],
    }, (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.indexOf('Default Subtitle:') === -1) {
          reject(new Error(`No subtitles for video: ${videoId} `));
        } else {
          resolve(results[results.indexOf('Default Subtitle:') + 1]);
        }
      }
    });
  });
}

function getYoutubeSubtitleUrl(videoId, opts) {
  opts = opts || {}
  var type = 'either'
  // onlye accepts auto and nonauto type
  if (opts.type && (opts.type !== 'auto' && opts.type !== 'nonauto' && opts.type !== 'either')) {
    throw new Error('type is not valid')
  }
  // default should be either 
  if (opts.type === 'auto' || opts.type === 'nonauto') {
    type = opts.type;
  }
  return new Promise((resolve, reject) => {
    if (type === 'nonauto') {
      getNonAutoSubs(videoId)
      .then((url) => {
        const result = {
          automaticallyGenerated: false,
          url,
        };
        resolve(result);
      })
      .catch(err => {
        if (err.message.indexOf("video doesn't have subtitles")) {
          // reject(new NonExistentSubtitleError(`Non-auto Subtitles dont exist for ${videoId}`));
          reject(`Auto Subtitles dont exist for ${videoId}`);
        } else {
          reject(err);
        }
      })
    } else if (type === 'auto') {
      getAutoSubs(videoId)
      .then((url) => {
        const result = {
          automaticallyGenerated: true,
          url,
        };
        resolve(result);
      })
      .catch(err => {
        if (err.message.indexOf("Couldn't find automatic captions for")) {
          // reject(new NonExistentSubtitleError(`Auto Subtitles dont exist for ${videoId}`));
          reject(`Auto Subtitles dont exist for ${videoId}`);
        } else {
          reject(err);
        }
      });
    } else if (type === 'either') {
      getNonAutoSubs(videoId)
      .then((url) => {
        const result = {
          automaticallyGenerated: false,
          url,
        };
        resolve(result);
      })
      .catch(() => {
        getAutoSubs(videoId)
        .then((url) => {
          const result = {
            automaticallyGenerated: true,
            url,
          };
          resolve(result);
        })
        .catch(err => {
          if (err.message.indexOf("Couldn't find automatic captions for")) {
            // reject(new NonExistentSubtitleError(`Subtitles dont exist for ${videoId}`));
            reject(`Auto Subtitles dont exist for ${videoId}`);
          } else {
            reject(err);
          }
        });
      });
    }
  });
}

// export default getYoutubeSubtitleUrl;
module.exports = {
  default: getYoutubeSubtitleUrl
}

