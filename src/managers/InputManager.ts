import * as util from "helpers/util";
import Vector from "vector";

export enum KEY {
    UP = "ArrowUp",
    DOWN = "ArrowDown",
    LEFT = "ArrowLeft",
    RIGHT = "ArrowRight",
    SPACE = "Space",
    A = "a",
    D = "d",
    S = "s",
    W = "w",
    X = "x",
    Z = "z",
    DOT = ".",
    COMMA = ",",
    LEFT_SQUARE_BRACKET = "[",
    RIGHT_SQUARE_BRACKET = "]",
}
export enum MOUSE_BUTTON {
    LEFT = 0,
    MIDDLE = 1,
    RIGHT = 2,
}

export type Button = KEY | MOUSE_BUTTON;

export type Input = {
    name: string;
    buttons: Button[];
};

export default class InputManager {

    // smh no enum class members
    public static readonly KEY = KEY;
    public static readonly MOUSE_BUTTON = MOUSE_BUTTON;

    private canvasPos: Vector;

    private keys: string[];
    private keysDown: string[];
    private keysUp: string[];

    private mousePos: Vector;
    private mouseButtons: number[];
    private mouseButtonsUp: number[];
    private mouseButtonsDown: number[];

    private registeredInputs: Map<Button, string>;
    private inputsHeld: string[];
    private inputsUp: string[];
    private inputsDown: string[];

    public constructor() {
        const canvas = document.getElementsByTagName("canvas")[0];
        this.canvasPos = new Vector(canvas.getBoundingClientRect().x, canvas.getBoundingClientRect().y);

        this.registeredInputs = new Map();
        this.inputsHeld = [];
        this.inputsDown = [];
        this.inputsUp = [];

        //-- Keyboard --//
        this.keys = [];
        this.keysDown = [];
        this.keysUp = [];

        document.addEventListener("keydown", (event: KeyboardEvent) => {
            if (Object.values(KEY).includes(event.key as KEY)) {
                event.preventDefault();
            }

            if (this.keys.includes(event.key)) return;
            this.keys.push(event.key);
            this.keysDown.push(event.key);

            const input = this.registeredInputs.get(event.key as KEY);
            if (this.inputsHeld.includes(input)) return;
            this.inputsHeld.push(input);
            this.inputsDown.push(input);
        });

        document.addEventListener("keyup", (event: KeyboardEvent) => {
            util.removeItem(this.keys, event.key);
            this.keysUp.push(event.key);

            const input = this.registeredInputs.get(event.key as KEY);
            util.removeItem(this.inputsHeld, input);
            this.inputsUp.push(input);
        });

        //-- Mouse --//
        this.mouseButtons = [];
        this.mouseButtonsDown = [];
        this.mouseButtonsUp = [];

        this.mousePos = Vector.Zero();
        document.addEventListener("mousemove", (event: MouseEvent) => {
            this.mousePos = new Vector(event.clientX, event.clientY).subtract(this.canvasPos);
        });

        document.addEventListener("mousedown", (event: MouseEvent) => {
            if (!(event.target instanceof HTMLCanvasElement)) {
                // Target was UI
                return;
            }
            if (Object.values(MOUSE_BUTTON).includes(event.button as MOUSE_BUTTON)) {
                event.preventDefault();
            }

            if (this.mouseButtons.includes(event.button)) return;
            this.mouseButtons.push(event.button);
            this.mouseButtonsDown.push(event.button);

            const input = this.registeredInputs.get(event.button as MOUSE_BUTTON);
            if (this.inputsHeld.includes(input)) return;
            this.inputsHeld.push(input);
            this.inputsDown.push(input);
        });

        document.addEventListener("mouseup", (event: MouseEvent) => {
            if (!(event.target instanceof HTMLCanvasElement)) {
                // Target was UI
                return;
            }

            const index = this.mouseButtons.indexOf(event.button);
            if (index !== -1) this.mouseButtons.splice(index, 1);
            this.mouseButtonsUp.push(event.button);

            const input = this.registeredInputs.get(event.button as MOUSE_BUTTON);
            util.removeItem(this.inputsHeld, input);
            this.inputsUp.push(input);
        });
    }

    public clearKeys(): void {
        // Reset one tick key lists
        this.inputsDown = [];
        this.inputsUp = [];
        this.keysDown = [];
        this.keysUp = [];
        this.mouseButtonsDown = [];
        this.mouseButtonsUp = [];
    }

    public registerInput(input: Input): void {
        input.buttons.forEach(button => {
            if (this.registeredInputs.get(button)) {
                console.error("Button: " + button.toString() + " already registered to " + input.name);
                return;
            }

            this.registeredInputs.set(button, input.name);
        });
    }

    public isKeyPressed(key: KEY): boolean {
        return this.keysDown.includes(key);
    }
    public isKeyHeld(key: KEY): boolean {
        return this.keys.includes(key);
    }
    public isKeyReleased(key: KEY): boolean {
        return this.keysUp.includes(key);
    }

    public getMousePos(): Vector {
        return this.mousePos;
    }
    public isMouseButtonPressed(button: MOUSE_BUTTON): boolean {
        return this.mouseButtonsDown.includes(button);
    }
    public isMouseButtonHeld(button: MOUSE_BUTTON): boolean {
        return this.mouseButtons.includes(button);
    }
    public isMouseButtonReleased(button: MOUSE_BUTTON): boolean {
        return this.mouseButtonsUp.includes(button);
    }

    public isInputPressed(input: Input): boolean {
        return this.inputsDown.includes(input.name);
    }
    public isInputHeld(input: Input): boolean {
        return this.inputsHeld.includes(input.name);
    }
    public isInputReleased(input: Input): boolean {
        return this.inputsUp.includes(input.name);
    }
}
