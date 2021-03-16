import Game from "Game";
import Vector from "vector";

export default class Camera {
    private target: Vector;
    public offset: Vector;

    public constructor(public worldPosition: Vector, public scale: number) {
        this.offset = new Vector(Game.opts.windowWidth/2, Game.opts.windowHeight/2);
    }

    public goToPosition(position: Vector): void {
        this.target = position;
    }

    public hasTarget(): boolean {
        return !!this.target;
    }

    public update(): void {
        if (this.target) {
            this.worldPosition = Vector.Lerp(this.worldPosition, this.target, 0.1 * Game.opts.gameSpeed);

            if (Vector.Distance(this.worldPosition, this.target) < 0.1) {
                this.target = undefined;
            }
        }
    }

    public worldToScreenPosition(worldPos: Vector): Vector {
        if (!worldPos) {
            console.error("No world position was provided");
            return;
        }

        return worldPos.subtract(this.worldPosition).multiply(Game.opts.worldScale * this.scale).add(this.offset);
    }

    public screenToWorldPosition(screenPos: Vector): Vector {
        if (!screenPos) {
            console.error("No screen position was provided");
            return;
        }

        return screenPos.subtract(this.offset).divide(Game.opts.worldScale * this.scale).add(this.worldPosition);
    }
}
