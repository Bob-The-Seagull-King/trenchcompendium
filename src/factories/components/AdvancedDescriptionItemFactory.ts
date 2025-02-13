import { CompendiumItem } from '../../classes/CompendiumItem';
import { IAdvancedDescription, AdvancedDescription } from '../../classes/AdvancedDescription';

class AdvancedDescriptionItemFactory {

    /**
     * Creates an ability based on provided data
     * @param _ability The data in I format describing the object
     * @returns A newly created object
     */
    static CreateAdvancedDescriptionItem(_data : IAdvancedDescription, parent : any | null) {
        const desc = new AdvancedDescription(_data, parent)
        desc.LoadData();
        return desc;
    }

}

export {AdvancedDescriptionItemFactory}