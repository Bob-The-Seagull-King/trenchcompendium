import { DynamicContextObject } from "../classes/contextevent/dynamiccontextobject";
import { ICompendiumItemData } from "../classes/CompendiumItem";
import { TestBasicFeatureFactory } from "./features/TestBasicFeatureFactory";
import { ITestBasicFeature } from "../classes/feature/teststatic/TestBasicFeature";

class CreationFactory {

    /**
     * Creates an ability based on provided data
     * @param _ability The data in I format describing the object
     * @returns A newly created object
     */
    static async CreateCreation(_option: string, _data : ICompendiumItemData, _parent : DynamicContextObject | null) {
        switch (_option) {
            case "basic" : {
                return await TestBasicFeatureFactory.CreateTestBasicFeature(_data as ITestBasicFeature, _parent);
            }
            default: {
                return null;
            }
        }
    }
}

export {CreationFactory}