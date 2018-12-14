

export namespace NSContent {
    export interface INode {
        id: string;
    }
    export interface IPage {
        id: string;
        name: string;
        nodes: { [index: string]: INode };
    }
    export interface IViewport {
        width: number;
        height: number;
    }
    export interface ICreate {
        org_id: string;
        name: string;
    }
    export interface IUpdate {
        name: string;
        viewport: IViewport;
    }
    export interface IPageDiff {
        added?: IPage;
        removed?: IPage;
        updated?: IPage;
    }
    export interface INodeDiff {
        added?: INode;
        removed?: INode;
        updated?: { id: string, next: Partial<INode>, prev: Partial<INode> };
    }

    export interface IContent {
        id: string;
        org_id: string;
        name: string;
        pages: { [index: string]: NSContent.IPage };
        viewport: NSContent.IViewport;
    }

    export interface IRepo {
        Create(data: NSContent.ICreate): Promise<string>;
        Read(id: string): Promise<NSContent.IContent>;
        Update(id: string, data: Partial<NSContent.IUpdate>): Promise<number>;
        ByOrg(org_id: string): Promise<NSContent.IContent[]>;
        UpdatePages(id: string, diff: NSContent.IPageDiff): Promise<number>;
        UpdateNodes(id: string, page_id: string, diff: INodeDiff): Promise<number>;
    }
}

type INodeDiff = NSContent.INodeDiff;
