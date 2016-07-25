const PythonShell = require('python-shell');

function NonExistentSubtitleError(message) {
  this.message = message;
  this.stack = (new Error().stack);
}
NonExistentSubtitleError.prototype = Error.prototype;

function getAutoSubs(videoId) {
  return new Promise((resolve, reject) => {
    PythonShell.run('./youtube-dl/youtube_dl/__main__.py', {
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
    PythonShell.run('./youtube-dl/youtube_dl/__main__.py', {
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

function getYoutubeSubtitleUrl(videoId) {
  return new Promise((resolve, reject) => {
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
          reject(new NonExistentSubtitleError(`Subtitles dont exist for ${videoId}`));
        } else {
          reject(err);
        }
      });
    });
  });
}

module.exports = {
  default: getYoutubeSubtitleUrl,
};

