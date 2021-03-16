import { Entity } from "entities";

export interface SystemSaveData {
    id: string;
    disabled: boolean;
}

export default abstract class System {
    public id: string;
    public type: string;
    public entity: Entity;

    public disabled: boolean;
    protected hasStarted: boolean;

    public start(entity: Entity): void {
        this.entity = entity;
        this.hasStarted = true;
    }
    public preUpdate(delta: number): void {}
    public update(delta: number): void {}
    public postUpdate(delta: number): void {}
    public end(): void {}

    public save(): SystemSaveData {
        return {
            id: this.id,
            disabled: this.disabled,
        };
    }
    public load(data: SystemSaveData): void {
        this.id = data.id;
        this.disabled = data.disabled;
    }
}
