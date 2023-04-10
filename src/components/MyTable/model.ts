type Column = {
  title: string;
  key?: string;
  slot?: string;
  flex?: number;
  editable?: boolean;
  expand?: boolean;
};

type Row = {
  hasChild?: boolean;
  children?: Array<Row>;
  [prop: string]: any;
};

export type {
  Column,
  Row
};