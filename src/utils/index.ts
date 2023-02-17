export function allEl(query: string) {
  return [...document.querySelectorAll(query)];
}

export function elChildren(query: string) {
  return [...(document.querySelector(query) as HTMLElement).children];
}

export function traverse(node: any, callback: Function) {
  function dfs(node: any) {
    callback(node);
    if (node.children) {
      node.children.forEach((_node: any) => {
        dfs(_node);
      });      
    }
  }
  if (Array.isArray(node)) {
    node.forEach((_node: any) => {
      dfs(_node);
    });
  }
  else {
    dfs(node);
  }
}

export function flatTree(arr: any) {
  let result: any = [];
  function dfs(node: any, level: number) {
    node.level = level;
    result.push(node);
    if (node.children) {
      node.children.forEach((_node: any) => {
        _node.arr = node.children;
        dfs(_node, level + 1);
      });
    }
  }
  if (arr) {
    arr.forEach((_node: any) => {
      dfs(_node, 0);
      _node.arr = arr;
    });
  }
  return result;
}

export function swap(a: any, b: any, prop: string) {
  const tmp = a[prop];
  a[prop] = b[prop];
  b[prop] = tmp;
}