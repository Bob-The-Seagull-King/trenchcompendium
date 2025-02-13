import { Requester } from '../Requester';
import { ITestStaticFeature , TestStaticFeature } from '../../classes/feature/teststatic/TestStaticFeature'
import { DynamicContextObject } from '../../classes/contextevent/dynamiccontextobject';

class TestStaticFeatureFactory {

    /**
     * Creates an ability based on provided data
     * @param _ability The data in I format describing the object
     * @returns A newly created object
     */
    static CreateTestStaticFeature(_table: ITestStaticFeature, parent : DynamicContextObject | null) {
        const table = new TestStaticFeature(_table, parent)
        return table;
    }

    static CreateNewTestStaticFeature(_val : string, parent : DynamicContextObject | null) {
        const tabledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "teststaticfeature", id: _val}}) as ITestStaticFeature
        const tablenew = TestStaticFeatureFactory.CreateTestStaticFeature(tabledata, parent)
        return tablenew;
    }

}

export {TestStaticFeatureFactory}