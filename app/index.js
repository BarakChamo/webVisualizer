import 'styles/desktop.scss'

// Global polyfills
import 'utils/request-animation-frame'

// Audio components
import Player   from 'audio/player'
import Analyser from 'audio/analyser'

// Visual components
import Line from 'visuals/line'

// Initialize canvas
const canvas = document.createElement('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.body.appendChild(canvas)

// Initialize contexts
const audioCtx  = new (window.AudioContext || window.webkitAudioContext),
      canvasCtx = canvas.getContext('2d')

// Initialize audio components
const player       = new Player(audioCtx, 'audio/ratatat-drugs.mp3', 64),
      freqAnalyser = new Analyser(audioCtx, 'frequency'),
      timeAnalyser = new Analyser(audioCtx, 'timeDomain')

// Connect analyser to player
player.connect(freqAnalyser.getAnalyser())
player.connect(timeAnalyser.getAnalyser())

// Initialize visual components
const freqLine = new Line()
const timeLine = new Line({strokeStyle: 'orange'})

freqLine.loadSample(freqAnalyser.data)
timeLine.loadSample(timeAnalyser.data)

function render(ts){
  // Process audio
  freqAnalyser.analyse()
  timeAnalyser.analyse()

  // clear canvas
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height)

  // Draw visualization
  freqLine.draw(canvasCtx)
  timeLine.draw(canvasCtx)

  requestAnimationFrame(render)
}

// Kickstart visualization when audio is loaded
player.onLoad(function(){
  player.start()

  render(0)
})
