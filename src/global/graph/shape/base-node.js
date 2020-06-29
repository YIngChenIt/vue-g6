/**
 * 注册基础节点, 其他节点都在此基础上继承和扩展
 */

import itemEvents from './item-event'
import anchorEvent from './anchor-event'

export default G6 => {
    G6.registerNode('base-node', {
        initAnchor(cfg, group) {
            group.anchorShapes = []
            group.showAnchor = group => {
                this.drawAnchor(cfg, group)
            }
            group.clearAnchor = group => {
                group.anchorShapes && group.anchorShapes.forEach(a => a.remove())
                group.anchorShapes = []
            }
        },
        drawAnchor(cfg, group) {
            const { type, direction, anchorPointStyles } = group.getFirst().attr()
            const item = group.get('children')[0]
            const bBox = item.getBBox()

            // 绘制锚点坐标
            this.getAnchorPoints(cfg).forEach((p, i) => {
                const diff = type === 'triangle-node' ? (direction === 'up' ? 1 : 0) : 0.5
                const x = bBox.width * (p[0] - 0.5)
                const y = bBox.height * (p[1] - diff)

                /**
                 * 绘制三层锚点
                 * 最底层: 锚点bg
                 * 中间层: 锚点
                 * 最顶层: 锚点group, 用于事件触发
                 */
                // 视觉锚点
                const anchor = group.addShape('circle', {
                    attrs: {
                        x,
                        y,
                        ...anchorPointStyles,
                    },
                    zIndex: 1,
                    nodeId: group.get('id'),
                    className: 'node-anchor',
                    draggable: true,
                    isAnchor: true,
                    index: i,
                })

                // 锚点事件触发的元素
                const anchorGroup = group.addShape('circle', {
                    attrs: {
                        x,
                        y,
                        r: 11,
                        fill: '#000',
                        opacity: 0,
                    },
                    zIndex: 2,
                    nodeId: group.get('id'),
                    className: 'node-anchor-group',
                    draggable: true,
                    isAnchor: true,
                    index: i,
                });

                /**
                 * ! 添加锚点事件绑定
                 */
                anchorEvent(anchorGroup, group, p);

                group.anchorShapes.push(anchor);
                group.anchorShapes.push(anchorGroup);
            })

            // 查找所有锚点
            group.getAllAnchors = () => {
                return group.anchorShapes.filter(c => c.get('isAnchor') === true);
            }
            // 查找指定锚点
            group.getAnchor = (i) => {
                return group.anchorShapes.filter(c => c.get('className') === 'node-anchor' && c.get('index') === i);
            }
            // 查找所有锚点背景
            group.getAllAnchorBg = () => {
                return group.anchorShapes.filter(c => c.get('className') === 'node-anchor-bg');
            }
        },
        addLabel(cfg, group) {
            const { label, labelCfg } = group.getFirst().attr()
            group.addShape('text', {
                attrs: {
                    x: 0,
                    y: 0,
                    text: label || '',
                    ...labelCfg,
                },
                className: 'node-text',
                draggable: true,
            });
        },
        draw(cfg, group) {
            const attrs = this.getShapeStyle(cfg, group)
            const shape = group.addShape(this.shapeType, {
                className: `${this.shapeType}-shape`,
                draggable: true,
                attrs,
            })
            group.getItem = className => {
                return group.get('children').find(item => item.get('className') === className);
            }

            // 添加文本节点
            this.addLabel(cfg, group)
            // 添加锚点
            this.initAnchor(cfg, group)

            return shape
        },
        update(cfg, node) {
            const model = node.get('model');
            const { attrs } = node.get('keyShape');
            const text = node.get('group').getItem('node-text');
            const item = node.get('group').get('children')[0];

            setTimeout(() => {
                // 更新文本内容
                text && text.attr({
                    text: model.label,
                    labelCfg: attrs.labelCfg,
                });
                // 更新节点属性
                item.attr({ ...attrs, ...model.style });
            });
        },
        setState(name, value, item) {
            const buildInEvents = [
                'anchorShow',
                'anchorActived',
                'nodeState',
                'nodeState:default',
                'nodeState:selected',
                'nodeState:hover',
                'nodeOnDragStart',
                'nodeOnDrag',
                'nodeOnDragEnd',
            ];
            const group = item.getContainer()

            if (buildInEvents.includes(name)) {
                // 内部this绑定到了当前item实例
                itemEvents[name].call(this, value, group)
            } else {
                console.warn(`warning: ${name} 事件回调未注册!`)
            }
        },
        getAnchorPoints(cfg) {
            return cfg.anchorPoints || [
                [0.5, 0],
                [1, 0.5],
                [0.5, 1],
                [0, 0.5],
            ]
        }
    }, 'single-node')
}