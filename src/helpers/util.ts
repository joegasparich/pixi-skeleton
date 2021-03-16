import { hexToRgb } from "./math";
import * as PIXI from "pixi.js";

export function removeItem<T>(array: T[], item: T): void {
    const index = array.indexOf(item);
    if (index > -1) {
        array = array.splice(index, 1);
    }
}

export function registerPixiInspector(): void {
    (window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__ &&  (window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });
}

export function hexToString(hex: number): string {
    if (hex === undefined) return undefined;

    const {r, g, b} = hexToRgb(hex);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
