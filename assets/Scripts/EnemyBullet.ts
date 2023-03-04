// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import GamePlayManager from "./GamePlayManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EnemyBullet extends cc.Component {

    @property
    BulletSpeed: number = 500;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    onCollisionEnter(otherCollider, selfCollider) {
        if (otherCollider.name == "Player<PolygonCollider>" && selfCollider.name == "EnemyBullet<PolygonCollider>") {
            cc.find('Canvas').getComponent(GamePlayManager).onGameOver();
            this.node.destroy();
        }
        if (otherCollider.name == "Asteroid<PolygonCollider>") {
            this.node.destroy();
        }

    }

    update(dt) {
        this.node.setPosition(this.node.position.x, this.node.position.y -= this.BulletSpeed * dt);
        if (this.node.position.y <= (-this.node.parent.getContentSize().height)) {
            this.node.destroy();
        }
    }


}
