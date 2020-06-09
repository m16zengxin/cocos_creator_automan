import { _decorator, Component, Node, Vec2, Color, EventTouch, CameraComponent, ModelComponent, geometry, Vec4, Vec3, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FlashLightCtr')
export class FlashLightCtr extends Component {
    @property({ type: CameraComponent })
    readonly camera_3d: CameraComponent = null;

    @property(ModelComponent)
    readonly model_plane: ModelComponent = null;

    private _ray: geometry.ray = new geometry.ray();
    private _temp_v4: Vec4 = new Vec4();
    private _temp_v3: Vec3 = new Vec3();
    private _temp_v4_gl: Vec4 = new Vec4();

    start () {
        // Your initialization goes here.
        this.node.on(Node.EventType.TOUCH_START, this.onTouchMove, this);
    }

    onTouchMove(touch:EventTouch){
        // let x = event.touches[0]

        this.camera_3d.screenPointToRay(touch.getLocationX(), touch.getLocationY(), this._ray);
        const rs = director.getScene().renderScene;
        if (rs.raycastSingleModel(this._ray, this.model_plane.model)) {
            const r = rs.rayResultSingleModel;
            console.log("rr==", r);
            for (let i = 0; i < r.length; i++) {
                const item = r[i];
                if (item.node.uuid === this.model_plane.node.uuid) {
                    this._temp_v3.set(this._ray.o);
                    console.log("11 this._temp_v3=", this._temp_v3);
                    this._temp_v3 = this._temp_v3.add(this._ray.d.clone().multiplyScalar(item.distance));
                    console.log("22 this._temp_v3=", this._temp_v3);
                    const minPosition = item.node.worldPosition.clone().add(this.model_plane.mesh.struct.minPosition);
                    const maxPosition = item.node.worldPosition.clone().add(this.model_plane.mesh.struct.maxPosition);
                    console.log("minPosition maxPosition=", minPosition, maxPosition);
                    this._temp_v4.set((this._temp_v3.x - minPosition.x) / (maxPosition.x - minPosition.x), (this._temp_v3.z - minPosition.z) / (maxPosition.z - minPosition.z), director.root.cumulativeTime, 0)
                    console.log("44 this._temp_v4=", this._temp_v4);
                    this._temp_v4_gl.set(((this._temp_v3.x - minPosition.x)) / (maxPosition.x - minPosition.x), (this._temp_v3.y - minPosition.y) / (maxPosition.y - minPosition.y), (this._temp_v3.z - minPosition.z) / (maxPosition.z - minPosition.z), 0);
                    // console.log("55 this._temp_v4_gl=", this._temp_v4_gl);
                    if(this._temp_v4_gl.x == Infinity){
                        this._temp_v4_gl.x = 0;
                    }
                    if(this._temp_v4_gl.y == Infinity){
                        this._temp_v4_gl.y = 0;
                    }
                    if(this._temp_v4_gl.z == Infinity){
                        this._temp_v4_gl.z = 0;
                    }
                    if(this._temp_v4_gl.w == Infinity){
                        this._temp_v4_gl.w = 0;
                    }

                    console.log("55 this._temp_v4_gl====1===", this._temp_v4_gl);
                    this.playEffect();
                    break;
                }
            }
        }
    }

    playEffect(){
        const pass = this.model_plane.material.passes[0];
        this._temp_v4_gl.y = 1- this._temp_v4_gl.y;
        pass.setUniform(pass.getHandle(`lightCenterPoint`), this._temp_v4_gl);
    }
}


export class FlashLightUBO {
    /**
     * 中心点颜色
     */
    lightColor: Color = Color.YELLOW;

    /**
     * 中心点坐标 ([0.0, 1.0], [0.0, 1.0])
     */
    lightCenterPoint: Vec2 = cc.v2(0.5, 0.5);

    /**
     * 光束角度 [0.0, 180.0]
     */
    lightAngle: number = 45;

    /**
     * 光束宽度 [0.0, +∞]
     */
    lightWidth: number = 0.5;

    /**
     * 是否启用光束渐变
     */
    enableGradient: boolean = true;

    /**
     * 是否裁剪掉透明区域上的点光
     */
    cropAlpha: boolean = true;

    /**
     * 是否开启战争迷雾效果
     */
    enableFog: boolean = false;
}
