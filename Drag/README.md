# 限定要求描述：限定可拖拽范围 超出范围容器就不能拖动 鼠标超出返回到容器里面就可以重新移动图形

## index为初次实现的单个拖拽
## rewrite为考虑更多细节后重写 包含多个拖拽

###### 注意点

## 出现的问题 拖拽时mouseup事件丢失: 使用mousedown + mousemove + mouseup实现拖拽移动 总会出现 mousemove过程中鼠标出现禁止的标且不进入mouseup事件 的情况 导致无法清除mousemove事件
## 问题原因: 受到了选中文本的影响
## 解决方法: 在需要拖拽的元素上加上一条css => user-select: none; 防止text选中移动影响 mouseup 事件的进入