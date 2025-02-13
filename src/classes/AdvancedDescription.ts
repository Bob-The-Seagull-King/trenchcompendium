import { TableFactory } from '../factories/features/TableFactory';
import { AdvancedDescriptionItemFactory } from '../factories/components/AdvancedDescriptionItemFactory';
import { CompendiumItem } from './CompendiumItem';
import { IDescriptionItemData, DescriptionItem } from './DescriptionItem'
import { EventRunner } from './contextevent/contexteventhandler';
import { ContextObject } from './contextevent/contextobject';

/**
 * Interface for an ability description item
 */
interface IAdvancedDescription extends IDescriptionItemData {
    glossary?: [] // The glossary of a given description item
}

class AdvancedDescription extends DescriptionItem {
    public readonly Glossary;
    public SubData;
    public SubContent : AdvancedDescription[] = [];
    public DisplayData : any = null
    public Parent : CompendiumItem | null;

    /**
     * Assign parameter values
     * @param data The data in IAbilityDescription format
     */
    public constructor(data: IAdvancedDescription, parent : any | null)
    {
        super (data)
        this.SubData = data.subcontent;
        this.Glossary = data.glossary;
        this.Parent = parent;
    }

    public LoadData() {
        console.log(this.Tags)
        if (this.Tags['desc_type']) {

            // Build Table
            if (this.Tags['desc_type'] == 'table') {
                const default_val = this.Tags['id_val'];
                console.log(default_val)
                if ((default_val != null) && (default_val != undefined) && (typeof default_val === 'string')) {
                    const NewTable = TableFactory.CreateNewTable(default_val);
                    console.log(NewTable)
                    this.DisplayData = NewTable;
                }
            }

            // Build Table
            if (this.Tags['desc_type'] == 'question') {
                const default_val = this.Tags['default'];
                if ((default_val != null) && (default_val != undefined)) {
                    this.DisplayData = default_val;
                }
            }
        }

        this.SubContent = this.AdvancedSubConstructor(this.SubData)
    }
    

    /**
     * Deconstructs the description JSON object into an
     * array of AbilityDescription objects.
     * @param data The description array
     * @returns Array of DescriptionItems
     */
    AdvancedSubConstructor(data?: []) {
        const sublist: AdvancedDescription[] = []
        if (data) {
            let i = 0;
            for (i = 0; i < data.length; i++) {
                const tempDI = AdvancedDescriptionItemFactory.CreateAdvancedDescriptionItem(data[i], this.Parent)
                sublist.push(tempDI);
            }
            return sublist;
        } else {
            return sublist;
        }
    }

    /**
     * Any descriptions of the type 'question'
     */
    public async AnswerQuestions(source_obj : ContextObject) {
        
        if (this.Tags['desc_type']) {

            // Build Table
            if (this.Tags['desc_type'] == 'question') {


                const default_val = this.Tags['default'];
                const question = this.Tags['question'];
                const bonus_args = this.Tags['bonus_args']? this.Tags['bonus_args'] as any[] : [];
                const parent_level = this.Tags['parent_level'];
                const track_val = this.Tags['track_val']? this.Tags['track_val'] : null;

                if (
                    (default_val == null) || (default_val == undefined) ||
                    (question == null) || (question == undefined)|| (typeof question != 'string') ||
                    (bonus_args == null) || (bonus_args == undefined)||
                    (parent_level == null) || (parent_level == undefined)||
                    (track_val == undefined)
                ) {
                    this.DisplayData = default_val;
                } else {
                    const Event_Run : EventRunner = new EventRunner();
                    this.DisplayData = await Event_Run.runEvent(question, source_obj, bonus_args, default_val, track_val)
                }

            }
        }

        for (let i = 0; i < this.SubContent.length; i++) {
            await this.SubContent[i].AnswerQuestions(source_obj);
        }
    }
}

export {IAdvancedDescription, AdvancedDescription}