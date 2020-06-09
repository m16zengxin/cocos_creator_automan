import { _decorator, Component, Node, EventHandler, SliderComponent, LabelComponent, ModelComponent, Material } from "cc";
const { ccclass, property } = _decorator;

@ccclass("SliderCtr")
export class SliderCtr extends Component {
    @property({
        type: Node
    })
    slider: Node = null;

    @property({
        type: Node
    })
    label: Node = null;

    @property({
        type: Node
    })

    materails: Node = null;

    onLoad() {
        this.label.getComponent(LabelComponent).string = "0";
    }

    callback(slider: SliderComponent) {
        let pro = Math.floor(slider.progress * 100) / 100
        this.label.getComponent(LabelComponent).string = pro + "";
        this.updataMaterials(pro);
    }

    updataMaterials(oldLevel: number) {
        let material:Material = this.materails.getComponent(ModelComponent).getMaterial(0);
        material.setProperty("oldLevel", oldLevel);
        this.materails.getComponent(ModelComponent).setMaterial(material, 0);
    }
}
