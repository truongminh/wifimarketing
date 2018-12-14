import { Context } from "@src/core";
import {
    SetConfiguration, Configuration,
    SetContentService, ContentServiceBackend, ContentServiceLocalStorage,
    SetFileService, FileServiceBackend
} from "@src/service";

export function InitService(ctx: Context) {
    SetConfiguration(ctx, new Configuration());
    SetContentService(ctx, new ContentServiceLocalStorage(ctx));
    SetFileService(ctx, new FileServiceBackend(ctx));
}
