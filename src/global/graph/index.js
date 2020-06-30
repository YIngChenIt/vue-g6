import G6ES from '@antv/g6/es/index'
import registerFactory from './register-factory'

class G6 {
    constructor(config = {}) {
        if (config.registerFactory) {
            // 内部注册组件, 行为, 事件等
            registerFactory(G6ES)

            this.init(config)
        } else {
            console.warn('registerFactory 方法未定义')
        }
    }

    init(config) {
        const options = Object.assign({
            container: 'canvasPanel',
            width: window.innerWidth,
            height: window.innerHeight,
            fitViewPadding: 20,
            animate: true,
            animateCfg: {
                duration: 500,
                easing: 'linearEasing',
            },
            layout: {
                type: 'dagre',
                nodesep: 30,
                ranksep: 30,
            },
            modes: {
                default: [
                    'drag-canvas',
                    'canvas-event',
                    'delete-item',
                    'select-node',
                    'hover-node',
                    'drag-node',
                    'active-edge',
                ],
            },
            // linkCenter:  true,
            defaultNode: {
                type: 'rect-node',
                style: {
                    radius: 10,
                },
            },
            defaultEdge: {
                type: 'polyline-edge', // polyline
                style: {
                    radius: 6,
                    offset: 15,
                    stroke: '#aab7c3',
                    lineAppendWidth: 10, // 防止线太细没法点中
                    endArrow: {
                        path: 'M 0,0 L 8,4 L 7,0 L 8,-4 Z',
                        fill: '#aab7c3',
                    },
                },
            },
            // 默认节点不同状态下的样式集合
            nodeStateStyles: {
                'nodeState:default': {
                    fill: '#E7F7FE',
                    stroke: '#1890FF',
                },
                'nodeState:hover': {
                    fill: '#d5f1fd',
                },
                'nodeState:selected': {
                    fill: '#caebf9',
                    stroke: '#1890FF',
                },
            },
            // 默认边不同状态下的样式集合
            edgeStateStyles: {
                'edgeState:default': {
                    stroke: '#aab7c3',
                },
                'edgeState:selected': {
                    stroke: '#1890FF',
                },
                'edgeState:hover': {
                    stroke: '#1890FF',
                },
            },
        }, config)

        delete options.registerFactory

        const instance = config.registerFactory(G6ES, options)

        if (instance) {
            this.instance = instance

            const { el } = this.instance.cfg.canvas.cfg
            // 记录画布移动的距离
            el.id = `${options.container}-canvas`
            el.setAttribute('dx', 0)
            el.setAttribute('dy', 0)

            document.addEventListener('click', e => {
                // 内部键盘事件是否可被触发
                el.setAttribute('isFocused', e.target.id === el.id)
            })
        } else {
            console.warn('未返回G6实例')
        }
    }
}

export default G6