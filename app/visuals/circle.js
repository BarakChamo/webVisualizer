export default class Circle {
  constructor(params) {
    this.params = _.extend({
      strokeStyle: 'green'
    }, params)
  }

  loadSample(data) {
    this.data = data
    this.points = data.byteLength
  }

  set(params) {
    this.params = _.extend(this.params, params)
  }

  update() {
  }

  draw(ctx, angleR = 0) {
    let midX = ctx.canvas.width / 2.0
    let midY = ctx.canvas.height / 2.0

    ctx.save()
    ctx.beginPath()

    let n_data = this.data.length - 128
    let scale = midY * 5
    let amp
    if (this.data) {
        for (let i = 0; i < n_data; i++) {
            angleR = i / n_data * 2 * Math.PI + Math.PI/2
            amp = Math.pow(this.data[i], 0.75)
            ctx.moveTo(midX, midY)
            ctx.lineTo(midX + Math.cos(angleR) * amp / 256.0 * scale, midY + Math.sin(angleR) * amp / 256.0 * scale)
        }
    }

    ctx.strokeStyle = this.params.strokeStyle
    ctx.stroke()
    ctx.restore()
  }
}

