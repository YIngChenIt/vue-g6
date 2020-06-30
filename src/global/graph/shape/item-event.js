function getItemStyle(type, group, state = 'hover') {
    const item = group.get('item')
    const attrs = group.getFirst().attr()
    const originStyle = type === 'node' ? item.get('originStyle') : item.get('originStyle')['edge-shape']
    const activeStyle = attrs[`${type}State:${state}`]
    const defaultStyle = attrs[`${type}State:default`]

    if (type === 'edge' && defaultStyle && defaultStyle.lineWidth == null) {
        defaultStyle.lineWidth = 1
    }

    return {
        activeStyle,
        defaultStyle,
        originStyle,
    }
}

function setStyle(item, nodeStyle, text, textStyle) {
    item.attr(nodeStyle)
    if (text) {
        text.attr(textStyle)
    }
}

const events = {
    anchorShow(value, group) {
        if (value) {
            group.showAnchor(group)
        } else {
            group.clearAnchor(group)
        }
    },
    anchorActived(value, group) {
        if (value) {
            const model = group.get('item').getModel()
            const {
                anchorPoints,
                anchorHotsoptStyles,
            } = model

            group.showAnchor(group)

            this.getAnchorPoints({ anchorPoints }).forEach((p, i) => {
                const bbox = group.get('children')[0].getBBox()
                // 激活元素
                const hotspot = group.addShape('circle', {
                    zIndex: 0,
                    attrs: {
                        x: bbox.minX + bbox.width * p[0],
                        y: bbox.minY + bbox.height * p[1],
                        r: 0,
                        opacity: 0.5,
                        fill: '#1890ff',
                        ...anchorHotsoptStyles,
                    },
                    nodeId: group.get('item').get('id'),
                    className: 'node-anchor-bg',
                    draggable: true,
                    isAnchor: true,
                    index: i,
                })

                // 锚点动画
                hotspot.animate({ r: 11 }, {
                    duration: 200,
                })

                group.sort(); // 将group中的元素按照 zIndex 从大到小排序
                group.anchorShapes.push(hotspot)
            });

            group.anchorShapes.filter(item => {
                if (item.get('className') === 'node-anchor') {
                    item.toFront()
                }
                if (item.get('className') === 'node-anchor-group') {
                    item.attr({
                        r: (anchorHotsoptStyles && anchorHotsoptStyles.r || 11) + 2,
                    });
                    item.toFront()
                }
            });
        } else {
            // 移除
            group.clearAnchor(group)
        }
    },
    edgeState(value, group) {
        events[`edgeState:${value}`].call(this, value, group)
    },
    nodeState(value, group) {
        events[`nodeState:${value}`].call(this, value, group)
    },
    'edgeState:default'(value, group) {
        if (value) {
            const { defaultStyle } = getItemStyle.call(this, 'edge', group)
            const edge = group.getChildByIndex(0)

            if (defaultStyle) {
                // 停止内部动画
                this.stopAnimate(group)
                setStyle(edge, defaultStyle)
            }
        }
    },
    'edgeState:hover'(value, group) {
        const path = group.getChildByIndex(0)
        const { endArrow } = path.get('attrs')
        const { activeStyle, defaultStyle, originStyle } = getItemStyle.call(this, 'edge', group, 'hover')

        if (!activeStyle) return
        if (value) {
            if (activeStyle.animate === true) {
                this.runAnimate(group)
            } else if (typeof activeStyle.animate === 'function') {
                activeStyle.animate.call(this, group)
            } else {
                setStyle(path, activeStyle)
                if (endArrow) {
                    path.attr('endArrow', {
                        path: endArrow.path,
                        fill: activeStyle.stroke || originStyle.stroke,
                    })
                }
            }
        } else {
            if (activeStyle.animate === true) {
                // 停止动画
                this.stopAnimate(group)
            } else if (typeof activeStyle.animate === 'function') {
                activeStyle.animate.call(this, group, 'stop')
            } else {
                setStyle(path, defaultStyle)
                if (endArrow) {
                    path.attr('endArrow', {
                        path: endArrow.path,
                        fill: defaultStyle.stroke || activeStyle.stroke || originStyle.stroke,
                    })
                }
            }
        }
    },
    'edgeState:selected'(value, group) {
        const path = group.getChildByIndex(0)
        const { endArrow } = path.get('attrs')
        const { activeStyle, defaultStyle, originStyle } = getItemStyle.call(this, 'edge', group, 'selected')

        if (!activeStyle) return
        if (value) {
            if (activeStyle.animate === true) {
                // 执行内部动画
                this.runAnimate(group)
            } else if (typeof activeStyle.animate === 'function') {
                // 执行外部动画
                activeStyle.animate.call(this, group)
            } else {
                setStyle(path, activeStyle)
                if (endArrow) {
                    path.attr('endArrow', {
                        path: endArrow.path,
                        fill: activeStyle.stroke || originStyle.stroke,
                    })
                }
            }
        } else {
            if (activeStyle.animate === true) {
                // 停止内部动画
                this.stopAnimate(group)
            } else if (typeof activeStyle.animate === 'function') {
                // 停止外部动画
                activeStyle.animate.call(this, group, 'stop')
            } else {
                setStyle(path, defaultStyle)
                if (endArrow) {
                    path.attr('endArrow', {
                        path: endArrow.path,
                        fill: defaultStyle.stroke || activeStyle.stroke || originStyle.stroke,
                    })
                }
            }
        }
    },
    'nodeState:default'(value, group) {
        if (value) {
            const node = group.getChildByIndex(0)
            const { defaultStyle } = getItemStyle.call(this, 'node', group)

            setStyle(node, defaultStyle)
        }
    },
    'nodeState:selected'(value, group) {
        const node = group.getChildByIndex(0)
        const { activeStyle, defaultStyle } = getItemStyle.call(this, 'node', group, 'selected')
        if (!activeStyle) return
        if (value) {
            setStyle(node, activeStyle)
        } else {
            setStyle(node, defaultStyle)
        }
    },
    'nodeState:hover'(value, group) {
        const node = group.getChildByIndex(0)
        const { activeStyle, defaultStyle } = getItemStyle.call(this, 'node', group, 'hover')

        if (!activeStyle) return
        if (value) {
            setStyle(node, activeStyle)
        } else {
            setStyle(node, defaultStyle)
        }
    }
}

export default events