import { DynamicContextObject } from "../../../classes/contextevent/dynamiccontextobject";
import { StaticOptionContextObject, IStaticOptionContextObject } from "../../options/StaticOptionContextObject";

interface ITestStaticFeature extends IStaticOptionContextObject {
    teststatic : number
}

class TestStaticFeature extends StaticOptionContextObject {

    public readonly teststatic;

    constructor(data : ITestStaticFeature, parent : DynamicContextObject | null) {
        super(data, parent);
        this.teststatic = data.teststatic;
    }

}

export {TestStaticFeature, ITestStaticFeature}