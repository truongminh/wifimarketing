import { Context } from '@src/core';
import { InitService } from './service';
import { InitState } from './state';
import { InitRender } from './render';
import { RegisterEvent } from './event';

export async function InitApp() {
    const ctx = new Context();
    // service
    InitService(ctx);
    // State
    await InitState(ctx);
    RegisterEvent(ctx);
    InitRender(ctx);
}
