import 'styles/desktop.scss'

// Audio processor
import AudioWorker from './audio/audio'

const audioWorker = new AudioWorker()

// audioWorker.onmessage = message => console.log(message)
// audioWorker.onerror   = error   => console.log(error) 

// // Initialize audio webworker
// audioWorker.postMessage('URL')