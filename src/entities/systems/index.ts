export { default as System } from "./System";
export { default as RenderSystem } from "./RenderSystem";
export { default as AnimatedRenderSystem } from "./AnimatedRenderSystem";
export { default as InputSystem } from "./InputSystem";

export { createSystem } from "./createSystem";

export const SYSTEM = {
    RENDER_SYSTEM: "RENDER_SYSTEM",
    ANIMATED_RENDER_SYSTEM: "ANIMATED_RENDER_SYSTEM",
    INPUT_SYSTEM: "INPUT_SYSTEM",
};
