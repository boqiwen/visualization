// index层级记录
let topLevel = 0;

class CreateDrag {
    constructor(activityBoxName, dragItemParams) {
        // 活动区域dom
        this.activityBox = document.querySelector(activityBoxName);

        // 拖拽内容参数
        this.dragItemParams = dragItemParams;
        
        // 中心点计算
        this.canvasCenterPoint = {
            x: this.dragItemParams.width / 2,
            y: this.dragItemParams.height / 2
        };

        this.init();
    }

    // 初始化
    init() {
        // 创建需要添加拖拽dom
        this.createDom();

        // 处理拖拽元素层级
        this.levelHandle(topLevel);

        // 边界处理
        this.boundaryHandle();

        // 添加拖拽效果
        this.addDraggingEffect();

        this.dragItemBox.addEventListener("click", (e) => {
            this.onclick(e);
        })
    }

    // 创建需要添加拖拽dom
    createDom() {
        this.dragItemBox = document.createElement('canvas');
        this.activityBox.appendChild(this.dragItemBox);
        // 根据参数设置样式
        this.setParams();
        this.drawCanvasGraphics();
    }

    // 根据参数设置样式
    setParams() {
        this.dragItemBox.style.userSelect = 'none';
        this.dragItemBox.style.position = 'absolute';
        this.dragItemBox.style.top = this.dragItemParams.centerY - this.canvasCenterPoint.y + this.activityBox.offsetTop + 'px';
        this.dragItemBox.style.left = this.dragItemParams.centerX - this.canvasCenterPoint.x + this.activityBox.offsetLeft + 'px';
        this.dragItemBox.setAttribute('class', this.dragItemParams.className);

        // 解决锯齿
        let context = this.dragItemBox.getContext("2d"),
            width = this.dragItemParams.width,
            height = this.dragItemParams.height,
            devicePixelRatio = window.devicePixelRatio || 1,
            backingStoreRatio = context.webkitBackingStorePixelRatio
                || context.mozBackingStorePixelRatio
                || context.msBackingStorePixelRatio
                || context.oBackingStorePixelRatio
                || context.backingStorePixelRatio
                || 1,
            ratio = devicePixelRatio / backingStoreRatio;
            
        this.dragItemBox.style.width = width + "px";
        this.dragItemBox.style.height = height + "px";
        this.dragItemBox.height = height * ratio;
        this.dragItemBox.width = width * ratio;
        context.scale(ratio, ratio);
    }

    // 绘制canvas图形（圆形）
    drawCanvasGraphics() {
        let ctx = this.dragItemBox.getContext('2d');

        ctx.beginPath();
        ctx.fillStyle = this.dragItemParams.backgroundColor;
        ctx.arc(this.canvasCenterPoint.x, this.canvasCenterPoint.y, this.dragItemParams.r, 0, 2 * Math.PI);
        ctx.fill();
    
        ctx.closePath();
    }

    // 处理拖拽元素层级
    levelHandle(level) {
        this.dragItemBox.style.zIndex = level;

        topLevel ++
    }

    // 边界处理
    boundaryHandle() {
        this.minTop = this.activityBox.offsetTop - this.canvasCenterPoint.y + this.dragItemParams.r;
        this.maxTop = this.activityBox.offsetTop + this.activityBox.offsetHeight - this.dragItemBox.offsetHeight + this.canvasCenterPoint.y - this.dragItemParams.r;
        this.minLeft = this.activityBox.offsetLeft - this.canvasCenterPoint.x + this.dragItemParams.r;
        this.maxLeft = this.activityBox.offsetLeft + this.activityBox.offsetWidth - this.dragItemBox.offsetWidth + this.canvasCenterPoint.y - this.dragItemParams.r;
    }

    // 添加拖拽效果
    addDraggingEffect() {
        let moveFn;

        this.dragItemBox.addEventListener("mousedown", (e) => {
            this.mousedownBaseTop = e.pageY - this.dragItemBox.offsetTop;
            this.mousedownBaseLeft = e.pageX - this.dragItemBox.offsetLeft;
            this.levelHandle(topLevel);

            moveFn = this.moveFnBuild.bind(this, ...arguments);

            window.addEventListener("mousemove", moveFn);
        })

        window.addEventListener("mouseup", (e) => {
            window.removeEventListener("mousemove", moveFn);
        })
    }

    onclick(e) {}

    moveFnBuild(e) {
        let topDiff = e.pageY - this.mousedownBaseTop,
            leftDiff = e.pageX - this.mousedownBaseLeft;

        if(topDiff > this.maxTop) topDiff = this.maxTop;
        if(leftDiff > this.maxLeft) leftDiff = this.maxLeft;
        if(topDiff < this.minTop) topDiff = this.minTop;
        if(leftDiff < this.minLeft) leftDiff = this.minLeft;

        this.dragItemBox.style.top = topDiff + 'px';
        this.dragItemBox.style.left = leftDiff + 'px';

        this.throwCoordinate(leftDiff + this.dragItemParams.width / 2 , topDiff + this.dragItemParams.height / 2);
    }

    throwCoordinate(x, y) {}
}