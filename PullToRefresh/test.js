class CreatePullToRefresh {
    constructor(className, refreshParams) {
        this.refreshBox = document.querySelector(className);

        this.refreshParams = refreshParams;

        this.init();
    }

    init() {
        this.dropdownAreaHandle();
        this.getItemData();
        this.setItemDom();
        this.setRefreshParams();
    }

    // 设置刷新
    setRefreshParams() {
        // 内置样式
        this.refreshBox.setAttribute('class', 'styleBox');
        this.refreshBox.style.overflow = 'scroll';
        this.refreshBox.style.boxSizing = 'border-box';

        // 参数设置的样式
        this.refreshBox.style.height = this.refreshParams.height;

        let refreshFn = null;

        this.refreshBox.addEventListener('touchstart', (e) => {

            // 绑定动作函数
            refreshFn = this.refreshHandle.bind(this, ...arguments);

            window.addEventListener("touchmove", refreshFn)
        });

        window.addEventListener('touchend', (e) => {
            window.removeEventListener('touchmove', refreshFn);
        })
    }

    // 设置刷新
    refreshHandle(e) {
        //     this.refreshBox.prepend(this.dropdownAreaHtml);

        //     this.dropdownAreaHtml.style.height = '100px';
        let a = this.refreshBox.scrollTop;

        if(a === 0) {
            this.refreshBox.prepend(this.dropdownAreaHtml);
            setTimeout(() => {
                this.dropdownAreaHtml.style.height = '100px';
            }, 1000);
        } else {
            let dropdownDom = document.querySelector("#dropdownBox");
            if (dropdownDom) this.refreshBox.removeChild(dropdownDom);
        }

        // console.log(a);
            
        let b = document.querySelectorAll(".itembox");

        debugger
    }

    // 下拉区域处理
    dropdownAreaHandle() {
        let _dropdownAreaHtml = document.createElement("div");
        _dropdownAreaHtml.setAttribute('id', 'dropdownBox');
        _dropdownAreaHtml.style.height = '100px';
        _dropdownAreaHtml.style.textAlign = 'center';
        _dropdownAreaHtml.style.background = '#cccccc';
        _dropdownAreaHtml.innerHTML = '下拉';

        this.dropdownAreaHtml = _dropdownAreaHtml;
        // this.refreshBox.appendChild(_dropdownAreaHtml);
    }

    // 获取页面数据
    getItemData() {
        const resData = [{
            name: '11',
        }, {
            name: '11',
        }, {
            name: '11',
        }, {
            name: '11',
        }, {
            name: '11',
        }, {
            name: '11',
        }, {
            name: '11',
        }, {
            name: '11',
        }, {
            name: '11',
        }, {
            name: '11',
        }, {
            name: '11',
        }, {
            name: '11',
        }, {
            name: '11',
        }, {
            name: '11',
        }, {
            name: '11',
        }, {
            name: '11',
        }, {
            name: '22',
        }];

        this.resData = resData;
    }

    // 设置页面内容
    setItemDom() {
        let _itemHtml = document.createElement("div");

        //     _html.style.lineHeight = "60px";
        //     _html.style.textAlign = 'center';

        this.resData.map((item) => {
            // let _html = document.createElement("div");
            // _html.setAttribute("class", 'itemBox');
            // _html.innerHTML = item.name;
            // _itemHtml.appendChild(_html);

            let _html = document.createElement("div");
            _html.setAttribute("class", 'itembox');
            _html.innerHTML = item.name;
            _itemHtml.appendChild(_html);

        })

        this.refreshBox.appendChild(_itemHtml);
    }
}