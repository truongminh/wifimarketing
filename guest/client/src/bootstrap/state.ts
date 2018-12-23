import { Context } from "@src/core";
import { GetConfiguration, GetContentService } from "@src/service";
import { SetContentState, ContentState } from "@src/state";

export async function InitState(ctx: Context) {
    const contentService = GetContentService(ctx);
    const configuration = GetConfiguration(ctx);
    try {
        const content = await contentService.LoadContent(configuration.ContentID);
        content.pages = content.pages || {};
        SetContentState(ctx, new ContentState(content));
    } catch (e) {
        console.error(e);
        console.log('Content not found');
        configuration.Exit();
        return;
    }
}
