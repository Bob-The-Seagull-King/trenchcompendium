import { Requester } from '../Requester';
import { IStaticOption , IStaticOptionContextObjectList, IStaticOptionTypeList, StaticOption, StaticOptionContextObjectList, StaticOptionTypeList } from '../../classes/options/StaticOption'
import { StaticOptionContextObject } from '../../classes/options/StaticOptionContextObject';

class StaticOptionFactory {

    /**
     * Creates an ability based on provided data
     * @param _ability The data in I format describing the object
     * @returns A newly created object
     */
    static CreateStaticOption(_option: IStaticOption, _parent : StaticOptionContextObject) {

        if (_option.category == "type") {
            const option = new StaticOptionTypeList(_option as IStaticOptionTypeList, _parent)
            return option;
        }

        if (_option.category == "contextobject") {
            const option = new StaticOptionContextObjectList(_option as IStaticOptionContextObjectList, _parent)
            return option;
        }

        const option = new StaticOption(_option, _parent)
        return option;
    }
}

export {StaticOptionFactory}