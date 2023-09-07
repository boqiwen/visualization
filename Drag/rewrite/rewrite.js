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
        this.createDom();
    }

    // 创建需要添加拖拽dom
    createDom() {
        this.dragItemBox = document.createElement('div');
    
        this.dragItemBox.style.position = 'absolute';
        this.dragItemBox.style.width = this.dragItemParams.width + 'px';
        this.dragItemBox.style.height = this.dragItemParams.width + 'px';
        this.dragItemBox.style.background = this.dragItemParams.backgroundColor;
        this.dragItemBox.style.top = this.dragItemParams.top + 'px';
        this.dragItemBox.style.left = this.dragItemParams.left + 'px';
        this.dragItemBox.setAttribute('class', this.dragItemParams.className);

        this.activityBox.appendChild(this.dragItemBox);
    }

    // 添加拖拽效果
    addDraggingEffect() {

    }
}