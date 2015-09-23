import requestPromise from 'utils/request-promise'

const audio = new (window.AudioContext || window.webkitAudioContext)

export default class AudioProcessor {
  constructor() {
    requestPromise('sdf')
        .then(data   => console.log(data))
        .catch(error => console.log(error))

  }

  start() {

  }

  stop() {

  }

  analyze() {

  }
}