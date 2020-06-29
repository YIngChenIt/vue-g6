/**
 * @author claude
 * @date 2020/04/26
 * @description 注册工厂函数
 */

import shape from './shape';
import behavior from './behavior';

export default G6 => {
  // 注册图形
  shape(G6);
  // 注册行为
  behavior(G6);
};
