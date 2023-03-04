// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import GamePlayManager from "./GamePlayManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PLayer extends cc.Component {
    moveLeft: number = 0;
    moveRight: number = 0;
    screenLimit: number = 0;
    bulletSpawnSpeed: number = 0.5;

    //bullet
    @property(cc.Prefab)
    bullet: cc.Prefab = null;

    gameManager: GamePlayManager;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.screenLimit = this.node.parent.getContentSize().width / 2;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.movePlayer, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.stopPlayer, this);

        this.gameManager = cc.find('Canvas').getComponent(GamePlayManager);

        //Touch input
        this.node.parent.on('touchstart', this.onTouchBegin, this);
        this.node.parent.on('touchend', this.onTouchEnd, this);

        cc.systemEvent.on("BulletPowerUp", this.onBulletPowerUp, this);

        this.startFiring();
    }

    start() {

    }

    startFiring() {
        this.schedule(this.shootBullets, this.bulletSpawnSpeed, cc.macro.REPEAT_FOREVER, 0);
    }

    stopFiring() {
        this.unschedule(this.shootBullets);
    }

    onBulletPowerUp() {
        this.bulletSpawnSpeed = 0.2;
        this.stopFiring();
        this.startFiring();
        cc.tween(this)
            .delay(3)
            .call(() => {
                this.bulletSpawnSpeed = 0.5;
                this.stopFiring();
                this.startFiring();
            }, this)
            .start()
    }

    onTouchBegin(event) {
        if (event.getLocationX() < this.screenLimit) {
            this.moveLeft = 1;
        }
        if (event.getLocationX() > this.screenLimit) {
            this.moveRight = 1;
        }
    }

    onTouchEnd(event) {
        this.moveRight = 0;
        this.moveLeft = 0;
    }

    movePlayer(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.left:
                this.moveLeft = 1;
                break;
            case cc.macro.KEY.right:
                this.moveRight = 1;
                break;
        }
    }

    stopPlayer(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.left:
                this.moveLeft = 0;
                break;
            case cc.macro.KEY.right:
                this.moveRight = 0;
                break;
        }
    }

    shootBullets() {
        var bullet = cc.instantiate(this.bullet);
        bullet.setPosition(this.node.position.x, this.node.position.y + this.node.width / 2);
        this.node.parent.addChild(bullet);
        // cc.audioEngine.playEffect(this.gun2, false);
    }

    update(dt) {
        if (this.gameManager.getGameStatus())
            return;
        if (this.moveLeft == 1) {
            this.node.setPosition(this.node.position.x -= 300 * dt, this.node.position.y);
            if (this.node.position.x < -this.screenLimit)
                this.node.setPosition(-this.screenLimit, this.node.position.y);
        }
        if (this.moveRight == 1) {
            this.node.setPosition(this.node.position.x += 300 * dt, this.node.position.y);
            if (this.node.position.x > this.screenLimit)
                this.node.setPosition(this.screenLimit, this.node.position.y);
        }
    }
}
