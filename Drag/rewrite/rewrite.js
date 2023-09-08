// index层级记录
let topLevel = 0;

class CreateDrag {
    constructor(activityBoxName, dragItemParams) {
        // 活动区域dom
        this.activityBox = document.querySelector(activityBoxName);

        // 拖拽内容参数
        this.dragItemParams = dragItemParams;

        this.init();
    }

    // 初始化
    init() {
        // 创建需要添加拖拽dom
        this.createDom();

        // 根据参数设置样式
        this.setParams();

        // 处理拖拽元素层级
        this.levelHandle(topLevel);

        // 边界处理
        this.boundaryHandle();

        // 添加拖拽效果
        this.addDraggingEffect();
    }

    // 创建需要添加拖拽dom
    createDom() {
        this.dragItemBox = document.createElement('div');
        this.activityBox.appendChild(this.dragItemBox);
    }

    // 根据参数设置样式
    setParams() {
        this.dragItemBox.style.position = 'absolute';
        this.dragItemBox.style.userSelect = 'none';
        this.dragItemBox.style.border = '1px solid #cccccc';

        this.dragItemBox.style.width = this.dragItemParams.width + 'px';
        this.dragItemBox.style.height = this.dragItemParams.width + 'px';
        this.dragItemBox.style.background = this.dragItemParams.backgroundColor;
        this.dragItemBox.style.top = this.dragItemParams.top + this.activityBox.offsetTop + 'px';
        this.dragItemBox.style.left = this.dragItemParams.left + this.activityBox.offsetLeft + 'px';
        this.dragItemBox.setAttribute('class', this.dragItemParams.className);
    }

    // 处理拖拽元素层级
    levelHandle(level) {
        this.dragItemBox.style.zIndex = level;

        topLevel ++
    }

    // 边界处理
    boundaryHandle() {
        this.minTop = this.activityBox.offsetTop;
        this.maxTop = this.activityBox.offsetTop + this.activityBox.offsetHeight - this.dragItemBox.offsetHeight;
        this.minLeft = this.activityBox.offsetLeft;
        this.maxLeft = this.activityBox.offsetLeft + this.activityBox.offsetWidth - this.dragItemBox.offsetWidth;
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

    moveFnBuild(e) {
        let topDiff = e.pageY - this.mousedownBaseTop,
            leftDiff = e.pageX - this.mousedownBaseLeft;

        if(topDiff > this.maxTop) topDiff = this.maxTop;
        if(leftDiff > this.maxLeft) leftDiff = this.maxLeft;
        if(topDiff < this.minTop) topDiff = this.minTop;
        if(leftDiff < this.minLeft) leftDiff = this.minLeft;

        this.dragItemBox.style.top = topDiff + 'px';
        this.dragItemBox.style.left = leftDiff + 'px';
    }
}