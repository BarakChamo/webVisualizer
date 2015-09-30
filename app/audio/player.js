import requestPromise from 'utils/request-promise'

export default class AudioPlayer {
  constructor(ctx, url, st = 0) {
    this.ctx = ctx

    // Params
    this.st = st

    // Initialize audio source
    this.source = this.ctx.createBufferSource()

    // Initialize promise to load audio file
    requestPromise(url, 'arraybuffer')
      .then(response => this.load(response))
      .catch(err => console.log(err))
  }

  load(buffer) {
    const self = this

    this.ctx.decodeAudioData(buffer, function(buffer) {
      self.source.buffer = buffer
      self.source.connect(self.ctx.destination)

      self._loaded = true

      self._onLoad()
    })
  }

  onLoad(fn) {
    if(self._loaded) return fn()

    this._onLoad = fn
  }

  connect(component) {
    this.source.connect(component)
  }

  getSource() {
    return this.source
  }

  start(st) {
    this.source.start(0, this.st)
  }

  stop() {
    this.source.stop()
  }
}