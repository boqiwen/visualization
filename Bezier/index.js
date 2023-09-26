class CreateBezierDrag {
  constructor(actionDom, params) {
    this.actionBox = document.querySelector(actionDom);

    this.canvasParams = params;

    this.init();
  }

  init() {
    this.initCanvas();
    this.initDate();

    this.initDragPoint();
  }

  // 创建画布
  initCanvas() {
    this.canvasBox = document.createElement("canvas");

    this.canvasBox.width = this.actionBox.offsetWidth;
    this.canvasBox.height = this.actionBox.offsetHeight;
    this.canvasBox.style.width = this.actionBox.offsetWidth;
    this.canvasBox.style.height = this.actionBox.offsetHeight;

    this.actionBox.appendChild(this.canvasBox);
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
        y: this.canvasBox.height / 4
      },

      controlPointTwo: {
        x: this.canvasBox.width * 3 / 4,
        y: this.canvasBox.height * 3 / 4
      },

      endPoint: {
        x: this.canvasBox.width,
        y: 0
      }
    }
  }

  // 创建拖拽点
  initDragPoint() {
    this.initDraw();

    // 基础参数
    let onePointDragData = {
      width: 20,
      height: 20,
      top: this.bezierParams.controlPoint.y - 10,
      left: this.bezierParams.controlPoint.x - 10,
      backgroundColor: '#ccc',
      className: 'redBox'
    }

    let twoPointDragData = {
      width: 20,
      height: 20,
      top: this.bezierParams.controlPointTwo.y - 10,
      left: this.bezierParams.controlPointTwo.x - 10,
      backgroundColor: '#ccc',
      className: 'redBox'
    }

    let controlPointOne = new CreateDrag('.actionBox', onePointDragData);
    controlPointOne.throwCoordinate = (x, y) => {
      this.bezierParams.controlPoint = {
        x: x - this.actionBox.offsetLeft + 10,
        y: y - this.actionBox.offsetTop + 10
      }

      this.initDraw();
    }

    if(this.canvasParams.type === 'cubic') {
      let controlPointTwo = new CreateDrag('.actionBox', twoPointDragData);
      controlPointTwo.throwCoordinate = (x, y) => {
        this.bezierParams.controlPointTwo = {
          x: x - this.actionBox.offsetLeft + 10,
          y: y - this.actionBox.offsetTop + 10
        }

        this.initDraw();
      }
    }
  }

  // 绘制
  initDraw() {
    // 清空
    let ctx = this.canvasBox.getContext("2d");
    ctx.clearRect(0, 0, this.canvasBox.width, this.canvasBox.height);

    this.drawCircle(this.bezierParams.controlPoint.x, this.bezierParams.controlPoint.y, 5);
    this.drawLine(this.bezierParams.initialPoint.x, this.bezierParams.initialPoint.y, this.bezierParams.controlPoint.x, this.bezierParams.controlPoint.y);
    this.initBezierBox();

    if(this.canvasParams.type === 'cubic') {
      this.drawCircle(this.bezierParams.controlPointTwo.x, this.bezierParams.controlPointTwo.y, 5);
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
    
    ctx.stroke();

    ctx.closePath();
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
}