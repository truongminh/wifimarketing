import { ColorPicker } from "./color/color";
import { Context } from "@src/core";

export class InputElement {
    onValueChange = (v, commit = true) => { };
    setValue: (v) => void
    protected type = this.el.getAttribute('type');
    constructor(protected el: HTMLElement) {
    }
    protected formatValue(v) {
        return this.type === 'number' ? +v : v;
    }
}

class NativeInputElement extends InputElement {
    constructor(el: HTMLInputElement) {
        super(el);
        el.oninput = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            this.onValueChange(this.formatValue(el.value));
        }
        this.setValue = (v) => {
            el.value = v;
        }
    }
}

class PickerInputElement extends InputElement {
    constructor(el: HTMLElement) {
        super(el);
        el.querySelectorAll('[value]').forEach((child: HTMLElement) => {
            child.onclick = (e: MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                const value = child.getAttribute('value');
                this.onValueChange(this.formatValue(value));
            }
        });
        this.setValue = (v) => {
            el.querySelectorAll('[value]').forEach((child: HTMLElement) => {
                if (child.getAttribute('value') === v) {
                    child.setAttribute('active', 'true');
                } else {
                    child.removeAttribute('active');
                }
            });
        }
    }
}

class ToggleInputElement extends InputElement {
    constructor(el: HTMLElement) {
        super(el);
        el.onclick = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            let value = el.getAttribute('active') ? '' : el.getAttribute('value');
            this.onValueChange(this.formatValue(value));
        }
        this.setValue = (v) => {
            if (el.getAttribute('value') === v) {
                el.setAttribute('active', 'true');
            } else {
                el.removeAttribute('active');
            }
        }
    }
}

function enablePopup(el: HTMLElement, show: () => void, hide: () => void) {
    el.onclick = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        show();
        const backdrop = document.createElement('div');
        backdrop.style.position = 'fixed';
        backdrop.style.top = '0';
        backdrop.style.right = '0';
        backdrop.style.bottom = '0';
        backdrop.style.left = '0';
        document.body.append(backdrop);
        backdrop.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            backdrop.remove();
            hide();
        };
    }
}

class ColorPickerElement extends InputElement {
    private picker = new ColorPicker();
    private input = document.createElement('input');
    constructor(el: HTMLElement) {
        super(el);
        enablePopup(this.el, () => {
            this.picker.Show(this.el);
        }, () => {
            this.picker.Hide();
            this.onValueChange(this.picker.hex);
        });
        this.el.append(this.input);
        this.picker.onChange = ((hex) => {
            this.input.value = hex;
            this.input.style.color = hex;
            this.el.style.backgroundColor = hex;
            this.onValueChange(hex, false);
        });
        this.input.oninput = () => {
            const hex = this.input.value;
            if (hex) {
                this.onValueChange(hex);
                this.picker.hex = hex;
            }
        }
        this.setValue = (hex) => {
            this.picker.hex = hex;
            this.input.value = hex;
            this.input.style.color = hex;
            this.el.style.backgroundColor = hex;
        }
    }
}

export function NewControl(el: HTMLElement, ctx: Context): InputElement {
    const tagName = el.tagName.toUpperCase();
    switch (tagName) {
        case 'INPUT':
        // fall through
        case 'SELECT':
            return new NativeInputElement(el as HTMLInputElement);
        case 'PICKER':
            return new PickerInputElement(el);
        case 'TOGGLE':
            return new ToggleInputElement(el);
        case 'COLOR':
            return new ColorPickerElement(el);
    }
    return null;
}
