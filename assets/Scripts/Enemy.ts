// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import GamePlayManager from "./GamePlayManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class Enemy extends cc.Component {



    // LIFE-CYCLE CALLBACKS:



    onLoad() { }

    start() {

    }



    protected removeExplosion() {
        this.node.destroy();
        let gameManager = cc.find("Canvas").getComponent(GamePlayManager);
        gameManager.spawnEnemy();
        gameManager.AddScore();
    }

    update(dt) {
        if (this.node.position.y < - this.node.parent.getContentSize().height / 2 - this.node.height) {
            this.node.destroy();
            let gameManager = cc.find("Canvas").getComponent(GamePlayManager);
            gameManager.spawnEnemy();
        }
    }
}
