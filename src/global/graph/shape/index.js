import registerBaseNode from './base-node'
import registerEdge from './base-edge'
import registerNode from './node'

export default G6 => {
    registerBaseNode(G6)
    registerNode(G6)
    registerEdge(G6)
};
