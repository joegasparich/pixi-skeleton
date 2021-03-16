import { SYSTEM } from ".";
import AnimatedRenderSystem from "./AnimatedRenderSystem";
import RenderSystem from "./RenderSystem";
import System, { SystemSaveData } from "./System";

export function createSystem(systemData: SystemSaveData): System {
    switch(systemData.id) {
        case SYSTEM.RENDER_SYSTEM: return new RenderSystem();
        case SYSTEM.ANIMATED_RENDER_SYSTEM: return new AnimatedRenderSystem();
        default: return undefined;
    }
}
