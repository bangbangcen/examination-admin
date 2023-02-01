import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.scss';
import ViewUiPlus from 'view-ui-plus';
import 'view-ui-plus/dist/styles/viewuiplus.css';
import { columnWidth } from './directives/column-width';
import EditRoleModal from '@/components/modals/EditRoleModal.vue';
import MySubmenu from '@/layout/components/side-bar/MySubMenu.vue';

const app = createApp(App);
app.directive('columnWidth', columnWidth);
app.component('EditRoleModal', EditRoleModal);
app.component('MySubmenu', MySubmenu);
app.config.warnHandler = () => null;
app.use(router).use(ViewUiPlus).mount('#app');

const { _instance: { proxy }} = app as any;
export { proxy };