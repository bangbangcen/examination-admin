import { store } from ".";

export function collapseMenuBar() {
  function dfs(node: any) {
    node.sideBarIsOpen = false;
    if (node.children) {
      node.children.forEach((_node: any) => {
        dfs(_node);
      });      
    }
  }
  dfs(store.pmsTree);
}