
export module ObjNS {
  interface Base {
    id: string;
    name: string;
  }

  export interface Text extends Base {
    type: 'text';
    text: string;
  }

  export interface Image extends Base {
    type: 'image';
    src: string;
  }

  export interface Input extends Base {
    type: 'input';
  }

  export type Obj = Text | Image | Input;
  export type Patch = Partial<Obj>;
}

