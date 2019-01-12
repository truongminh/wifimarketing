
export namespace ObjNS {
  interface Style {
    top?: string;
    left?: string;
    position?: string;
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    zIndex?: string;
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

  export namespace InputNS {
    interface TextAttr {
      placeholder: string;
    }

    export interface Text extends Base<TextAttr> {
      type: 'input:text';
    }

    export interface Checkbox extends Base<any> {
      type: 'input:checkbox';
    }
  }

  type Input = InputNS.Text | InputNS.Checkbox;
  export type Obj = Text | Image | Input;
  export type Patch = Partial<Obj>;
}

