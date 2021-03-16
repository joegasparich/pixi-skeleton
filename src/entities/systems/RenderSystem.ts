import { System, SYSTEM } from ".";
import { AssetManager } from "managers";
import { Entity } from "entities";
import { SystemSaveData } from "./System";
import SpriteSheet from "SpriteSheet";
import Vector from "vector";
import Camera from "Camera";
import Game from "Game";
import { Sprite } from "@pixi/sprite";
import { ObservablePoint } from "@pixi/math";

interface RenderSystemSaveData extends SystemSaveData {
    spriteUrl: string;
    spriteSheet?: {
        cellWidth: number;
        cellHeight: number;
        pivot?: number[];
        index: number;
    };
    flipX: boolean;
    flipY: boolean;
    scale: number;
    pivot: number[];
    offset: number[];
    colour: number;
    alpha: number;
    visible: boolean;
}

export default class RenderSystem extends System {
    public id = SYSTEM.RENDER_SYSTEM;
    public type = SYSTEM.RENDER_SYSTEM;

    private spriteUrl: string;
    private spriteSheet: SpriteSheet;
    private spriteIndex: number;
    protected sprite: Sprite;

    public flipX: boolean;
    public flipY: boolean;
    public scale = 1;
    public pivot: Vector; // Relative to sprite size
    public offset: Vector; // Relative to world

    protected camera: Camera;

    public colour = 0xFFFFFF;
    public alpha = 1;
    public visible = true;

    public constructor(spriteUrl?: string, pivot?: Vector) {
        super();
        this.spriteUrl = spriteUrl ?? "";
        this.pivot = pivot ?? new Vector(0.5);
        this.offset = Vector.Zero();
    }

    public start(entity: Entity): void {
        super.start(entity);

        this.camera = Game.camera;

        // Set cached sprites if they exist
        if (this.spriteSheet) {
            this.setSpriteSheet(this.spriteSheet, this.spriteIndex);
        } else if (this.spriteUrl) {
            this.setSprite(this.spriteUrl);
        }
    }

    public postUpdate(delta: number): void {
        super.postUpdate(delta);

        if (!this.sprite) return;

        this.syncPosition();
        this.setColour();
    }

    public end(): void {
        Game.app.stage.removeChild(this.sprite);
    }

    public setSprite(spriteUrl: string): void {
        this.spriteUrl = spriteUrl;
        this.spriteSheet = undefined;

        if (this.hasStarted) {
            const sprite = new Sprite(AssetManager.getTexture(spriteUrl));
            this.updateSprite(sprite);
        }
    }

    public setSpriteSheet(spriteSheet: SpriteSheet, index: number): void {
        this.spriteUrl = spriteSheet.data.imageUrl;
        this.spriteSheet = spriteSheet;
        this.spriteIndex = index;

        if (this.hasStarted) {
            const sprite = new Sprite(spriteSheet.getTextureByIndex(index));
            this.updateSprite(sprite);
        }
    }

    protected updateSprite(sprite: Sprite): void {
        if (!sprite) {
            console.error("Failed to update sprite");
            return;
        }

        // Remove old sprite
        const app = Game.app;
        app.stage.removeChild(this.sprite);

        // Add new sprite
        this.sprite = sprite;
        app.stage.addChild(this.sprite);
        this.sprite.anchor.set(0.5);
        this.syncPosition();
    }

    protected setColour(): void {
        this.sprite.tint = this.colour;
        this.sprite.alpha = this.alpha;
        this.sprite.visible = this.visible;
    }

    protected syncPosition(): void {
        if (!this.sprite) return;

        this.sprite.scale = new Vector(this.camera.scale * this.scale).toObservablePoint();
        this.sprite.texture.rotate = this.getRotation();
        if (this.pivot) this.sprite.anchor.copyFrom(this.pivot.toPoint());

        // Sync postition
        this.sprite.position = this.camera.worldToScreenPosition(this.entity.position.add(this.offset)).toObservablePoint();
    }

    private getRotation(): number {
        if (!this.flipX && !this.flipY) return 0;
        if (this.flipX && !this.flipY) return 12;
        if (!this.flipX && this.flipY) return 8;
        if (this.flipX && this.flipY) return 4;
    }

    public save(): RenderSystemSaveData {
        return Object.assign({
            spriteUrl: this.spriteUrl,
            spriteSheet: this.spriteSheet && {
                cellWidth: this.spriteSheet.data.cellWidth,
                cellHeight: this.spriteSheet.data.cellHeight,
                pivot: this.spriteSheet.data.pivot && Vector.Serialize(this.spriteSheet.data.pivot),
                index: this.spriteIndex,
            },
            flipX: this.flipX,
            flipY: this.flipY,
            scale: this.scale,
            pivot: Vector.Serialize(this.pivot),
            offset: Vector.Serialize(this.offset),
            colour: this.colour,
            alpha: this.alpha,
            visible: this.visible,
        }, super.save());
    }

    public load(data: RenderSystemSaveData): void {
        super.load(data);

        this.spriteUrl = data.spriteUrl;
        this.flipX = data.flipX;
        this.flipY = data.flipY;
        this.scale = data.scale;
        this.pivot = Vector.Deserialize(data.pivot);
        this.offset = Vector.Deserialize(data.offset);
        this.colour = data.colour;
        this.alpha = data.alpha;
        this.visible = data.visible;

        if (data.spriteSheet) {
            this.spriteSheet = new SpriteSheet({
                imageUrl: data.spriteUrl,
                cellHeight: data.spriteSheet.cellHeight,
                cellWidth: data.spriteSheet.cellWidth,
                pivot: data.spriteSheet.pivot && Vector.Deserialize(data.spriteSheet.pivot),
            });
            this.spriteIndex = data.spriteSheet.index;

            this.setSpriteSheet(this.spriteSheet, this.spriteIndex);
        } else {
            this.setSprite(this.spriteUrl);
        }
    }
}
