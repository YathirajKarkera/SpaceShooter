// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Asteroid extends cc.Component {

    @property
    duration: number = 0.5;
    @property
    moveAmountX: number = 300;
    @property
    moveAmountY: number = 75;


    enemyLife: number = 3;
    playAnimation: boolean = true;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let movement: cc.ActionInterval = this.setMovements();
        //   this.node.runAction(movement);
        //    this.schedule(this.spawnBullets, this.ShootFrequency, cc.macro.REPEAT_FOREVER, 3.0);
    }

    setMovements() {
        var moveLeft = cc.moveBy(this.duration, cc.v2(-this.moveAmountX, -this.moveAmountY)).easing(cc.easeCircleActionInOut());
        var moveRight = cc.moveBy(this.duration, cc.v2(this.moveAmountX, -this.moveAmountY)).easing(cc.easeCircleActionInOut());
        return cc.repeatForever(cc.sequence(moveLeft, moveRight));
    }


    onCollisionEnter(otherCollider, selfCollider) {
        if (otherCollider.name == "Bullet<PolygonCollider>") {
            this.enemyLife -= 1;
            if ((this.enemyLife <= 0) && (this.playAnimation == true)) {
                this.node.stopAllActions();

                //  this.node.active = false;
                this.playAnimation = false;

                this.node.getComponent(cc.Animation).play();
            }
        }
        if (otherCollider.name == "Player<PolygonCollider>") {
            this.node.parent.getComponent('GamePlayManager').onGameOver();
            this.node.active = false;
        }
    }

    removeExplosion() {
        this.node.destroy();
        this.node.parent.getComponent('GamePlayManager').spawnObstacles();
        //  cc.audioEngine.playEffect(this.explosion, false);
        this.node.parent.getComponent('GamePlayManager').AddScore();
    }



    start() {

    }

    // update (dt) {}
}
