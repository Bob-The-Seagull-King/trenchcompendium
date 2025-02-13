import { Requester } from '../Requester';
import { ITestStaticFeature , TestStaticFeature } from '../../classes/feature/teststatic/TestStaticFeature'
import { DynamicContextObject } from '../../classes/contextevent/dynamiccontextobject';
import { ITestBasicFeature, TestBasicFeature } from '../../classes/feature/teststatic/TestBasicFeature';
import { TestStaticFeatureFactory } from './TestStaticFeatureFactory';

class TestBasicFeatureFactory {

    /**
     * Creates an ability based on provided data
     * @param _ability The data in I format describing the object
     * @returns A newly created object
     */
    static CreateTestBasicFeature(_table: ITestBasicFeature, parent : DynamicContextObject | null) {
        const table = new TestBasicFeature(_table, parent)
        return table;
    }

    static CreateNewTestBasicFeature(_val : string, parent : DynamicContextObject | null) {
        const tabledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "testbasicfeature", id: _val}}) as ITestBasicFeature
        const tablenew = TestBasicFeatureFactory.CreateTestBasicFeature(tabledata, parent)
        return tablenew;
    }

}

export {TestBasicFeatureFactory}