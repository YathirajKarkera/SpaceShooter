// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Enemy from "./Enemy";
import PowerUp from "./PowerUp";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePlayManager extends cc.Component {

    @property(cc.Prefab)
    asteroids: cc.Prefab[] = [];

    @property(cc.Prefab)
    alienShips: cc.Prefab[] = [];

    @property(cc.Prefab)
    powerUps: cc.Prefab[] = [];

    screenLimit: number = 0;

    score: number = 0;
    highScore: number = 0;

    private isGameOver: boolean = false;
    spawnCount: number = 0;

    private activeEnemy = null;
    powerUpSpawnInterval: number = 30;

    activePowerUp: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;

        cc.director.getPhysicsManager().enabled = true;
        this.screenLimit = this.node.getContentSize().height / 2;

        this.schedule(this.spawnPowerUps, this.powerUpSpawnInterval, cc.macro.REPEAT_FOREVER, 0);
    }

    start() {
        this.onPlayAgain();
    }

    spawnEnemy() {
        this.spawnCount++;
        if (this.spawnCount >= 5) {
            this.spawnAlienShip();
        }
        else
            this.spawnAsteroid();
    }

    spawnAsteroid() {
        let random = Math.floor(Math.random() * this.asteroids.length);
        let newShip = cc.instantiate(this.asteroids[random]);
        let randX = Math.floor(Math.random() * (170 - (-170) + 1) - 170)
        let min = this.screenLimit;
        let max = this.screenLimit + 50;
        let randY = Math.floor(Math.random() * (max - min + 1) + min)
        newShip.setPosition(randX, randY);
        this.node.addChild(newShip);

        this.activeEnemy = newShip;
    }

    spawnAlienShip() {
        this.spawnCount = 0;

        let random = Math.floor(Math.random() * this.alienShips.length);
        let newEnemy = cc.instantiate(this.alienShips[random]);
        let min = this.screenLimit;
        let max = this.screenLimit + 50;
        let randY = Math.floor(Math.random() * (max - min + 1) + min);
        let randX = Math.floor(Math.random() * (150 - (-150) + 1) - 150)
        newEnemy.setPosition(randX, randY);
        this.node.addChild(newEnemy);

        this.activeEnemy = newEnemy
    }

    spawnPowerUps() {
        if (this.activePowerUp)
            return;
        let random = Math.floor(Math.random() * this.powerUps.length);
        let newPowerUp = cc.instantiate(this.powerUps[random]);
        this.node.addChild(newPowerUp);

        this.activePowerUp = newPowerUp;
    }

    AddScore() {
        this.score += 1;
        if (this.score > this.highScore)
            this.highScore = this.score;

        this.updateScore();
    }

    updateScore() {
        this.node.getChildByName("HUD").getChildByName("Score").getComponent(cc.Label).string = "Score : " + this.score;
    }

    // update (dt) {}

    onPlayAgain() {
        //   cc.director.loadScene("GameScene");
        this.node.getChildByName("GameOver").active = false;
        this.node.getChildByName("HUD").active = true;
        this.isGameOver = false;
        this.node.getChildByName("Player").getComponent('Player').startFiring();

        this.score = 0;
        this.spawnCount = 0;
        this.updateScore();
        this.spawnEnemy();
    }

    onGameOver() {
        this.node.getChildByName("GameOver").active = true;
        this.node.getChildByName("HUD").active = false;
        this.isGameOver = true;
        this.updateGameOverSreen();
        this.node.getChildByName("Player").getComponent('Player').stopFiring();

        if (this.activeEnemy) {
            this.activeEnemy.active = false;
            this.activeEnemy.destroy();
        }
    }


    updateGameOverSreen() {
        let gameOverNode = this.node.getChildByName("GameOver");
        gameOverNode.getChildByName("Score").getComponent(cc.Label).string = "Score : " + this.score;
        gameOverNode.getChildByName("HighScore").getComponent(cc.Label).string = "High Score : " + this.highScore;

    }

    getGameStatus(): boolean {
        return this.isGameOver;
    }
}
