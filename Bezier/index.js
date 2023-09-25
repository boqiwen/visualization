class CreateBezierDrag {
  constructor(actionDom, params) {
    this.actionBox = document.querySelector(actionDom);
    this.actionBox.style.position = 'relative';

    this.canvasParams = params;

    this.init();
  }

  init() {
    this.initCanvas();
    this.initDate();
    this.createDragControl();
    this.initBezierBox();
  }

  // 初始化数据
  initDate() {
    this.bezierParams = {
      initialPoint: {
        x: 0,
        y: this.canvasBox.height
      },

      controlPoint: {
        x: this.canvasBox.width / 4,
        y: this.canvasBox.height / 2
      },

      endPoint: {
        x: this.canvasBox.width,
        y: 0
      }
    }
  }

  // 创建画布
  initCanvas() {
    this.canvasBox = document.createElement("canvas");

    this.canvasBox.width = this.canvasParams.width;
    this.canvasBox.height = this.canvasParams.height;
    this.canvasBox.style.width = this.canvasParams.width;
    this.canvasBox.style.height = this.canvasParams.height;

    this.actionBox.appendChild(this.canvasBox);
  }

  // 初始化贝塞尔曲线
  initBezierBox() {
    let ctx = this.canvasBox.getContext("2d");

    ctx.beginPath();

    ctx.moveTo(this.bezierParams.initialPoint.x, this.bezierParams.initialPoint.y);
    ctx.quadraticCurveTo(this.bezierParams.controlPoint.x, this.bezierParams.controlPoint.y, this.bezierParams.endPoint.x, this.bezierParams.endPoint.y);
    ctx.stroke();

    ctx.closePath();
  }

  // 创建拖拽点和连线
  createDragControl() {
    this.drawCircle(this.bezierParams.controlPoint.x, this.bezierParams.controlPoint.y, 5);
    this.drawLine(this.bezierParams.initialPoint.x, this.bezierParams.initialPoint.y, this.bezierParams.controlPoint.x, this.bezierParams.controlPoint.y);
    this.createDrop('dragDrop', this.bezierParams.controlPoint.x - 10, this.bezierParams.controlPoint.y - 10);
    this.addDragEvent();
  }

  // 绘制圆形
  drawCircle(x, y, r) {
    let ctx = this.canvasBox.getContext("2d");

    ctx.beginPath();

    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();

    ctx.closePath();
  }

  // 绘制直线
  drawLine(x1, y1, x2, y2) {
    let ctx = this.canvasBox.getContext("2d");

    ctx.beginPath();

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath(); // 闭合路径
    ctx.stroke(); // 笔画绘制
    ctx.fill(); // 填充

    ctx.closePath();
  }

  // 创建圆圈
  createDrop(domText, left, top) {
    this[domText] = document.createElement("div");
    this[domText].style.cssText = 'width: 20px; height: 20px; border-radius: 50%; background: #ccc; position: absolute; top: ' + top +'px; left:' + left +'px;';
    this[domText].className = domText;

    this.actionBox.appendChild(this[domText]);
  }

  addDragEvent() {
    let moveFn;

    this.dragDrop.addEventListener('mousedown', (e) => {
      moveFn = this.dragFn.bind(this, ...arguments);

      window.addEventListener("mousemove", moveFn);
    })
  }

  dragFn(e) {
    this.dragDrop.style.top  = 
  }
}