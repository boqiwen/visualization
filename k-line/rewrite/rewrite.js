class CreateKLineCanvas {
    constructor(canvasDom, canvasParams) {
        this.mainBox = document.querySelector(canvasDom) ;
        this.kLineParams = canvasParams;
        this.paddingNum = 60;

        this.init();
    }

    init() {
        this.createCanvas();

        this.computeBaseParams();

        // 绘制x轴和y轴
        this.drawAxis();

        // 画辅助线和刻度
        this.drawAxisMarks();

        // 绘制蜡烛图
        this.drawCandleChart();

        this.addMouseEvent();
    }

    // 创建画布
    createCanvas() {
        this.canvasBox = document.createElement("canvas");
        this.canvasBox.setAttribute('id', 'kLineCanvas');
        this.canvasBox.width = this.kLineParams.width;
        this.canvasBox.height = this.kLineParams.height;

        this.mainBox.appendChild(this.canvasBox);
    }

    // 也可以用三元表达式的方式
appendZero (obj) {
    if (obj < 10) {
        return '0' + obj
      } else {
        return obj
      }
}

    // 计算基础参数
    computeBaseParams() {
        this.kLineParams.data.map((item) => {
            let time = new Date(item.date)
            item.date = time.getFullYear() + '-' + (this.appendZero(time.getMonth() + 1)) + '-' + this.appendZero(time.getDate())
        })

        // // 计算y轴长度
        this.yAxisLength = this.kLineParams.height - this.paddingNum * 2;

        // // 计算x轴长度
        this.xAxisLength = this.kLineParams.width - this.paddingNum * 2;

        // 原点保存
        this.originInfo = {
            x: this.paddingNum,
            y: this.yAxisLength + this.paddingNum
        }

        // x轴顶点保存
        this.xEndInfo = {
            x: this.xAxisLength + this.paddingNum,
            y: this.yAxisLength + this.paddingNum
        }

        // y轴顶点保存
        this.yEndInfo = {
            x: this.paddingNum,
            y: this.paddingNum
        }

        // 总天数
        let totalDays = this.daysDifference(this.kLineParams.data[0].date, this.kLineParams.data[this.kLineParams.data.length - 1].date) + 1;

        // 计算x轴间距
        this.intervalNum = this.xAxisLength / totalDays;

        // 计算数值最大值
        this.maxNum = this.kLineParams.data.reduce((cur, max) => Math.max(cur, max.maxNum), 0);

        // 计算最小值
        let startNum = this.kLineParams.data[0].minNum;
        this.minNum = this.kLineParams.data.reduce((cur, min) => Math.min(cur, min.minNum), startNum) - 2;

        // 计算x轴间距
        this.xIntervalNum = (this.xAxisLength / totalDays).toFixed(2);

        // 计算y轴间距
        this.yIntervalNum = (this.yAxisLength / (this.maxNum - this.minNum)).toFixed(2); 

        this.rectWidth = 50;
    }

    // 计算两天的间隔
    daysDifference(startDate, endDate) {
        let date1 = new Date(startDate),
            date2 = new Date(endDate),
            time_difference = date2.getTime() - date1.getTime(),
            days_difference = time_difference / (1000 * 60 * 60 * 24);
    
        return days_difference;
    }

    // 计算x轴坐标
    computeXCoordinate(date) {
        // 计算间隔天数
        let daysDiff = this.daysDifference(this.kLineParams.data[0].date, date);

        // 计算距离原点距离
        let intervalOriginNum = daysDiff ? daysDiff * this.intervalNum : 0;

        return intervalOriginNum + this.originInfo.x;
    }

    // 根据数值返回y轴坐标
    computeYCoordinate(num) {
        let resNum = this.originInfo.y - num * this.yIntervalNum;

        return resNum;
    }

    // 根据x坐标返回数据
    computeXnum(x) {
        // 计算距离原点距离
        let intervalOriginNum = x - this.originInfo.x;

        // 计算间隔天数
        let daysDiff = Number((intervalOriginNum / this.intervalNum));

        let date = '';

        if(daysDiff < Math.round(daysDiff) + 0.5 && daysDiff > Math.round(daysDiff) - 0.5) {
            date = this.addDay(daysDiff + 1, this.kLineParams.data[0].date);
        }

        return date;
    }

    // 根据y坐标返回数据
    computeYnum(y) {
        let resNum = (this.originInfo.y - y) / this.yIntervalNum;

        return resNum.toFixed(0);
    }

    // 添加天数
    addDay(dayNumber, date) {
        date = date ? new Date(date) : new Date();
 
        var ms = dayNumber * (1000 * 60 * 60 * 24)
 
        var newDate = new Date(date.getTime() + ms);

        return newDate.toISOString().slice(0, 10);
    }

    // 绘制x轴和y轴
    drawAxis() {
        // x轴
        this.drawLine({
            x1: this.originInfo.x - this.xIntervalNum,
            y1: this.originInfo.y,
            x2: this.xEndInfo.x,
            y2: this.xEndInfo.y,
            lineColor: this.kLineParams.xAxisData.lineColor,
        });

        // y轴
        this.drawLine({
            x1: this.originInfo.x - this.xIntervalNum,
            y1: this.originInfo.y,
            x2: this.yEndInfo.x - this.xIntervalNum,
            y2: this.yEndInfo.y,
            lineColor: this.kLineParams.yAxisData.lineColor,
        });
    }

    // 绘制坐标轴准线和刻度文字
    drawAxisMarks() {
        this.kLineParams.data && this.kLineParams.data.map((item) => {
            // 绘制x轴刻度线和文字
            // 计算x轴坐标
            let xCoorNum = this.computeXCoordinate(item.date);

            if(xCoorNum != this.originInfo.x && (xCoorNum - this.originInfo.x) / this.intervalNum % 3 === 0) {
                this.drawLine({
                    x1: xCoorNum,
                    y1: this.originInfo.y,
                    x2: xCoorNum,
                    y2: this.yEndInfo.y,
                    lineColor: '#ccc',
                    dashRequire: true,
                })

                this.drawText(item.date, xCoorNum - 24, this.originInfo.y + 16, this.kLineParams.xAxisData.textColor);
            }
        })

        // 绘制y轴刻度线和文字
        let baseNum = (this.maxNum / 5).toFixed(0);

        for(let i = 1; i < 6; i++) {
            let yNum = baseNum * i;

            if(yNum > this.minNum && yNum < this.maxNum) {
                let yCoorNum = this.computeYCoordinate(yNum);

                this.drawLine({
                    x1: this.originInfo.x - this.xIntervalNum,
                    y1: yCoorNum,
                    x2: this.xEndInfo.x,
                    y2: yCoorNum,
                    lineColor: this.kLineParams.yAxisData.scaleLineColor,
                    dashRequire: true,
                });

                this.drawText(yNum + this.minNum, this.originInfo.x - this.xIntervalNum - 20, yCoorNum, this.kLineParams.yAxisData.textColor);
            }
        }
    }

    // 绘制蜡烛图
    drawCandleChart() {
        this.kLineParams.data.map((item) => {
            let yTopNum = Math.max(item.openingNum, item.closingNum),
                yBottomNum = Math.min(item.openingNum, item.closingNum),
                colorCheck = item.openingNum === Math.min(item.openingNum, item.closingNum) ? '#09ab63' : '#f33',
                heightNum = this.computeYCoordinate(yBottomNum) - this.computeYCoordinate(yTopNum);

            this.drawRect({
                type: 'fill',
                x: this.computeXCoordinate(item.date) - this.xIntervalNum/2,
                y: this.computeYCoordinate(yTopNum  - this.minNum),
                width: this.xIntervalNum,
                height: heightNum,
                color: colorCheck
            });
            
            this.drawLine({
                x1: this.computeXCoordinate(item.date),
                y1: this.computeYCoordinate(item.maxNum - this.minNum),
                x2: this.computeXCoordinate(item.date),
                y2: this.computeYCoordinate(item.minNum - this.minNum),
                lineColor: colorCheck,
            })
        });        
    }

    // 添加鼠标监听
    addMouseEvent() {
        this.canvasBox.addEventListener("mousemove", (e) => {
            // 清空
            let ctx = this.canvasBox.getContext("2d");
            ctx.clearRect(0, 0, this.kLineParams.width, this.kLineParams.height);
            
            // 重新绘制
            // 绘制x轴和y轴
            this.drawAxis();
            // 画辅助线和刻度
            this.drawAxisMarks();
            // 绘制蜡烛图
            this.drawCandleChart();

            let dateText = this.computeXnum(e.offsetX);

            if(dateText&& e.offsetX > this.originInfo.x - this.xIntervalNum && e.offsetX < this.xEndInfo.x) {
                this.drawLine({
                    x1: this.computeXCoordinate(dateText),
                    y1: 0,
                    x2: this.computeXCoordinate(dateText),
                    y2: this.originInfo.y,
                    dashRequire: true,
                });

                this.drawText(dateText, e.offsetX, this.originInfo.y + 30, "#000000");                  
            }
          
            if(e.offsetY < this.originInfo.y && e.offsetY > this.yEndInfo.y) {
                this.drawLine({
                    x1: this.originInfo.x,
                    y1: e.offsetY,
                    x2: this.xEndInfo.x,
                    y2: e.offsetY,
                    dashRequire: true,
                });
    
                this.drawText(Number(this.computeYnum(e.offsetY)) + this.minNum, this.originInfo.x, e.offsetY, "#000000");
            }

            this.drawTipArea(e.offsetX - 100, e.offsetY, dateText);
        })
    }

    // 绘制提示区域
    drawTipArea(x, y, dateText) {
        let width = 200;

        if(x > this.xEndInfo.x) x = this.xEndInfo.x - width;
        if(x < this.originInfo.x) x = this.originInfo.x;

        this.drawRect({
            x: x,
            y: 100,
            width: width,
            height: 50,
            type: 'fill',
            color: 'rgba(51, 51, 51, .8)',
        })

        let textInfo;

        this.kLineParams.data.map((item) => {
            if(!this.daysDifference(item.date, dateText)) {
                textInfo = item;
            }
        })

        if(textInfo) {
            this.drawText(`开盘${textInfo.openingNum}, 收盘${textInfo.closingNum}, 最高${textInfo.maxNum}, 最低${textInfo.minNum}`, x + 20, 120, '#fff');            
        }
    }

    // 绘制文字
    drawText(text, left, top, color) {
        const ctx = this.canvasBox.getContext('2d');

        ctx.beginPath();
        ctx.fillStyle = color || '#000000';// 设置填充画笔颜色
        ctx.font = '12px 黑体';// 设置字体大小
        ctx.fillText(text, left, top);// 绘制 "实心" 文字
        ctx.closePath();
    }

    /**
     * 绘制直线
     * @param { Number } x1 开始坐标x轴
     * @param { Number } y1 开始坐标y轴
     * @param { Number } x2 结束坐标x轴
     * @param { Number } y2 结束坐标y轴
     * @param { String } lineColor 线条颜色
     * @param { Boolean } dashRequire 是否绘制虚线
     * @param { Number } lineThickness 线条宽度
     */
    drawLine(params) {
        let ctx = this.canvasBox.getContext("2d");

        // 创建一个路径
        ctx.beginPath();

        // 绘制虚线
        if(params.dashRequire) {
            ctx.setLineDash([5, 5]);
        }
        
        // 移动开始位置点
        ctx.moveTo(params.x1, params.y1);

        // 移动到的位置点
        ctx.lineTo(params.x2, params.y2);

        // 绘制线条
        ctx.strokeStyle = params.lineColor || '#000000';
        ctx.lineWidth = params.lineThickness || 1;
        ctx.stroke();
        ctx.closePath();

        // 还原实线
        ctx.setLineDash([]);
    }

    /**
     * 绘制矩形
     * @param { Number } x 开始坐标x轴
     * @param { Number } y 开始坐标y轴
     * @param { Number } width 矩形宽度
     * @param { Number } height 矩形高度
     * @param { String } type 矩形类型 stroke/fill
     * @param { String } color 矩形颜色
     */
    drawRect(params) {
        const ctx = this.canvasBox.getContext("2d");

        ctx.beginPath();

        ctx.globalAlpha = params.alpha || 1;
        ctx.rect(params.x, params.y, params.width, params.height);

        if(params.type === 'stroke') {
            ctx.strokeStyle = params.color;
            ctx.stroke();
        } else {
            ctx.fillStyle = params.color;
            ctx.fill();
        }

        ctx.closePath();
    }
}