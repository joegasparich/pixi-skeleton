import { Assets } from "consts";
import { Entity } from "entities";
import { RenderSystem } from "entities/systems";
import Vector from "vector";
import Game from "../Game";
import { Scene } from "./Scene";

export default class TestScene extends Scene {

    public name = "Test Scene";

    public start(): void {
        const dude = new Entity(
            new Vector(5, 5),
        );
        dude.addSystem(new RenderSystem(Assets.SPRITES.HERO));
    }

    public stop(): void {
        Game.clearEntities();
    }
}
