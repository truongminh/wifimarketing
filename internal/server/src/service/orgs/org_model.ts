
export interface IOrg {
    id: string;
    name: string;
    code: string;
}

export interface IOrgCreate {
    name: string;
    code: string;
}

export interface IOrgRepo {
    Create(data: IOrgCreate): Promise<string>;
    Read(id: string): Promise<IOrg | null>;
    Update(id: string, data: Partial<IOrgCreate>): Promise<number>;
    Search(q?: string): Promise<IOrg[]>;
    ByCode(code: string): Promise<IOrg | null>;
}
