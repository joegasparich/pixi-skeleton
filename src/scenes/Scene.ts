export abstract class Scene {
    public name: string;

    public start(): void {}
    public preUpdate(): void {}
    public update(): void {}
    public postUpdate(): void {}
    public stop(): void {}
}
