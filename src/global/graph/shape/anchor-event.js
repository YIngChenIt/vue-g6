/**
 * 锚点事件
 */
let dragLog = [] // 记录鼠标坐标

let anchorNodeId = null // dragover 也会发生在拖拽的锚点上, 用于记录当前拖拽的节点id

export default (anchor, group, p) => {
    anchor.on('mouseenter', () => {
        anchor.attr({
            cursor: 'crosshair',
        })
    })

    anchor.on('dragstart', e => {
        if (anchorNodeId == null) {
            const { type, direction } = group.getFirst().attr()
            const diff = type === 'triangle-node' ? (direction === 'up' ? 1 : 0) : 0.5
            const bBox = group.get('item').getBBox()
            const id = group.get('item').get('id')
            const point = [
                bBox.width * (p[0] - 0.5),
                bBox.height * (p[1] - diff),
            ]

            dragLog = [e.x, e.y]

            const line = group.addShape('path', {
                attrs: {
                    stroke: '#1890FF',
                    lineDash: [5, 5],
                    path: [
                        ['M', ...point],
                        ['L', ...point],
                    ],
                },
                className: 'dashed-line',
                pointStart: point,
            })

            group.toFront()
            line.toFront()
            anchorNodeId = id
        }
    })

    anchor.on('drag', e => {
        const { type, direction } = group.getFirst().attr()
        const canvasBox = group.get('children')[0].get('canvasBox')
        const diff = type === 'triangle-node' ? (direction === 'up' ? canvasBox.height : 0) : canvasBox.height / 2
        const line = group.getItem('dashed-line')
        const pointStart = line.get('pointStart')
        const endPoint = [e.x - canvasBox.x - canvasBox.width / 2, e.y - canvasBox.y - diff]

        line.toFront()

        if (Math.sqrt(Math.pow(Math.abs(dragLog[0]) - Math.abs(e.x), 2) + Math.pow(Math.abs(dragLog[1]) - Math.abs(e.y), 2)) >= 10) {
            if (e.x >= dragLog[0]) {
                // 右下
                if (e.y >= dragLog[1]) {
                    endPoint[0] -= 1;
                    endPoint[1] -= 1;
                } else {
                    // 右上
                    endPoint[0] -= 1;
                    endPoint[1] -= 1;
                }
            } else {
                // 左上
                if (e.y >= dragLog[1]) {
                    endPoint[0] += 1;
                    endPoint[1] += 1;
                } else {
                    // 左下
                    endPoint[0] += 1;
                    endPoint[1] += 1;
                }
            }
        }

        line.attr({
            path: [
                ['M', ...pointStart],
                ['L', endPoint[0], endPoint[1]],
            ],
        })
    })

    anchor.on('dragend', e => {
        const item = group.getItem('dashed-line')
        item.remove()
        anchorNodeId = null
    })

    anchor.on('dragenter', e => {
        if (e.target.cfg.nodeId !== anchorNodeId) {
            const { index } = e.target.cfg

            if (group.getAllAnchorBg()[index]) {
                group.getAllAnchorBg()[index].attr('fillOpacity', 0.7)
            }
        }
    })

    anchor.on('dragleave', e => {
        if (e.target.cfg.nodeId !== anchorNodeId) {
            const { index } = e.target.cfg

            if (group.getAllAnchorBg()[index]) {
                group.getAllAnchorBg()[index].attr('fillOpacity', 0.5)
            }
        }
    })
}