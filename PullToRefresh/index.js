class CreatePullToRefresh {
    constructor(className, refreshParams) {
        this.refreshBox = document.querySelector(className);

        this.refreshParams = refreshParams;

        this.resData = [];

        this.init();
    }

    init() {
        this.addDropdownArea();

        this.getItemData({code: 200}).then((res) => {
            this.setItemDom(res.data);
            this.setRefreshParams();
        });
    }

    // 设置刷新
    setRefreshParams() {
        // 内置样式
        this.refreshBox.setAttribute('class', 'styleBox');
        this.refreshBox.style.overflow = 'scroll';
        this.refreshBox.style.boxSizing = 'border-box';

        // 参数设置的样式
        this.refreshBox.style.height = this.refreshParams.height;
        this.startOffsetTop = this.refreshBox.querySelector(".itembox").offsetTop;

        let refreshFn = null;

        this.refreshBox.addEventListener('touchstart', (e) => {
            this.startTop = e.touches[0].clientY;

            // 绑定动作函数
            refreshFn = this.refreshHandle.bind(this, ...arguments);

            window.addEventListener("touchmove", refreshFn)
        });

        window.addEventListener('touchend', (e) => {
            window.removeEventListener('touchmove', refreshFn);
            this.reloadTimer = null;
            this.touchendHandle();
        })
    }

    // 设置move
    refreshHandle(e) {
        let differenceNum = e.touches[0].clientY - this.startTop,
            refreshBoxScrollTop = this.refreshBox.scrollTop;

        if (refreshBoxScrollTop === 0 && differenceNum > 0) {
            this.dropdownAreaHtml.style.height = this.differenceNumCount(differenceNum) + 'px';
            this.stateHandle('dropDown');
        } else {
            this.dropdownAreaHtml.style.height = '0px';
        }
    }

    // 添加阻力
    differenceNumCount(num) {
        let boxHeight = this.refreshBox.offsetHeight,
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

    // 确认刷新
    touchendHandle(e) {
        this.stateHandle('refreshing');


        this.getItemData({code: 200}).then((res) => {
            this.setItemDom(res.data);
            this.stateHandle('refreshCompleted');

            this.reloadTimer = setTimeout(() => {
                this.stateHandle('init');
            }, 1200)
        });
    }

    // 状态修改
    stateHandle(type) {
        switch(type) {
            case 'init':
                this.dropdownAreaHtml.innerHTML = '';
                this.dropdownAreaHtml.style.height = '0px';
                this.dropdownAreaHtml.style.transition = '';
                break;
            case 'dropDown':
                this.dropdownAreaHtml.innerHTML = this.refreshParams.dropDownText || '下拉刷新';
                break;
            case 'refreshing':
                this.dropdownAreaHtml.style.height = '40px';
                this.dropdownAreaHtml.innerHTML = this.refreshParams.refreshingText || '刷新中';
                this.dropdownAreaHtml.style.transition = 'all .8s';
                break;
            case 'refreshCompleted':
                this.dropdownAreaHtml.innerHTML = this.refreshParams.refreshCompletedText || '刷新完毕';
                break;
        }
    }

    // 下拉区域添加
    addDropdownArea() {
        let _dropdownAreaHtml = document.createElement("div");
        _dropdownAreaHtml.setAttribute('id', 'dropdownBox');
        _dropdownAreaHtml.style.height = '0px';
        _dropdownAreaHtml.style.textAlign = 'center';
        _dropdownAreaHtml.style.background = '#cccccc';

        this.refreshBox.appendChild(_dropdownAreaHtml);
        this.dropdownAreaHtml = document.querySelector("#dropdownBox");
    }

    // 获取页面数据
    getItemData(params) {
        return new Promise((resolve, reject) => {
            // 异步操作
            setTimeout(() => {
                this.resData.unshift({
                    name: this.resData.length + ' ' + this.resData.length
                });

                if (params.code) {
                    resolve({
                        code: '200',
                        data: this.resData
                    });
                } else {
                    console.log('没有返回');
                    reject('error');
                }
            }, 1000);
        });
    }

    // 设置页面内容
    setItemDom(setData) {
        let itemboxList = this.refreshBox.children;

        while (itemboxList.length > 1) {
            this.refreshBox.removeChild(itemboxList[1]);
        }

        setData.map((item) => {
            let _html = document.createElement("div");
            _html.setAttribute("class", 'itembox');
            _html.style.lineHeight = "60px";
            _html.style.textAlign = 'center';
            _html.innerHTML = item.name;
    
            this.refreshBox.appendChild(_html);
        })
    }
}