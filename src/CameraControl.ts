import { lerp } from "helpers/math";
import Mediator from "Mediator";
import Game from "Game";
import { GameEvent, Inputs } from "consts";
import Vector from "vector";

const minZoom = 0.5;
const maxZoom = 10;
const moveSpeed = 5;

Mediator.on(GameEvent.UPDATE, update);

function update(opts: {delta: number}): void {
    const {delta} = opts;

    if (Game.input.isInputHeld(Inputs.ZoomIn)) {
        // zoom in
        Game.camera.scale = Math.exp(lerp(Math.log(Game.camera.scale), Math.log(maxZoom), 0.01));
    }
    if (Game.input.isInputHeld(Inputs.ZoomOut)) {
        // zoom out
        Game.camera.scale = Math.exp(lerp(Math.log(Game.camera.scale), Math.log(minZoom), 0.01));
    }

    const inputVector = new Vector(
        -Game.input.isInputHeld(Inputs.Left) + +Game.input.isInputHeld(Inputs.Right),
        -Game.input.isInputHeld(Inputs.Up) + +Game.input.isInputHeld(Inputs.Down),
    );

    if (inputVector.magnitude() > 0) {
        Game.camera.goToPosition(Game.camera.worldPosition.add(inputVector.multiply(moveSpeed / Game.camera.scale)));
    }
}
