import { AssetManager, InputManager, SceneManager } from "./managers";
import Mediator from "./Mediator";

import { Application } from "@pixi/app";
import { SCALE_MODES } from "@pixi/constants";
import { settings } from "@pixi/settings";
import { Ticker } from "@pixi/ticker";

import { registerPixiInspector } from "./helpers/util";
import Camera from "Camera";
import { Entity } from "entities";
import Vector from "vector";
import Graphics from "Graphics";
import { Assets, Config, GameEvent, Inputs } from "./consts";
import TestScene from "./scenes/TestScene";
import { Container } from "@pixi/display";

type GameOpts = {
    windowWidth?: number;
    windowHeight?: number;
    backgroundColour?: number;
    enableDebug?: boolean;
    worldScale?: number;
    gameSpeed?: number;
};

const defaultOpts: GameOpts = {
    windowWidth: 800,
    windowHeight: 600,
    backgroundColour: 0x000000,
    enableDebug: false,
    worldScale: 16,
    gameSpeed: 1,
};

class Game {
    public app: Application;
    public stage: Container;
    public ticker: Ticker;

    public opts: GameOpts;

    public camera: Camera;

    private entities: Map<string, Entity>;
    private entitiesToAdd: Entity[];
    private entitiesToDelete: string[];

    // Managers
    public input: InputManager;
    public sceneManager: SceneManager;

    public constructor(opts: GameOpts) {
        this.opts = Object.assign(defaultOpts, opts);

        // Set PIXI settings
        settings.SCALE_MODE = SCALE_MODES.NEAREST;

        // Instantiate app
        this.app = new Application({
            width: opts.windowWidth,
            height: opts.windowHeight,
            backgroundColor: opts.backgroundColour,
        });

        this.stage = this.app.stage;

        // Start ticker
        this.ticker = new Ticker();
        this.ticker.start();

        registerPixiInspector();

        // Set up variables
        this.entities = new Map();
        this.entitiesToAdd = [];
        this.entitiesToDelete = [];

        // create view in DOM
        document.body.appendChild(this.app.view);
    }

    public async load(onProgress?: (progress: number) => void): Promise<void> {
        // Load Assets, all preloaded assets should be added to the manager at this point
        Mediator.fire(GameEvent.LOAD_START);
        await AssetManager.doPreLoad(onProgress);
        Mediator.fire(GameEvent.LOAD_COMPLETE);

        // Now that assets have been loaded we can set up the game
        await this.setup();
    }

    protected setup(): void {
        this.input = new InputManager();

        this.setupStage();

        this.camera = new Camera(new Vector(4, 4), 1);
        this.camera.scale = Config.CAMERA_SCALE;

        this.sceneManager = new SceneManager();
        this.sceneManager.loadScene(
            new TestScene(),
            (progress: number) => {
                console.log(`Map Load Progress: ${progress}%`);
            },
        );

        Graphics.init();

        // Register inputs
        Object.values(Inputs).forEach(input => {
            this.input.registerInput(input);
        });

        Mediator.fire(GameEvent.SETUP_COMPLETE);

        // start up the game loop
        this.ticker.add(this.loop.bind(this));
    }

    private setupStage(): void {
        this.app.stage.sortableChildren = true;

        AssetManager.getTexture(Assets.SPRITES.HERO);
    }

    /**
     * The main game loop.
     * @param delta ms since the last update
     */
    private loop(delta: number): void {
        delta *= this.opts.gameSpeed;

        this.preUpdate(delta);
        Mediator.fire(GameEvent.PRE_UPDATE, {delta, game: this});

        this.update(delta);
        Mediator.fire(GameEvent.UPDATE, {delta, game: this});

        this.postUpdate(delta);
        Mediator.fire(GameEvent.POST_UPDATE, {delta, game: this});

        // Reset tings
        this.input.clearKeys();
        this.pushCachedEntities();
        this.removeDeletedEntities();
    }

    protected preUpdate(delta: number): void {
        // Setup actions
        const scene = this.sceneManager.getCurrentScene();
        scene && scene.preUpdate();
        Graphics.preUpdate();

        this.entities.forEach(entity => {
            entity.preUpdate(delta);
        });
    }

    protected update(delta: number): void {
        // Game actions
        const scene = this.sceneManager.getCurrentScene();
        scene && scene.update();

        this.entities.forEach(entity => {
            entity.update(delta);
        });
    }

    protected postUpdate(delta: number): void {
        // Rendering actions
        const scene = this.sceneManager.getCurrentScene();
        scene && scene.postUpdate();

        Graphics.postUpdate();

        this.entities.forEach(entity => {
            entity.postUpdate(delta);
        });

        // ! Camera should be last to avoid stuttering
        this.camera.update();
    }

    public getEntities(): Entity[] {
        // TODO: Find out if its cheaper to also store an array of entities instead of converting it each time
        return Array.from(this.entities.values());
    }

    public registerEntity(entity: Entity): Entity {
        this.entitiesToAdd.push(entity);
        return entity;
    }

    public unregisterEntity(id: string): void {
        this.entitiesToDelete.push(id);
    }

    public clearEntities(): void {
        this.entities.forEach(entity => {
            entity.remove();
        });
        this.entities = new Map();
        this.entitiesToAdd = [];
        this.entitiesToDelete = [];
    }

    private pushCachedEntities(): void {
        this.entitiesToAdd.forEach(entity => {
            this.entities.set(entity.id, entity);
            entity.start();
        });
        this.entitiesToAdd = [];
    }

    private removeDeletedEntities(): void {
        this.entitiesToDelete.forEach(entityId => {
            this.entities.delete(entityId);
        });
        this.entitiesToDelete = [];
    }
}

export default new Game({
    windowWidth: Config.WINDOW_WIDTH,
    windowHeight: Config.WINDOW_HEIGHT,
    backgroundColour: Config.BACKGROUND_COLOUR,
    enableDebug: Config.ENABLE_DEBUG,
    worldScale: 16,
});
