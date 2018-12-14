import { Context } from "@src/core";
import {
    SetStageManager, StageManager,
    SidebarManager, RightSidebar, 
    Topbar
} from "@src/render";

export function InitRender(ctx: Context) {
    const div = document.getElementById('app-root');
    div.innerHTML = `
    <div id="topbar">
        <div id="logo"></div>
        <div id="topbar-left"></div>
        <div id="topbar-center"></div>
        <div id="topbar-right"></div>
    </div>
    <div id="main">
        <div id="sidebar">
            <ul id="sidebar-menu"></ul>
            <div id="bottom-action"></div>
            <div id="sidebar-content"></div>
            <div id="sidebar-resize"></div>
        </div>
        <div id="main-content">
            <div id="stage"></div>
        </div>
        <div id="rightsidebar"></div>
    </div>`;
    // Element
    SetStageManager(ctx, new StageManager(
        document.getElementById('stage'),
        ctx,
    ));
    new SidebarManager(
        document.getElementById('sidebar'),
        ctx
    );
    new Topbar(
        document.getElementById('topbar'),
        ctx
    );
    new RightSidebar(
        document.getElementById('rightsidebar'),
        ctx
    );
}
