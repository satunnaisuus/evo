import { makeObservable, observable, action, runInAction } from "mobx";
import Game, { GameParams } from "../game/game";
import { DeleteCellEvent } from "../game/game-events";
import createGame, { GameOptions } from "../game/game-factory";
import { LoopType } from "../game/grid";
import CanvasRenderer, { RenderStrategy } from "../render/canvas-renderer";
import { saveOptions } from "./options-storage";

class Options {
    @observable
    private width: number;

    @observable
    private height: number;

    @observable
    private loop: LoopType;

    @observable
    private population: number;

    @observable
    private params: Params;

    constructor(options: GameOptions, private store: Store) {
        this.width = options.width || 100;
        this.height = options.height || 50;
        this.population = options.population || 1;
        this.params = new Params(options.params || {
            plantSpawnRate: 10
        }, store);

        makeObservable(this);
    }

    getWidth(): number {
        return this.width;
    }
    
    @action
    setWidth(width: number): void {
        this.width = width;
    }

    getHeight(): number {
        return this.height;
    }

    @action
    setHeight(height: number): void {
        this.height = height;
    }

    getLoop(): LoopType {
        return this.loop;
    }

    @action
    setLoop(loop: LoopType): void {
        this.loop = loop;
    }

    getPopulation(): number {
        return this.population;
    }

    @action
    setPopulation(population: number): void {
        this.population = population;
    }

    getParams(): Params {
        return this.params;
    }

    toGameOptions(): GameOptions {
        return {
            width: this.width,
            height: this.height,
            loop: this.loop,
            population: this.population,
            params: this.params.toGameParams(),
        };
    }
}

class Params {
    @observable
    plantSpawnRate: number;

    constructor(params: GameParams, private store: Store) {
        this.plantSpawnRate = params.plantSpawnRate || 10;

        makeObservable(this);
    }

    getPlantSpawnRate(): number {
        return this.plantSpawnRate;
    }

    @action
    setPlantSpawnRate(value: number): void {
        this.plantSpawnRate = value;
        this.store.getGame().getParams().plantSpawnRate = value;
    }

    toGameParams(): GameParams {
        return {
            plantSpawnRate: this.plantSpawnRate,
        }
    }
}

export class Store {
    private game: Game;

    private renderer: CanvasRenderer;

    private canvas: HTMLCanvasElement;

    @observable
    private rendererTheme: RenderStrategy = 'default';

    @observable
    private renderingDisabled: boolean = false;

    @observable
    private paused: boolean = true;

    @observable
    private stepDelay: number = 50;

    @observable
    private step: number = 0;

    @observable
    private stepsPerSecond: number = 0;

    private stepsPreviusPeriod: number = 0;

    @observable
    private organismCount: number = 0;

    @observable
    private options: Options;

    constructor(
        private gameFactory: typeof createGame,
        options: GameOptions,
    ) {
        makeObservable(this);

        this.options = new Options(options, this);
        this.newGame();

        setInterval(() => runInAction(() => {
            this.stepsPerSecond = (this.step - this.stepsPreviusPeriod);
            this.stepsPreviusPeriod = this.step;
        }), 1000);

        
    }

    render(): void {
        this.renderer && this.renderer.render();
    }

    @action
    newGame(): void {
        this.game && this.game.pause();
        this.paused = true;
        this.game = this.gameFactory(this.options.toGameOptions());
        this.game.setTimeoutDelay(this.stepDelay);
        this.newRenderer();
        this.setRenderingDisabled(false);
        this.step = 0;
        this.stepsPreviusPeriod = 0;
        this.stepsPerSecond = 0;
        this.organismCount = 0;

        for (const {cell} of this.game.getGrid()) {
            cell.getType() === 'organism' && this.organismCount++;
        }

        this.game.subscribe('postStep', (event) => runInAction(() => {this.step = this.game.getStep()}));
        this.game.subscribe('deleteCell', (event: DeleteCellEvent) => runInAction(() => {
            event.type === 'organism' && this.organismCount--;
        }));
        this.game.subscribe('insertCell', (event: DeleteCellEvent) => runInAction(() => {
            event.type === 'organism' && this.organismCount++;
        }));
        saveOptions(this.options.toGameOptions());
    }

    getGame(): Game {
        return this.game;
    }

    setCanvas(canvas: HTMLCanvasElement): void {
        this.canvas = canvas;
        this.newRenderer();
    }

    @action
    changeRenderTheme(theme: RenderStrategy): void {
        this.rendererTheme = theme;
        if (this.renderer) {
            this.renderer.setRenderStrategy(theme);
            this.renderer.render();
        }
    }

    getRenderTheme(): RenderStrategy {
        return this.rendererTheme;
    }

    @action
    pause(): void {
        this.paused = true;
        this.game && this.game.pause();
    }

    @action
    start(): void {
        this.paused = false;
        this.game && this.game.start();
    }

    isPaused(): boolean {
        return this.paused;
    }

    isRenderingDisabled(): boolean {
        return this.renderingDisabled;
    }

    @action
    setRenderingDisabled(value: boolean): void {
        this.renderingDisabled = value;
        this.renderer && (value ? this.renderer.disable() : this.renderer.enable())
    }

    @action
    changeStepDelay(delay: number): void {
        this.stepDelay = delay;
        this.game && this.game.setTimeoutDelay(delay);
    }

    getStepDelay(): number {
        return this.stepDelay;
    }

    getStep(): number {
        return this.step;
    }

    getStepsPerSecond(): number {
        return this.stepsPerSecond;
    }

    getOrganismCount(): number {
        return this.organismCount;
    }

    makeStep(): void {
        this.game && this.game.nextStep();
    }

    getOptions(): Options {
        return this.options;
    }

    private newRenderer(): void {
        if (this.game && this.canvas) {
            this.renderer = new CanvasRenderer(this.canvas, this.game, this.rendererTheme);
            this.renderer.render();
            this.game.subscribe('step', (game) => this.renderer.render());
        }
    }
}