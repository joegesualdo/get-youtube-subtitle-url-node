"use strict"
var getYoutubeSubtitleUrl = require('./../index.js').default
const loudRejection = require('loud-rejection');
loudRejection();
// let id = 'vKosBJ1Uko0'
// let id = 'q_q61B-DyPk'
let id ='TImPW-khOww' // Has nonauto
//let id = 'OFPwDe22CoY'
getYoutubeSubtitleUrl(id, {
  type: 'either'
})
.then((result) => {
  console.log(result)
})
.catch(err => {
  console.log(err)
})
