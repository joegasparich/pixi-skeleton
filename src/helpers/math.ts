import Vector from "../vector";

export type Rectangle = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export function pointInCircle(circlePos: Vector, radius: number, point: Vector): boolean {
    const dx = circlePos.x - point.x;
    const dy = circlePos.y - point.y;
    return (dx*dx + dy*dy) < radius*radius;
}

export function lineIntesectsCircle(lineStart: Vector, lineEnd: Vector, circlePos: Vector, circleRad: number): boolean {
    const ac = new Vector(circlePos.x - lineStart.x, circlePos.y - lineStart.y);
    const ab = new Vector(lineEnd.x - lineStart.x, lineEnd.y - lineStart.y);
    const ab2 = Vector.Dot(ab, ab);
    const acab = Vector.Dot(ac, ab);
    let t = acab / ab2;
    t = (t < 0) ? 0 : t;
    t = (t > 1) ? 1 : t;
    const h = new Vector((ab.x * t + lineStart.x) - circlePos.x, (ab.y * t + lineStart.y) - circlePos.y);
    const h2 = Vector.Dot(h, h);
    return h2 <= circleRad * circleRad;
}

export function circleIntersectsRect(boxPos: Vector, boxDim: Vector, circlePos: Vector, circleRad: number): boolean {
    const distX = Math.abs(circlePos.x - boxPos.x-boxDim.x/2);
    const distY = Math.abs(circlePos.y - boxPos.y-boxDim.y/2);

    if (distX > (boxDim.x/2 + circleRad)) { return false; }
    if (distY > (boxDim.y/2 + circleRad)) { return false; }

    if (distX <= (boxDim.x/2)) { return true; }
    if (distY <= (boxDim.y/2)) { return true; }

    const dx=distX-boxDim.x/2;
    const dy=distY-boxDim.y/2;
    return (dx*dx+dy*dy<=(circleRad*circleRad));
}

export function clamp (val: number, min: number, max: number): number {
    return Math.min(Math.max(val, min), max);
}

/**
 * Returns the hex value for the RGB value, eg. 0x2352FF
 * @param r Red value between 0 & 255
 * @param g Green value between 0 & 255
 * @param b Blue value between 0 & 255
 */
export function rgbToHex(r: number, g: number, b: number): number {
    return (r << 16) + (g << 8) + b;
}
/**
 * Returns and object containing the RGB values
 * @param hex The hex number to convert to RGB
 */
export function hexToRgb(hex: number): {r: number; g: number; b: number} {
    const r = (hex >> 16) & 0xFF;
    const g = (hex >> 8) & 0xFF;
    const b = hex & 0xFF;
    return {r, g, b};
}

/**
 * Converts an RGB color value to HSL
 * https://gist.github.com/mjackson/5311256
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
export function rgbToHsl(r: number, g: number, b: number): {h: number; s: number; l: number} {
    r /= 255, g /= 255, b /= 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s;
    const l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return { h, s, l };
}

/**
 * Converts an HSL color value to RGB
 * https://gist.github.com/mjackson/5311256
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
export function hslToRgb(h: number, s: number, l: number): {r: number; g: number; b: number} {
    let r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p: number, q: number, t: number): number => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3) * 255;
        g = hue2rgb(p, q, h) * 255;
        b = hue2rgb(p, q, h - 1/3) * 255;
    }

    return { r, g, b};
}

export function hslToHex(h: number, s: number, l: number): number {
    const {r, g, b} = hslToRgb(h, s, l);
    return rgbToHex(r, g, b);
}
export function hexToHsl(hex: number): {h: number; s: number; l: number} {
    const {r, g, b} = hexToRgb(hex);
    return rgbToHsl(r, g, b);
}

export function lerp (start: number, end: number, percent: number): number {
    return start + (end - start) * percent;
}

export function flip (t: number): number {
    return 1 - t;
}

export function square (t: number): number {
    return t * t;
}

export function easeIn (t: number): number {
    return square(t);
}

export function easeOut (t: number): number {
    return flip(square(flip(t)));
}

export function easeInOut (t: number): number {
    return lerp(easeIn(t), easeOut(t), t);
}

/**
 * Returns a random whole number between the two values
 * @param min The min number (inclusive)
 * @param max Ths max number (exclusive)
 */
export function randomInt (min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
}

export function randomFloat (min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export function randomBool (): boolean {
    return !!randomInt(0, 2);
}
