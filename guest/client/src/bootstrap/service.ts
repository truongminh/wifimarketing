import { Context } from "@src/core";
import {
    SetConfiguration, Configuration,
    SetContentService, ContentServiceBackend, ContentServiceMem,
    SetFileService, FileServiceBackend
} from "@src/service";

export function InitService(ctx: Context) {
    SetConfiguration(ctx, new Configuration());
    SetContentService(ctx, new ContentServiceBackend(ctx));
    SetFileService(ctx, new FileServiceBackend(ctx));
}
