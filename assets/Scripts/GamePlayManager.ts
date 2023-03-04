// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePlayManager extends cc.Component {

    @property(cc.Prefab)
    obstacles: cc.Prefab[] = [];

    screenLimit: number = 0;

    score: number = 0;
    highscore: number = 0;

    private isGameOver: boolean = false;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;

        cc.director.getPhysicsManager().enabled = true;
        this.screenLimit = this.node.parent.getContentSize().height / 2;


    }

    start() {
        this.onPlayAgain();
    }

    spawnObstacles() {

        let random = Math.floor(Math.random() * this.obstacles.length);
        let newShip = cc.instantiate(this.obstacles[random]);
        let randomX = [170, 0, -170];
        let randX = Math.floor(Math.random() * (170 - (-170) + 1) - 170)
        let randY = Math.floor(Math.random() * ((this.screenLimit + 500) - this.screenLimit + 1) + this.screenLimit)
        newShip.setPosition(randX, 500);
        this.node.addChild(newShip);
    }

    AddScore() {
        this.score += 10;
        if (this.score > this.highscore)
            this.highscore = this.score;

        this.updateScore();
    }

    updateScore() {
        this.node.getChildByName("HUD").getChildByName("Score").getComponent(cc.Label).string = "Score :" + this.score;
    }

    // update (dt) {}

    onPlayAgain() {
        //   cc.director.loadScene("GameScene");
        this.node.getChildByName("GameOver").active = false;
        this.node.getChildByName("HUD").active = true;
        this.isGameOver = false;
        this.node.getChildByName("Player").getComponent('Player').startFiring();

        this.score = 0;
        this.updateScore();
        this.spawnObstacles();
    }

    onGameOver() {
        this.node.getChildByName("GameOver").active = true;
        this.node.getChildByName("HUD").active = false;
        this.isGameOver = true;
        this.updateGameOverSreen();
        this.node.getChildByName("Player").getComponent('Player').stopFiring();
    }

    updateGameOverSreen() {
        let gameOverNode = this.node.getChildByName("GameOver");
        gameOverNode.getChildByName("Score").getComponent(cc.Label).string = "Score : " + this.score;
        gameOverNode.getChildByName("HighScore").getComponent(cc.Label).string = "High Score :  : " + this.highscore;

    }

    getGameStatus(): boolean {
        return this.isGameOver;
    }
}
