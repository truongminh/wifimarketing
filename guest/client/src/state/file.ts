
export interface IFile {
    id: string;
    type: 'image' | 'video';
    name: string;
    path: string;
    bytes: number;
}
