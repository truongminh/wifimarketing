
export module ObjNS {
  interface Style {
    top?: string;
    left?: string;
    position?: string;
    color?: string;
    fontSize?: string;
    fontWeight?: string;
  }
  interface Rect {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
  }
  interface Base<Attr> {
    id: string;
    name: string;
    attrs: Attr;
    style?: Style;
    rect?: Rect;
  }

  interface TextAttr {
    text?: string;
  }

  export interface Text extends Base<TextAttr> {
    type: 'text';
  }

  interface MediaAttr {
    src?: string;
  }

  export interface Image extends Base<MediaAttr> {
    type: 'image';
  }

  export interface Input extends Base<any> {
    type: 'input';
  }

  export type Obj = Text | Image | Input;
  export type Patch = Partial<Obj>;
}

