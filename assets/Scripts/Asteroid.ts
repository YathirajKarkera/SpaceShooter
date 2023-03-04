// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Enemy from "./Enemy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Asteroid extends Enemy {

    @property({ type: cc.AudioClip })
    explosion = null;


    life: number = 3;
    playAnimation: boolean = true;

    astroidRb: cc.RigidBody = null;;

    constructor() {
        super();
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        super.onLoad();
        this.astroidRb = this.node.getComponent(cc.RigidBody);
        this.setAstroidProperty();
    }

    start() {

    }

    setAstroidProperty() {
        this.astroidRb.gravityScale = Math.random();
        if (this.astroidRb.gravityScale <= 0.1)
            this.astroidRb.gravityScale = 0.1;
        if (this.astroidRb.gravityScale >= 0.75)
            this.astroidRb.gravityScale = 0.75;
    }

    onCollisionEnter(otherCollider, selfCollider) {
        if (otherCollider.name == "Bullet<PolygonCollider>") {
            this.life -= 1;
            if ((this.life <= 0) && (this.playAnimation == true)) {
                this.node.stopAllActions();

                //  this.node.active = false;
                this.playAnimation = false;
                cc.audioEngine.playEffect(this.explosion, false);
                this.node.getComponent(cc.Animation).play();
            }
            else {
                this.node.scale -= 0.05;
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
