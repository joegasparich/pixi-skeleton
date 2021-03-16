import { Texture } from "@pixi/core";
import { Loader } from "@pixi/loaders";
import { Resource } from "resource-loader";

// Workaround for missing types for loader resources
type LoaderResource = Resource & {
    texture: Texture;
};

class AssetManager {
    private loader: Loader;
    private preloadedAssets: string[];

    public constructor() {
        this.loader = new Loader();
    }

    public preLoadAssets(assets: string[]): void {
        if (!this.preloadedAssets) {
            this.preloadedAssets = [];
        }

        this.preloadedAssets.push(...assets);
    }

    public async doPreLoad(onProgress?: Function): Promise<LoaderResource[]> {
        return this.loadResources(this.preloadedAssets, onProgress);
    }

    public async loadResource(asset: string, onProgress?: Function): Promise<LoaderResource> {
        if (!asset) {
            return null;
        }

        const resources = await this.loadResources([asset], onProgress);

        return resources[0];
    }

    public loadResources(assets: string[], onProgress?: Function): Promise<LoaderResource[]> {
        if (!assets || !assets.length) {
            return null;
        }
        const existingAssets = assets.filter(asset => this.loader.resources[asset]);
        assets = assets.filter(asset => !this.loader.resources[asset]);

        this.loader.add(assets);
        const progressListener: (loader: Loader) => void = loader => onProgress && onProgress(loader.progress);
        const progressListenerRef = this.loader.onProgress.add(progressListener);

        return new Promise((resolve) => {
            this.loader.load((loader, resources) => {
                this.loader.onProgress.detach(progressListenerRef);
                const res = assets.map(asset => resources[asset]).concat(existingAssets.map(asset => resources[asset]));
                resolve(res);
            });
        });
    }

    public getJSON(key: string): Object {
        if (!this.hasResource(key)) {
            console.error(`Tried to get unloaded JSON: ${key}`);
            return undefined;
        }
        return this.loader.resources[key].data;
    }

    public getTexture(key: string): Texture {
        if (!this.hasResource(key)) {
            console.error(`Tried to get unloaded texture: ${key}`);
            return undefined;
        }

        const resource = this.loader.resources[key] as LoaderResource;
        return resource.texture;
    }

    public hasResource(key: string): boolean {
        return !!this.loader.resources[key];
    }

    public getTexturesByType(type: object): Texture[] {
        return Object.values(type).map(asset => {
            const resource = this.loader.resources[asset] as LoaderResource;
            return resource.texture;
        });
    }
}

export default new AssetManager();
