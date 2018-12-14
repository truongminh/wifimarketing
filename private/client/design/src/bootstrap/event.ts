import { Context } from "@src/core";
import { GetContentService } from "@src/service";
import { GetContentState, GetPageState } from "@src/state";

export function RegisterEvent(ctx: Context) {
    const contentService = GetContentService(ctx);
    const contentState = GetContentState(ctx);
    contentState.rxPageDiff.subscribe(diff => {
        contentService.HandlePageDiff(contentState.value.id, diff);
    });
    const pageState = GetPageState(ctx);
    pageState.rxNodeDiff.subscribe(diff => {
        contentService.HandleNodeDiff(contentState.value.id, pageState.value.id, diff);
    });
}
