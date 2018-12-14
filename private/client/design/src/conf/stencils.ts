import { IStencil } from "@src/state";

export const StencilRepo = [
    {
        name: 'Label',
        type: 'text',
        text: 'label',
        textAlign: 'left',
        verticalAlign: 'middle'
    },
    { name: 'Button', type: 'button', text: 'button' },
    {
        name: 'Facebook', type: 'login',
        auth: 'facebook', text: 'Login with Facebook',
        w: 60, h: 80,
    }
] as IStencil[];

