export default class Line {
  constructor(params) {
    this.params = _.extend({
      strokeStyle: 'black'
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

  draw(ctx, push = 0, pull = 0) {
    let pointWidth = ctx.canvas.width / (this.points - push - pull)
    
    ctx.save()
      ctx.beginPath()
        ctx.moveTo(0, ctx.canvas.height / 2.0)

        for (let i = 0; i < this.points - push - pull; i++) {
          ctx.lineTo(i * pointWidth, ctx.canvas.height - this.data[i + push] / 256.0 * ctx.canvas.height )
        }

      ctx.strokeStyle = this.params.strokeStyle
      ctx.stroke()
    ctx.restore()
  }
}