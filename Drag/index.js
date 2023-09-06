// 限定要求描述：限定可拖拽范围 超出范围容器就不能拖动 鼠标超出返回到容器里面就可以重新移动图形
;(function() {
    let actionBox = document.querySelector("#actionBox"),
        operateItem = document.querySelector("#portabilityBox"),
        activeWidth = actionBox.offsetWidth,
        activeHeight = actionBox.offsetHeight
        itemWidth = operateItem.offsetWidth,
        itemHeight = operateItem.offsetHeight;

    operateItem.onmousedown = function() {
        console.log("mousedown");

        actionBox.onmousemove = function(e) {
            console.log("moving");

            let eventLeft = e.pageX,
                eventTop = e.pageY;

            if(eventLeft <= activeWidth && eventTop <= activeHeight) {
                operateItem.style.left = eventLeft - itemWidth/2 + 'px';
                operateItem.style.top = eventTop - itemHeight/2 + 'px';
            }
        }
    }

    window.onmouseup = function() {
        console.log('windowmouseup');

        actionBox.onmousemove = null;
    }
})()