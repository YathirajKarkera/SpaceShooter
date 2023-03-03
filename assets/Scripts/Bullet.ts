// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {

    @property
    BulletSpeed: number = 500;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    update(dt) {
        this.node.setPosition(this.node.position.x, this.node.position.y += this.BulletSpeed * dt);
        if (this.node.position.y >= (this.node.parent.getContentSize().height)) {
            this.node.destroy();
        }
    }
}
