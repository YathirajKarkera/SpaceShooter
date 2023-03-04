// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import PowerUp from "./PowerUp";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BulletPower extends PowerUp {

    // LIFE-CYCLE CALLBACKS:

    speed = 100;

    onLoad() { }

    start() {
        this.node.setPosition(-this.node.parent.getContentSize().width / 2, 400);
    }

    onCollisionEnter(otherCollider, selfCollider) {
        if (otherCollider.name == "Bullet<PolygonCollider>") {
            // cc.find('Canvas').getComponent(GamePlayManager).onGameOver();
            cc.systemEvent.emit("BulletPowerUp");
            this.node.destroy();
        }
    }

    update(dt) {
        this.node.setPosition(this.node.position.x += this.speed * dt, this.node.position.y);
        if (this.node.position.x >= (this.node.parent.getContentSize().width)) {
            this.node.destroy();
        }
    }


}
