import { Texture } from "@pixi/core";
import { Rectangle } from "@pixi/math";
import { AssetManager } from "managers";
import Vector from "vector";

export interface SpriteSheetData {
    cellWidth: number;
    cellHeight: number;
    pivot?: Vector;
    imageUrl: string;
}

export default class SpriteSheet {
    private texture: Texture;
    private rows: number;
    private cols: number;
    public data: SpriteSheetData;

    public constructor(data: SpriteSheetData) {
        if (!data.imageUrl) {
            console.error("Tried to create sprite sheet with no texture");
            return null;
        }

        this.texture = AssetManager.getTexture(data.imageUrl);
        this.rows = Math.floor(this.texture.height / data.cellWidth);
        this.cols = Math.floor(this.texture.width / data.cellWidth);
        this.data = data;
    }

    protected getRectFromIndex(index: number): Rectangle {
        const row = Math.min(index % this.cols, this.cols - 1);
        const col = Math.min(Math.floor(index / this.cols), this.rows - 1);

        return new Rectangle(
            row * this.data.cellWidth,
            col * this.data.cellHeight,
            this.data.cellWidth,
            this.data.cellHeight,
        );
    }

    public getTexture(): Texture {
        return this.texture;
    }

    public getTextureByIndex(id: number): Texture {
        return new Texture(this.texture.baseTexture, this.getRectFromIndex(id));
    }

    public getTexturesById(ids: number[]): Texture[] {
        return ids.map(id => this.getTextureByIndex(id));
    }
}
