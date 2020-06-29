function getItemStyle(type, group, state = 'hover') {
    const item = group.get('item');
    const attrs = group.getFirst().attr();
    const originStyle = type === 'node' ? item.get('originStyle') : item.get('originStyle')['edge-shape'];
    const activeStyle = attrs[`${type}State:${state}`];
    const defaultStyle = attrs[`${type}State:default`];

    if (type === 'edge' && defaultStyle && defaultStyle.lineWidth == null) {
        defaultStyle.lineWidth = 1;
    }

    return {
        activeStyle,
        defaultStyle,
        originStyle,
    };
}

function setStyle(item, nodeStyle, text, textStyle) {
    item.attr(nodeStyle);
    if (text) {
        text.attr(textStyle);
    }
}

const events = {
    anchorShow(value, group) {
        if (value) {
            group.showAnchor(group);
        } else {
            group.clearAnchor(group);
        }
    },
    edgeState(value, group) {
        events[`edgeState:${value}`].call(this, value, group)
    },
    'edgeState:default'(value, group) {
        if (value) {
            const { defaultStyle } = getItemStyle.call(this, 'edge', group);
            const edge = group.getChildByIndex(0);

            if (defaultStyle) {
                // 停止内部动画
                this.stopAnimate(group);
                setStyle(edge, defaultStyle);
            }
        }
    },
    'edgeState:hover'(value, group) {
        const path = group.getChildByIndex(0);
        const { endArrow } = path.get('attrs');
        const { activeStyle, defaultStyle, originStyle } = getItemStyle.call(this, 'edge', group, 'hover');

        if (!activeStyle) return;
        if (value) {
            if (activeStyle.animate === true) {
                this.runAnimate(group);
            } else if (typeof activeStyle.animate === 'function') {
                activeStyle.animate.call(this, group);
            } else {
                setStyle(path, activeStyle);
                if (endArrow) {
                    path.attr('endArrow', {
                        path: endArrow.path,
                        fill: activeStyle.stroke || originStyle.stroke,
                    });
                }
            }
        } else {
            if (activeStyle.animate === true) {
                // 停止动画
                this.stopAnimate(group);
            } else if (typeof activeStyle.animate === 'function') {
                activeStyle.animate.call(this, group, 'stop');
            } else {
                setStyle(path, defaultStyle);
                if (endArrow) {
                    path.attr('endArrow', {
                        path: endArrow.path,
                        fill: defaultStyle.stroke || activeStyle.stroke || originStyle.stroke,
                    });
                }
            }
        }
    },
    'edgeState:selected'(value, group) {
        const path = group.getChildByIndex(0);
        const { endArrow } = path.get('attrs');
        const { activeStyle, defaultStyle, originStyle } = getItemStyle.call(this, 'edge', group, 'selected');

        if (!activeStyle) return;
        if (value) {
            if (activeStyle.animate === true) {
                // 执行内部动画
                this.runAnimate(group);
            } else if (typeof activeStyle.animate === 'function') {
                // 执行外部动画
                activeStyle.animate.call(this, group);
            } else {
                setStyle(path, activeStyle);
                if (endArrow) {
                    path.attr('endArrow', {
                        path: endArrow.path,
                        fill: activeStyle.stroke || originStyle.stroke,
                    });
                }
            }
        } else {
            if (activeStyle.animate === true) {
                // 停止内部动画
                this.stopAnimate(group);
            } else if (typeof activeStyle.animate === 'function') {
                // 停止外部动画
                activeStyle.animate.call(this, group, 'stop');
            } else {
                setStyle(path, defaultStyle);
                if (endArrow) {
                    path.attr('endArrow', {
                        path: endArrow.path,
                        fill: defaultStyle.stroke || activeStyle.stroke || originStyle.stroke,
                    });
                }
            }
        }
    },
}

export default events