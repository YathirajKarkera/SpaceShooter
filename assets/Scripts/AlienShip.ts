// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Enemy from "./Enemy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AlienShip extends Enemy {

    @property
    duration: number = 10;
    @property
    moveAmountX: number = 300;
    @property
    moveAmountY: number = 75;

    @property({ type: cc.AudioClip })
    explosion = null;

    moveEnemy: cc.ActionInterval;

    @property(cc.Prefab)
    bullet: cc.Prefab = null;

    @property
    ShootFrequency: number = 3.0;


    enemyLife: number = 5;
    playAnimation: boolean = true;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.moveEnemy = this.setMovements();
        this.node.runAction(this.moveEnemy);
        this.schedule(this.spawnBullets, this.ShootFrequency, cc.macro.REPEAT_FOREVER, 3.0);

        this.moveAmountX = this.node.getContentSize().width / 2
    }

    start() {

    }

    setMovements() {
        var moveLeft = cc.moveBy(this.duration, cc.v2(-this.moveAmountX, -this.moveAmountY)).easing(cc.easeCircleActionInOut());
        var moveRight = cc.moveBy(this.duration, cc.v2(this.moveAmountX, -this.moveAmountY)).easing(cc.easeCircleActionInOut());
        return cc.repeatForever(cc.sequence(moveLeft, moveRight));
    }

    spawnBullets() {
        var Bullet = cc.instantiate(this.bullet);
        Bullet.setPosition(this.node.position.x, this.node.position.y);
        this.node.parent.addChild(Bullet);

        var Bullet = cc.instantiate(this.bullet);
        Bullet.setPosition(this.node.position.x + this.node.getContentSize().width, this.node.position.y);
        this.node.parent.addChild(Bullet);

        var Bullet = cc.instantiate(this.bullet);
        Bullet.setPosition(this.node.position.x - this.node.getContentSize().width, this.node.position.y);
        this.node.parent.addChild(Bullet);
    }

    onCollisionEnter(otherCollider, selfCollider) {
        if (otherCollider.name == "Bullet<PolygonCollider>") {
            this.enemyLife -= 1;
            if ((this.enemyLife <= 0) && (this.playAnimation == true)) {
                this.node.stopAllActions();
                this.playAnimation = false;
                cc.audioEngine.playEffect(this.explosion, false);
                this.node.getComponent(cc.Animation).play();
            }
        }
        if (otherCollider.name == "Player<PolygonCollider>") {
            this.node.parent.getComponent('GamePlayManager').onGameOver();
            this.node.active = false;
        }
    }

    protected onAnimationComplete() {
        this.removeExplosion();
    }


    update(dt) {
        super.update(dt);
    }
}
