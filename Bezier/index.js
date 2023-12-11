class CreateBezierDrag {
  constructor(actionDom, params) {
    this.actionBox = document.querySelector(actionDom);

    this.canvasParams = params;
    this.bezierParams = null;

    this.init();
  }

  init() {
    this.initCanvas();
    this.initDate();
    this.initDraw();

    setTimeout(() => {
      this.initDragPoint();
    });
  }

  // 创建画布
  initCanvas() {
    this.canvasBox = document.createElement("canvas");
    this.actionBox.appendChild(this.canvasBox);

    // 解决锯齿
    let width = this.actionBox.offsetWidth,
      height = this.actionBox.offsetHeight,
      context = this.canvasBox.getContext("2d"),
      devicePixelRatio = window.devicePixelRatio || 1,
      backingStoreRatio = context.webkitBackingStorePixelRatio
        || context.mozBackingStorePixelRatio
        || context.msBackingStorePixelRatio
        || context.oBackingStorePixelRatio
        || context.backingStorePixelRatio
        || 1,
        ratio = devicePixelRatio / backingStoreRatio;

    this.canvasBox.style.width = width + "px";
    this.canvasBox.style.height = height + "px";
    this.canvasBox.height = height * ratio;
    this.canvasBox.width = width * ratio;
    context.scale(ratio, ratio);
  }

  // 初始化数据
  initDate() {
    this.bezierParams = {
      initialPoint: { x: 0, y: this.canvasBox.clientHeight },

      controlPoint: {
        x: this.canvasBox.clientWidth / 4,
        y: this.canvasBox.clientHeight / 4
      },

      controlPointTwo: {
        x: this.canvasBox.clientWidth * 3 / 4,
        y: this.canvasBox.clientHeight * 3 / 4
      },

      endPoint: { x: this.canvasBox.clientWidth, y: 0 }
    }
  }

  // 创建拖拽点
  initDragPoint() {
    // 基础参数
    let onePointDragData = {
      width: 30,
      height: 30,
      r: 10,
      centerY: this.bezierParams.controlPoint.y,
      centerX: this.bezierParams.controlPoint.x,
      backgroundColor: '#ccc',
      className: 'redBox'
    }

    let controlPointOne = new CreateDrag('.actionBox', onePointDragData);
    controlPointOne.throwCoordinate = (x, y) => {
      this.bezierParams.controlPoint = {
        x: x - this.actionBox.offsetLeft,
        y: y - this.actionBox.offsetTop
      }

      this.initDraw();
    }

    // 控制点点击事件测试
    controlPointOne.onclick = (e) => {
      console.log(e.pageX, e.pageY);
    }

    // 二次贝塞尔曲线的第二个控制点
    if(this.canvasParams.type === 'cubic') {
      let twoPointDragData = {...onePointDragData};
      twoPointDragData.centerX = this.bezierParams.controlPointTwo.x;
      twoPointDragData.centerY = this.bezierParams.controlPointTwo.y;

      let controlPointTwo = new CreateDrag('.actionBox', twoPointDragData);
      controlPointTwo.throwCoordinate = (x, y) => {
        this.bezierParams.controlPointTwo = {
          x: x - this.actionBox.offsetLeft,
          y: y - this.actionBox.offsetTop
        }

        this.initDraw();
      }
    }
  }

  // 绘制
  initDraw() {
    // 清空
    let ctx = this.canvasBox.getContext("2d");
    ctx.clearRect(0, 0, this.canvasBox.clientWidth, this.canvasBox.clientHeight);

    this.drawLine(this.bezierParams.initialPoint.x, this.bezierParams.initialPoint.y, this.bezierParams.controlPoint.x, this.bezierParams.controlPoint.y);
    this.initBezierBox();

    if(this.canvasParams.type === 'cubic') {
      this.drawLine(this.bezierParams.endPoint.x, this.bezierParams.endPoint.y, this.bezierParams.controlPointTwo.x, this.bezierParams.controlPointTwo.y);
    }
  }

  // 初始化贝塞尔曲线
  initBezierBox() {
    let ctx = this.canvasBox.getContext("2d");

    ctx.beginPath();

    ctx.moveTo(this.bezierParams.initialPoint.x, this.bezierParams.initialPoint.y);

    if(this.canvasParams.type === 'cubic') {
      ctx.bezierCurveTo(
        this.bezierParams.controlPoint.x, this.bezierParams.controlPoint.y,
        this.bezierParams.controlPointTwo.x, this.bezierParams.controlPointTwo.y,
        this.bezierParams.endPoint.x, this.bezierParams.endPoint.y
      );
    } else {
      ctx.quadraticCurveTo(this.bezierParams.controlPoint.x, this.bezierParams.controlPoint.y, this.bezierParams.endPoint.x, this.bezierParams.endPoint.y);
    }
    
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.closePath();
  }

  // 绘制直线
  drawLine(x1, y1, x2, y2) {
    let ctx = this.canvasBox.getContext("2d");

    ctx.beginPath();

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath(); // 闭合路径
    ctx.lineWidth = 1;
    ctx.stroke(); // 笔画绘制
    ctx.fill(); // 填充

    ctx.closePath();
  }
}