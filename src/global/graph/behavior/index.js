import hoverNode from './hover-node' // hover节点
import activeEdge from './active-edge' // 激活边
import selectNode from './select-node' // 选中节点行为
import deleteItem from './delete-item' // 删除节点
import dragNode from './drag-node' // 拖拽节点
import canvasEvent from './canvas-event' // 画布行为

export default G6 => {
    hoverNode(G6)
    activeEdge(G6)
    selectNode(G6)
    deleteItem(G6)
    dragNode(G6)
    canvasEvent(G6)
}