import 'styles/desktop.scss'

// Global polyfills
import 'utils/request-animation-frame'

// Audio components
import Player   from 'audio/player'
import Analyser from 'audio/analyser'

// Visual components
import Line from 'visuals/line'
import Circle from 'visuals/circle'

// Initialize canvas
const canvas = document.createElement('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.body.appendChild(canvas)

// Initialize contexts
const audioCtx  = new (window.AudioContext || window.webkitAudioContext),
      canvasCtx = canvas.getContext('2d')

// Initialize audio components
const player       = new Player(audioCtx, 'audio/deadmau5-avaritia.mp3', 128),
      freqAnalyser = new Analyser(audioCtx, 'frequency'),
      timeAnalyser = new Analyser(audioCtx, 'timeDomain'),
      beatAnalyser = new Analyser(audioCtx, 'beats')

// Connect analyser to player
player.connect(freqAnalyser.getAnalyser())
player.connect(timeAnalyser.getAnalyser())
player.connect(beatAnalyser.getAnalyser())

// Initialize visual components
const freqLine = new Line()
const timeLine = new Line({strokeStyle: 'orange'})
const freqCircle = new Circle()

let lastFreqAnalysis
let freqAnalysis
let timeAnalysis


// Can do some interesting interpolation or maxing between previous 
// and current analysis for smoother and more informative visuals
lastFreqAnalysis = freqAnalysis
freqAnalysis = freqAnalyser.analyse()
timeAnalysis = timeAnalyser.analyse()


freqLine.loadSample(freqAnalysis)
timeLine.loadSample(timeAnalysis)
freqCircle.loadSample(freqAnalysis)

let currentTime

function render(ts){
  // Process audio
  freqAnalyser.analyse()
  timeAnalyser.analyse()
  // beatAnalyser.analyse()

  if (beatAnalyser.analyse()[0] !== 0) console.log('BEAT!')

  // clear canvas
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height)

  currentTime = Date.now()

  // Draw visualization
  freqLine.draw(canvasCtx)
  timeLine.draw(canvasCtx, timeAnalyser.zeroCrossing())
  freqCircle.draw(canvasCtx)
  requestAnimationFrame(render)
}

// Kickstart visualization when audio is loaded
player.onLoad(function(){
  player.start()
  render(0)
})
