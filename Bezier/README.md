## 实现可拖拽的 二次贝塞尔曲线 和 三次贝塞尔曲线( 原生js )
## 参考实现 https://cubic-bezier.com/#.41,.9,.31,.49

## canvas实现 通过点击的坐标判断点击的元素（这种方式只能在父级元素（canvas）上判断点击事件）

## 思考
## 拖拽点圆心计算 点击位置和圆心的偏移
## 考虑拖拽点形状（非圆形）
## 时间冒泡
## 如何去创造元素 重新封装 把拖拽点的绘制过程单独抽离
  * 封装元素对象 支持修改属性和添加事件
  * 考虑各个元素之间的层级概念

## 解决绘制的锯齿
### 问题原因: 
1.  devicePixelRatio = device pixel / CSS pixel
  如果 devicePixelRatio = 2 那么对于 200px * 200px 的图片要绘制到屏幕中，那么对应的屏幕像素(物理像素) 就是 400px * 400px

2.  例如: 在大部分高清屏中 webkitBackingStorePixelRatio = 1; devicePixelRatio = 2
  将一个 200px * 200px 的图片 Cavnas 绘制到该屏幕中的流程如下:
  webkitBackingStorePixelRatio = 1
  绘制到缓存区的大小也为：200px * 200px;
  devicePixelRatio = 2
  200px * 200px 的图片对应到屏幕像素为 400px * 400px, devicePixelRatio = 2 浏览器就把缓存区的 200px * 200px 宽高分别放大两倍渲染到屏幕中，所以就导致模糊

### 解决方法
  * context = this.canvasBox.getContext("2d"),
  * devicePixelRatio = window.devicePixelRatio || 1,
  * backingStoreRatio = context.webkitBackingStorePixelRatio
    || context.mozBackingStorePixelRatio
    || context.msBackingStorePixelRatio
    || context.oBackingStorePixelRatio
    || context.backingStorePixelRatio
    || 1,
  * ratio = devicePixelRatio / backingStoreRatio;
    
  * canvas.style.width = width + "px";
  * canvas.style.height = height + "px";
  * canvas.height = height * ratio;
  * canvas.width = width * ratio;
  * context.scale(ratio, ratio);
