import { Context } from "@src/core";
import { StencilRepo } from "@src/conf";
import {
    SetContentState, ContentState,
    PageState, SetPageState, SetSibarState, SidebarState
} from "@src/state";
import { GetConfiguration, GetContentService } from "@src/service";
import { SetWNodeActive, NodeActiveSubject } from "@src/render";

export async function InitState(ctx: Context) {
    const contentService = GetContentService(ctx);
    const configuration = GetConfiguration(ctx);
    const contentId = configuration.ContentID;
    if (!contentId) {
        // create a new content
        const name = prompt('Enter content name');
        const id = await contentService.CreateContent(name);
        configuration.SetContentID(id);
        configuration.Reload();
    }
    try {
        const content = await contentService.LoadContent(configuration.ContentID);
        content.pages = content.pages || {};
        SetContentState(ctx, new ContentState(content));
        const pageState = new PageState();
        SetPageState(ctx, pageState);
        SetWNodeActive(ctx, new NodeActiveSubject(ctx));
        SetSibarState(ctx, new SidebarState(StencilRepo));
        const firstPage = Object.values(content.pages || {})[0];
        pageState.next(firstPage);
    } catch (e) {
        console.error(e);
        alert('Content not found');
        configuration.Exit();
        return;
    }
}
