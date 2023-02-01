class Permission {
  constructor(parent: Permission) {
    this.id = -1;
    this.name = "";
    this.routeName = "";
    this.parentId = parent.id;
    this.level = parent.level + 1;
    this.children = [];
  }
  id: number;
  name: string;
  routeName: string;
  level: number;
  parentId: number | undefined;
  children: Permission[];
}

class PmsNode extends Permission {
  title: string = "";
  value: number = 0;
  selected: boolean = false;
  checked: boolean = false;
  expand: boolean = false;
  parent?: PmsNode;
  children: PmsNode[] = [];
}

class Role {
  constructor() {
    this.name = "";
    this.description = "";
  }
  name: string;
  description: string;
}

enum OP {
  EDIT,
  ADD
}

export {
  Permission,
  PmsNode,
  Role,
  OP
}