const { ccclass, property } = cc._decorator;

@ccclass
export default class MoveAround extends cc.Component {

    private _speed: cc.Vec2;

    private _halfSize: cc.Size;

    public onLoad() {
        this._speed = cc.v2(2, 2);
        this._halfSize = cc.size(
            (cc.winSize.width - this.node.width) / 2,
            (cc.winSize.height - this.node.height) / 2
        );
    }

    public setGroup(group: "target" | "other") {
        this.node.group = group;
        this.node.color = group === "target" ? cc.color(255, 120, 120) : cc.color(120, 255, 120);
    }

    public update() {
        this.node.x += this._speed.x;
        this.node.y += this._speed.y;

        if (this.node.x < -this._halfSize.width) {
            this._speed.x = 2;
        } else if (this.node.x > this._halfSize.width) {
            this._speed.x = -2;
        }

        if (this.node.y < -this._halfSize.height) {
            this._speed.y = 2;
        } else if (this.node.y > this._halfSize.height) {
            this._speed.y = -2;
        }
    }

}
