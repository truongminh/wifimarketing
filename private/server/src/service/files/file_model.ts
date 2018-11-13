
export interface IFileEntry {
    id: string;
    type: 'text' | 'image' | 'video' | 'binary';
    mime: string;
    name: string;
    path: string;
    bytes: number;
    ctime: Date;
}

export interface IFileEntryCreate {
    mime: string;
    name: string;
    path: string;
    bytes: number;
}

export interface IFileRepo {
    Create(file: Partial<IFileEntry>): Promise<string>;
    Read(id: string): Promise<IFileEntry | null>;
    Search(q?: string): Promise<IFileEntry[]>;
    Delete(id: string): Promise<number>;
}

export interface IFileStorage {
    Import(subdir: string, title: string): Promise<Partial<IFileEntry>>;
    Delete(path: string): Promise<number>;
    BaseDir(): string;
}
