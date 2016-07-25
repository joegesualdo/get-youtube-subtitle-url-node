var getYoutubeSubtitleUrl = require('./../index.js').default

// let id = 'vKosBJ1Uko0'
// let id = 'q_q61B-DyPk'
let id ='TImPW-khOww'
getYoutubeSubtitleUrl(id)
.then((result) => {
  console.log(result)
})
.catch(err => {
  console.log(err)
})
