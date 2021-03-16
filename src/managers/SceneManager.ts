import { Scene } from "scenes/Scene";

export default class SceneManager {
    private currentScene: Scene;

    public loadScene(scene: Scene, onProgress?: Function): void {
        if (this.currentScene) {
            console.log("Stopping scene:", this.currentScene.name);
            this.currentScene.stop();
        }

        this.currentScene = scene;

        console.log("Starting scene:", scene.name);
        scene.start();
    }

    public getCurrentScene(): Scene {
        return this.currentScene;
    }
}
