interface IBase {
    id: string;
    type: string;
    name: string;
    x: number;
    y: number;
    w: number;
    h: number;
    fontWeight: number | 'bold';
    fontFamily: string;
    color: string;
    fontSize: number;
    textDecoration: 'none' | 'underline' | 'line-through';
    backgroundColor: string;
    fontStyle: 'normal' | 'italic';
    textAlign: 'left' | 'center' | 'right' | 'justify';
    verticalAlign: 'top' | 'middle' | 'bottom';
    textTransform: 'uppercase';
    opacity: number;
}

export interface INodeText extends IBase {
    type: 'text';
    text: string;
}

export interface INodeInput extends IBase {
    type: 'input';
    placeholder: string;
}

export interface INodeButton extends IBase {
    type: 'button';
    text: string;
}

export interface INodeImage extends IBase {
    type: 'image';
    src: string;
}

export interface INodeVideo extends IBase {
    type: 'video';
    src: string;
}

export interface INodeLogin extends IBase {
    type: 'login';
    auth: 'facebook' | 'google';
    text: string;
}

export type INode =
    INodeText | INodeLogin |
    INodeButton |
    INodeImage | INodeVideo;
