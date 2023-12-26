export class Circle {
  constructor(prop) {
    this.prop = prop;
    this.prop.x = this.prop.x || 100;
    this.prop.y = this.prop.y || 100;
    this.prop.r = this.prop.r || 10;
    this.prop.fillStyle = this.prop.fillStyle || 'red';
    this.prop.strokeStyle = this.prop.borderColor || 'red';
    this.prop.lineWidth = this.prop.lineWidth || 10;
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.prop.fillStyle;
    ctx.strokeStyle = this.prop.strokeStyle;
    ctx.lineWidth = this.prop.lineWidth;
    ctx.arc(this.prop.x, this.prop.y, this.prop.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}