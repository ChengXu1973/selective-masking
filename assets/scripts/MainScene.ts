import MoveAround from "./MoveAround";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainScene extends cc.Component {

    @property(cc.Prefab)
    movingPrefab: cc.Prefab = null;

    // ------------- cameras -------------

    @property(cc.Camera)
    targetCam: cc.Camera = null;
    @property(cc.Camera)
    otherCam: cc.Camera = null;
    @property(cc.Camera)
    wholeCam: cc.Camera = null;

    // ------------- sprites -------------

    @property(cc.Sprite)
    targetSpr: cc.Sprite = null;
    @property(cc.Sprite)
    otherSpr: cc.Sprite = null;
    @property(cc.Sprite)
    wholeSpr: cc.Sprite = null;
    @property(cc.Sprite)
    defaultSpr: cc.Sprite = null;

    // ------------- sprite-frames -------------

    private targetFrm: cc.SpriteFrame = null;
    private otherFrm: cc.SpriteFrame = null;
    private wholeFrm: cc.SpriteFrame = null;
    private defaultFrm: cc.SpriteFrame = null;

    // ------------- textures -------------

    private targetTxt: cc.RenderTexture = null;
    private otherTxt: cc.RenderTexture = null;
    private wholeTxt: cc.RenderTexture = null;

    // ------------- material -------------

    private defaultMet: cc.Material = null;

    private area: number = 0;

    public onLoad() {
        this.addNodes();

        this.defaultMet = this.defaultSpr.getMaterial(0);
        this.initSprites();
        this.initFrames();
        this.initTextures();
        this.initCameras();

        this.addListener();
        this.setArea(0);
    }

    public start() {
        this.renderCam();
        this.attachTexture2SprFrm();
        this.setSprfrm2Spr();
    }

    public update() {
        this.renderCam();
        this.mixTexture();
    }

    private addNodes() {
        const { width, height } = cc.winSize;
        for (let i = 0; i < 50; i++) {
            let node = cc.instantiate(this.movingPrefab);
            node.x = (Math.random() - 0.5) * width;
            node.y = (Math.random() - 0.5) * height;
            node.getComponent(MoveAround).setGroup(i % 2 === 0 ? "other" : "target");
            this.node.addChild(node, i);
        }
    }

    private initSprites() {
        const { width, height } = cc.winSize;
        [
            this.targetSpr,
            this.otherSpr,
            this.wholeSpr,
            this.defaultSpr,
        ].forEach(spr => {
            spr.node.width = width / 2;
            spr.node.height = height / 2;
        });
    }

    private initFrames() {
        this.targetFrm = new cc.SpriteFrame();
        this.otherFrm = new cc.SpriteFrame();
        this.wholeFrm = new cc.SpriteFrame();
        this.defaultFrm = new cc.SpriteFrame();
    }

    private initTextures() {
        this.targetTxt = new cc.RenderTexture();
        this.otherTxt = new cc.RenderTexture();
        this.wholeTxt = new cc.RenderTexture();
        const { width, height } = cc.winSize;
        const gl = cc.game["_renderContext"];
        this.targetTxt.initWithSize(width, height, gl.STENCIL_INDEX8);
        this.otherTxt.initWithSize(width, height, gl.STENCIL_INDEX8);
        this.wholeTxt.initWithSize(width, height, gl.STENCIL_INDEX8);
    }

    private initCameras() {
        this.targetCam.targetTexture = this.targetTxt;
        this.otherCam.targetTexture = this.otherTxt;
        this.wholeCam.targetTexture = this.wholeTxt;

        this.targetCam.enabled = false;
        this.otherCam.enabled = false;
        this.wholeCam.enabled = false;
    }

    private renderCam() {
        this.targetCam.render(this.node);
        this.otherCam.render(this.node);
        this.wholeCam.render(this.node);
    }

    private attachTexture2SprFrm() {
        this.targetFrm.setTexture(this.targetTxt);
        this.otherFrm.setTexture(this.otherTxt);
        this.wholeFrm.setTexture(this.wholeTxt);

        this.targetFrm.setFlipY(true);
        this.otherFrm.setFlipY(true);
        this.wholeFrm.setFlipY(true);

        this.defaultFrm.setTexture(this.wholeTxt);
    }

    private setSprfrm2Spr() {
        this.targetSpr.spriteFrame = this.targetFrm;
        this.otherSpr.spriteFrame = this.otherFrm;
        this.wholeSpr.spriteFrame = this.wholeFrm;
        this.defaultSpr.spriteFrame = this.defaultFrm;
    }

    private mixTexture() {
        this.defaultMet.setProperty("area", new cc.Vec4(0.0, this.area, 0.0, 1.0));
        this.defaultMet.setProperty("targettexture", this.targetTxt);
        this.defaultMet.setProperty("othertexture", this.otherTxt);
        this.defaultSpr.setMaterial(0, this.defaultMet);
    }

    private addListener() {
        this.defaultSpr.node.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }

    private onMouseMove(evt: cc.Event.EventMouse) {
        let pos = evt.getLocation();
        let local = this.defaultSpr.node.convertToNodeSpaceAR(pos);
        let x = local.x + this.defaultSpr.node.width / 2;
        this.setArea(x);
    }

    private setArea(x) {
        this.defaultSpr.node.getChildByName("line").x = x - this.defaultSpr.node.width / 2;
        let a = x / this.defaultSpr.node.width;
        a = Math.min(a, 1);
        a = Math.max(a, 0);
        this.area = a;
    }

}
