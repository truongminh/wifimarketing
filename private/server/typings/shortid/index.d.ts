// Type definitions for shortid
// Project: https://github.com/dylang/shortid
// Definitions by: Sam Saint-Pettersen <https://github.com/stpettersens>, Danny Arnold <https://github.com/despairblue>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped


interface ShortId {
  (): string,
  generate: () => string,
  characters: (string: string) => string,
  isValid: (id: any) => boolean,
  worker: (integer: number) => void,
  seed: (float: number) => void,
}

declare const shortid: ShortId;

declare module 'shortid' {
    export = shortid;
}
