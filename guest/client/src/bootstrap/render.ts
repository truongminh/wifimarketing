import { Context } from "@src/core";
import { SetStageManager, StageManager } from "@render/stage";

export function InitRender(ctx: Context) {
    const div = document.getElementById('app-root');
    div.innerHTML = `
        <div id="stage"></div>
    `;
    // Element
    SetStageManager(ctx, new StageManager(
        document.getElementById('stage'),
        ctx,
    ));
}
