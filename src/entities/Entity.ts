import Game from "Game";
import { v1 as uuid } from "uuid";
import Vector from "vector";

import { System, createSystem } from "./systems";
import { SystemSaveData } from "./systems/System";

export interface EntitySaveData {
    id: string;
    position: number[];
    systemData: SystemSaveData[];
}

export default class Entity {
    public id: string;

    private systems: Map<string, System>;

    private hasStarted: boolean;

    public constructor(public position: Vector, public saveable = true) {
        this.id = uuid();
        this.systems = new Map();

        Game.registerEntity(this);
    }

    public start(): void {
        this.hasStarted = true;

        this.systems.forEach(system => system.start(this));
    }

    public preUpdate(delta: number): void {
        this.systems.forEach(system => {
            if(!system.disabled) system.preUpdate(delta);
        });
    }

    public update(delta: number): void {
        this.systems.forEach(system => {
            if(!system.disabled) system.update(delta);
        });
    }

    public postUpdate(delta: number): void {
        this.systems.forEach(system => {
            if(!system.disabled) system.postUpdate(delta);
        });
    }

    public remove(): void {
        this.systems.forEach(system => {
            system.end();
        });
        Game.unregisterEntity(this.id);
    }

    public addSystem<T extends System>(system: T): T {
        if (this.systems.has(system.type)) {
            return system;
        }

        this.systems.set(system.type, system);

        if (this.hasStarted) {
            system.start(this);
        }
        return system;
    }

    public removeSystem(systemId: string): void {
        if (this.systems.has(systemId)) {
            this.systems.get(systemId).end();
            this.systems.delete(systemId);
        }
    }

    public getSystem(type: string): System {
        return this.systems.get(type);
    }

    public save(): EntitySaveData {
        return {
            id: this.id,
            position: Vector.Serialize(this.position),
            systemData: Array.from(this.systems.values()).map(system => system.save()),
        };
    }

    public load(data: EntitySaveData, systems: System[]): void {
        this.id = data.id;
        this.position = Vector.Deserialize(data.position);
    }

    public static loadEntity(data: EntitySaveData): Entity {
        const entity = new Entity(Vector.Deserialize(data.position), true);
        entity.id = data.id;

        data.systemData.forEach(systemData => {
            const system = createSystem(systemData);
            if (!system) return;

            entity.addSystem(system);
            system.load(systemData);
        });

        return entity;
    }
}
