import requestPromise from 'utils/request-promise'


const audio = new (window.AudioContext || window.webkitAudioContext)

export default class AudioProcessor {
  constructor() {
    this.canvas = document.createElement('canvas')
    this.canvasCtx = this.canvas.getContext('2d')
    this.canvas.width = 800
    this.canvas.height = 600
    document.body.appendChild(this.canvas)

    let promise = requestPromise('audio/ratatat-drugs.mp3', 'arraybuffer')
    promise.then(response => this.load(response))
    promise.catch(err => console.log(err))
  }

  load(buffer) {
    const self = this

    this.source = audio.createBufferSource()

    audio.decodeAudioData(buffer, function(buffer) {
      self.source.buffer = buffer
      self.source.connect(audio.destination)

      self.analyser = audio.createAnalyser()
      self.analyser.fftSize = 2048
      self.analyser.smoothingTimeConstant = 0

      self.source.connect(self.analyser)
      
      self.start()  
    })
  }

  start() {
    this.source.start(0)
    setInterval(() => this.analyse(), 1000.0 / 30)
  }

  stop() {
    this.source.start(0)
  }

  analyse() {
    this.dataArray = new Uint8Array(this.analyser.fftSize)
    this.analyser.getByteTimeDomainData(this.dataArray)
    this.draw()
  }

  draw() {
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.canvasCtx.beginPath()
    this.canvasCtx.moveTo(0, this.canvas.height / 2.0)
    let bitWidth = this.canvas.width / this.analyser.fftSize
    for (let i=0; i < this.analyser.fftSize; i++) {
      this.canvasCtx.lineTo(i*bitWidth, this.canvas.height - this.dataArray[i] / 256.0 * this.canvas.height )
      //console.log(this.dataArray[i] / 128.0)
    }
    // this.canvasCtx.closePath()
    this.canvasCtx.stroke()
  }
}