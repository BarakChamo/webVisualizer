const modes = {
  'frequency':  {
    bitLength: 1024
  },

  'timeDomain': {
    bitLength: 2048
  },

  'beats':      {
    bitLength: 32
  },

  'loudness':   {
    bitLength: 32
  }
}

// Audio Analysis detection
const minAmp     = -100, // Default: -100
      maxAmp     = 0,    // Default: -30
      minFreq    = 40,
      maxFreq    = 20000,
      minVal     = 135

// Beat detection constants
  var beatHoldTime  = 15,   // num of frames to hold a beat
      beatDecayRate = 0.97, // beat decay rate per frame
      beatMinVol    = 0.25, // minimum vol to consider a beat
      beatLevelUp   = 1.10  // Beat threashold after detection

export default class AudioAnalyser {
  constructor(ctx, mode = 'frequency') {
    this.analyser = ctx.createAnalyser()

    // Configure analyser
    this.mode = ( mode in modes ) ? mode : 'frequency'

    this.fftSize = this.analyser.fftSize = modes[this.mode].bitLength
    
    this.analyser.smoothingTimeConstant = 0.95
    this.analyser.minDecibels = minAmp
    this.analyser.maxDecibels = maxAmp


    // Initialize analysis array with actual value range
    this.data = new Uint8Array(this.analyser.frequencyBinCount)
  }

  getAnalyser() {
    return this.analyser
  }

  analyse() {
    return this[`_${this.mode}`](this.data)
  }

  /*
    Analysers
  */ 

  // Frequency analysis
  _frequency(data) {
    this.analyser.getByteFrequencyData(data)
    return this.data
  }

  // Waveform analysis
  _timeDomain(data) {
    this.analyser.getByteTimeDomainData(data)
    return this.data
  }

  // Beat Detection
  _beats(data) {
    this.beatCutOff = this.beatCutOff || 0
    this.beatTime   = this.beatTime   || 0

    this.beatData   = this.beatData || new Uint8Array(1)
    
    // Analyse levels
    this.analyser.getByteFrequencyData(data)

    // Calculate average level across frame
    const level = this.data.reduce((p, c) => p + c, 0) / this.data.length

    // if BEAT!
    if (level > this.beatCutOff){
      
      // Fill beatData array with beat level
      this.beatData.fill(level)

      // Re-assign beat cutoff to up the threashold
      this.beatCutOff = level * beatLevelUp

      // Start counting beat frames
      this.beatTime = 0

    } else {
      this.beatData.fill(0)
      
      if (this.beatTime <= beatHoldTime){
        this.beatTime ++
      }else{
        this.beatCutOff = Math.max( this.beatCutOff * beatDecayRate, beatMinVol )
      }
    }

    return this.beatData
  }

  // Beat Detection
  _loudness(data) {   
    this.levelData = this.levelData || new Uint8Array(1)
    
    // Analyse levels
    this.analyser.getByteFrequencyData(data)

    // Calculate average level across frame
    const level = this.data.reduce((p, c) => p + c, 0) / this.data.length

    this.levelData.fill(level)

    return this.levelData
  }

  /*
    Analysis Helpers
  */ 

  zeroCrossing(reverse = false) {
    let i = 0,
        l = this.analyser.frequencyBinCount,
        last_zero = -1,
        t

    // advance until we're zero or negative
    while ( ( i < l ) && ( this.data[i] > 128 ) ) i++

    // Check for buffer overflow
    if (i >= l) return 0

    // advance until we're above minVal, keeping track of last zero.
    while (( i < l ) && ( ( t = this.data[i] ) < minVal ) ) {
      if (t >= 128) {
        if (last_zero === -1) last_zero = i
      } else {
        last_zero = -1
      }

      i++
    }

    // we may have jumped over minVal in one sample.
    if (last_zero === -1) last_zero = i

    // We didn't find any positive zero crossings
    if (i === l) return 0

    // The first sample might be a zero.  If so, return it.
    if (last_zero === 0) return 0

    return last_zero
  }
}
