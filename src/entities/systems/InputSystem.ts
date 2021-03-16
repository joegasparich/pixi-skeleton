import { SYSTEM, System } from ".";
import Vector from "vector";

export default abstract class InputSystem extends System {
    public id = SYSTEM.INPUT_SYSTEM;
    public type = SYSTEM.INPUT_SYSTEM;

    public inputVector: Vector = new Vector(0, 0);
}
