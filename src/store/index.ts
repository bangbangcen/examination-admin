import { reactive } from 'vue';

type Store = {
  token: string,
  pmsTree: any,
  curView: string,
  visitedViews: any[],
  sideBarIsOpen: boolean
};
const srcStore = {
  token: "",
  pmsTree: null,
  curView: "",
  visitedViews: [],
  sideBarIsOpen: true
};
export const store: Store = reactive(srcStore);