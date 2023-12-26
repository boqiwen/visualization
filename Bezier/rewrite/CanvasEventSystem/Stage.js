export class Stage {
  constructor(canvasBox) {
    this.context = canvasBox.getContext('2d');
    this.canvasBox = canvasBox;
  }
  // 解决 canvas 在高清屏上的模糊问题
  vagueHandle() {
    const dpr = window.devicePixelRatio;

    canvasBox.width = parseInt(canvasBox.style.width) * dpr;
    canvasBox.height = parseInt(canvasBox.style.height) * dpr;
    this.context.scale(dpr, dpr);
  }

  add(graph) {
    graph.draw(this.context);
  }
}