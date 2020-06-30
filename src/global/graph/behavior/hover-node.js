export default G6 => {
    G6.registerBehavior('hover-node', {
        getEvents() {
            return {
                'node:mouseenter': 'onNodeEnter',
                'node:mouseleave': 'onNodeLeave',
            }
        },
        onNodeEnter(e) {
            e.item.setState('anchorShow', true)
        },
        onNodeLeave(e) {
            e.item.setState('anchorShow', false)
        },
    })
}