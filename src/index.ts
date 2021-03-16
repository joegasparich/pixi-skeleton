import Game from "./Game";
import "./app.scss";

import { AssetManager } from "managers";

import { Assets } from "./consts";
import "./CameraControl";

async function run(): Promise<void> {
    // Create game
    // Load Assets
    AssetManager.preLoadAssets(Object.values(Assets.SPRITES));

    // Load game
    await Game.load(progress => {
        console.log(`Game Load Progress: ${progress}%`);
    });
}

run();
