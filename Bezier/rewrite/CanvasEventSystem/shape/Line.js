export class Line {
  constructor(prop) {
    this.prop = prop;
    this.prop.strokeStyle = this.prop.strokeStyle || 'green';
    this.prop.lineWidth = this.prop.lineWidth || 10;
    this.prop.startPoint = this.prop.startPoint || {
      x: 100,
      y: 100
    };
    this.prop.endPoint = this.prop.endPoint || {
      x: 200,
      y: 100
    };
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath()
    ctx.moveTo(this.prop.startPoint.x, this.prop.startPoint.y);
    ctx.lineTo(this.prop.endPoint.x, this.prop.endPoint.y);
    ctx.strokeStyle = this.prop.strokeStyle;
    ctx.lineWidth = this.prop.lineWidth;
    ctx.stroke();
    ctx.restore();
  }
}