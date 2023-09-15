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
        if(this.dragItemParams.type === 'refresh') {
            this.addRefreshDom();
        }

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
        this.dragItemBox.style.userSelect = 'none';
        this.dragItemBox.style.border = '1px solid #cccccc';

        this.dragItemBox.style.width = this.dragItemParams.width;
        this.dragItemBox.style.height = this.dragItemParams.height;
        this.dragItemBox.style.background = this.dragItemParams.backgroundColor;
        this.dragItemBox.style.top = this.dragItemParams.top + this.activityBox.offsetTop + 'px';
        if(this.dragItemParams.type === 'refresh') {
            this.dragItemBox.style.top = this.dragItemBox.offsetTop + this._refreshHtml.clientHeight + 'px';
        } else {
            this.dragItemBox.style.position = 'absolute';
        }
        this.dragItemBox.style.left = this.dragItemParams.left + this.activityBox.offsetLeft + 'px';
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

    // 添加事件函数
    addDraggingEffect() {
        let moveFn;

        this.dragItemBox.addEventListener(this.eventTypeHandle(0), (e) => {
            let pageY = this.isMobile ? e.touches[0].clientY : e.pageY,
                pageX = this.isMobile ? e.touches[0].clientX : e.pageX;

            this.mousedownBaseTop = pageY - this.dragItemBox.offsetTop;
            this.mousedownBaseLeft = pageX - this.dragItemBox.offsetLeft;
            this.levelHandle(topLevel);

            moveFn = this.moveFnBuild.bind(this, ...arguments);

            window.addEventListener(this.eventTypeHandle(1), moveFn);
        })

        window.addEventListener(this.eventTypeHandle(2), (e) => {
            window.removeEventListener(this.eventTypeHandle(1), moveFn);

            if(this.dragItemParams.type === 'refresh') {
                if(this.refreshRequire) {
                    this.touchendHandle();
                } else {
                    this.stateHandle('init');
                }                
            }
        })
    }

    // move函数处理
    moveFnBuild(e) {
        let pageY = this.isMobile ? e.touches[0].clientY : e.pageY,
            pageX = this.isMobile ? e.touches[0].clientX : e.pageX,
            topDiff = pageY - this.mousedownBaseTop,
            leftDiff = pageX - this.mousedownBaseLeft,
            itemScrollTop = this.dragItemBox.offsetTop;

        this.refreshRequire = false;

        if(this.dragItemParams.type === 'drag') {
            if(topDiff > this.maxTop) topDiff = this.maxTop;
            if(leftDiff > this.maxLeft) leftDiff = this.maxLeft;
            if(topDiff < this.minTop) topDiff = this.minTop;
            if(leftDiff < this.minLeft) leftDiff = this.minLeft;

            this.dragItemBox.style.top = topDiff + this.dragItemParams.top + 'px';
            this.dragItemBox.style.left = leftDiff + 'px';            
        } else if(this.dragItemParams.type === 'refresh') {
            if (itemScrollTop >= 0 && topDiff > 0) {
                if(topDiff > 200) {
                    this.refreshRequire = true;
                }
                
                this._refreshHtml.style.height = this.differenceNumCount(topDiff) + 'px';
                this.dragItemBox.style.top = this.differenceNumCount(topDiff) + this.dragItemParams.top + 'px';
                this.stateHandle('dropDown');
            }
        }
    }

    // 添加阻力
    differenceNumCount(num) {
        let boxHeight = this.activityBox.offsetHeight,
            percentageNum = num / boxHeight * 100;

        if(percentageNum < 5) {
            this.baseNum = num;
            return num;
        } else if(percentageNum > 5 && percentageNum < 15) {
            let resNum = this.baseNum + (num - this.baseNum) / 2
            this.secondaryNum = resNum;
            return resNum;
        } else if(percentageNum < 45) {
            let resNum = this.secondaryNum + (num - this.secondaryNum) / 10
            return resNum;
        }
    }

    // 状态修改
    stateHandle(type) {
        switch(type) {
            case 'init':
                this._refreshHtml.innerHTML = '';
                this._refreshHtml.style.height = '0px';
                this._refreshHtml.style.transition = '';
                this.dragItemBox.style.top = this.dragItemParams.top + this._refreshHtml.clientHeight + 'px';
                break;
            case 'dropDown':
                this._refreshHtml.innerHTML = this.dragItemParams.refreshParams.dropDownText || '下拉刷新';
                break;
            case 'refreshing':
                this._refreshHtml.style.height = '40px';
                this._refreshHtml.innerHTML = this.dragItemParams.refreshParams.refreshingText || '刷新中';
                this.dragItemBox.style.top = this.dragItemParams.top + this._refreshHtml.clientHeight + 'px';   
                this._refreshHtml.style.transition = 'all .8s';
                break;
            case 'refreshCompleted':
                this._refreshHtml.innerHTML = this.dragItemParams.refreshParams.refreshCompletedText || '刷新完毕';
                break;
        }
    }

    // 确认刷新
    touchendHandle() {}

    /**
     * 事件类型处理
     * @param { number } type 0触摸开始 1移动 2触摸结束
     * @returns { string } 返回对应事件类型名
     */
    eventTypeHandle(type) {
        let userAgentInfo = navigator.userAgent,
            Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'],
            getArr = Agents.filter(i => userAgentInfo.includes(i)),
            pcCompareData = ['mousedown', 'mousemove', 'mouseup'],
            mobileCompareData = ['touchstart', 'touchmove', 'touchend'],
            returnType;

        this.isMobile = getArr.length ? true : false;
        returnType = getArr.length ? mobileCompareData[type] : pcCompareData[type];
        return returnType;
    }

    // 添加刷新区域
    addRefreshDom() {
        this._refreshHtml = document.createElement("div");
        this._refreshHtml.style.height = '0px';
        this._refreshHtml.style.background = '#cccccc';
        this._refreshHtml.setAttribute("class", 'refreshBox');
        this._refreshHtml.style.textAlign = 'center';

        this.activityBox.appendChild(this._refreshHtml);
    }

    // 设置页面内容
    setItemDom(setHtml) {
        this.dragItemBox.innerHTML = setHtml;

        // 状态改变
        this.stateHandle('refreshCompleted');

        setTimeout(() => {
            this.stateHandle('init');
        }, 2000);
    }
}