import { DynamicContextObject } from "../../contextevent/dynamiccontextobject";
import { TestStaticFeature } from "./TestStaticFeature";
import { TestStaticFeatureFactory } from "../../../factories/features/TestStaticFeatureFactory";
import { ContextObject, IContextObject } from "../../contextevent/contextobject";
import { ContextPackage } from "../../contextevent/contextpackage";
import { TestBasicFeature } from "./TestBasicFeature";
import { TestBasicFeatureFactory } from "../../../factories/features/TestBasicFeatureFactory";
import { TestStaticInContextFeature } from "./TestStaticInContextFeature";

interface ITestDynamicFeature extends IContextObject {
    teststaticlist : string[],
    teststaticbaselist : string[]
}

class TestDynamicFeature extends DynamicContextObject {

    public teststaticlist : TestStaticInContextFeature[];
    public testbasiclist : TestBasicFeature[];

    constructor(data : ITestDynamicFeature, parent : DynamicContextObject | null) {
        super(data, parent);
        this.testbasiclist = this.BuildTestBasicList(data.teststaticbaselist)
        this.teststaticlist = this.BuildTestStaticList(data.teststaticlist)
    
    }

    public async LoadOptions() {
        for (let i = 0; i < this.teststaticlist.length; i++) {
            await this.teststaticlist[i].ReloadOption();
        } 
    }

    private BuildTestBasicList(data : string[]) {
        const staticlist : TestBasicFeature[] = [];

        for (let i =0; i < data.length; i++) {
            try {
                const new_static : TestBasicFeature = TestBasicFeatureFactory.CreateNewTestBasicFeature(data[i], this);
                staticlist.push(new_static);
            } catch(e) {
                console.log("Failed to generate TestBasicList with ID " + data[i])
            }
        }

        return staticlist;
    }

    private BuildTestStaticList(data : string[]) {
        const staticlist : TestStaticInContextFeature[] = [];

        for (let i =0; i < data.length; i++) {
            try {
                const new_static : TestStaticFeature = TestStaticFeatureFactory.CreateNewTestStaticFeature(data[i], this);
                const context_data : IContextObject = {
                    contextdata : {},
                    id: new_static.ID,
                    name: new_static.Name? new_static.Name : "",
                    source: new_static.Source? new_static.Source : "",
                    tags: new_static.Tags? new_static.Tags : {}
                }
                const new_context : TestStaticInContextFeature = new TestStaticInContextFeature(context_data, new_static, this)
                staticlist.push(new_context);
            } catch(e) {
                console.log("Failed to generate TestStaticList with ID " + data[i])
            }
        }

        return staticlist;
    }

    public async GrabSubPackages(event_id : string, source_obj : ContextObject, arrs_extra : any[]) : Promise<ContextPackage[]> { 
        const subpackages : ContextPackage[] = []
        
        for (let i = 0; i < this.teststaticlist.length; i++) {
            const static_packages : ContextPackage[] = await this.teststaticlist[i].GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                subpackages.push(static_packages[j])
            }
        }

        for (let i = 0; i < this.testbasiclist.length; i++) {
            const static_packages : ContextPackage[] = await this.testbasiclist[i].GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                subpackages.push(static_packages[j])
            }
        }

        return subpackages; 
    }

}

export {TestDynamicFeature, ITestDynamicFeature}