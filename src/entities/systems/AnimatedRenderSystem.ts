import { Texture } from "@pixi/core";
import { AnimatedSprite } from "@pixi/sprite-animated";
import Vector from "vector";
import { RenderSystem, SYSTEM } from "../../entities/systems";

export class Animation {
    public name: string;
    public textures: Texture[];
    public speed: number;
    public loop: boolean;

    public constructor(name: string, textures: Texture[], speed = 0.25, loop = true) {
        this.name = name;
        this.textures = textures;
        this.speed = speed;
        this.loop = loop;
    }
}

// TODO: Make this serializable
export default class AnimatedRenderSystem extends RenderSystem {
    public id = SYSTEM.ANIMATED_RENDER_SYSTEM;
    public type = SYSTEM.RENDER_SYSTEM;

    private animations: Map<string, Animation>;
    private currentAnimation: Animation;

    public constructor(animations?: Animation[], pivot?: Vector) {
        super(undefined, pivot);

        this.animations = new Map();

        this.setAnimations(animations);
    }

    public setAnimations(animations: Animation[]): void {
        animations?.forEach(animation => this.animations.set(animation.name, animation));
    }

    public setAnimation(key: string): void {
        if (!this.hasStarted) {
            console.error("System hasn't been started yet");
            return;
        }
        if (!this.animations.has(key)) {
            console.error("Tried to play nonexistent animation " + key);
        }
        if (this.currentAnimation?.name === key) {
            return;
        }

        const animation = this.animations.get(key);
        const animatedSprite = new AnimatedSprite(animation.textures);
        animatedSprite.animationSpeed = animation.speed;
        animatedSprite.loop = animation.loop;

        this.currentAnimation = animation;
        this.updateSprite(animatedSprite);

        animatedSprite.play();
    }
}
