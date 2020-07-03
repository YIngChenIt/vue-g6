import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/styles/main.less'
import 'ant-design-vue/dist/antd.css'
import { Row, Col, Form, Input,Button } from 'ant-design-vue';


Vue.component(Row.name, Row);
Vue.component(Col.name, Col);
Vue.component(Input.name, Input);
Vue.component(Form.Item.name, Form.Item);
Vue.component(Button.name, Button);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
