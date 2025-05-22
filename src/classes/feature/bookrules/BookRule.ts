import { AdvancedDescription } from '../../AdvancedDescription';
import { DescriptionFactory } from '../../../utility/functions';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { StaticContextObject } from '../../contextevent/staticcontextobject';

interface IBookRule extends IContextObject {
    description: [],
    item_index : number,
    sections : IRuleSection[]
}

interface IRuleSection {
    title : string,
    description: [],
    content? : IRuleSection[]
}

interface RuleSection {
    title : string,
    description: AdvancedDescription[],
    content: RuleSection[]
}

// gamerule

class BookRule extends StaticContextObject {
    public readonly Description;
    public ItemIndex : number;
    public Sections : RuleSection[];
    
    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IKeyword format
     */
    public constructor(data: IBookRule, parent : ContextObject | null)
    {
        super(data, parent)
        this.Description = DescriptionFactory(data.description, this);
        this.ItemIndex = data.item_index;
        this.Sections = this.BuildSections(data.sections)
    }
    
    public BuildSections(sections : IRuleSection[]) {
        const NewSections : RuleSection[] = [];
        for (let i = 0; i < sections.length; i++) {
            const BaseContent : IRuleSection = sections[i]
            let contentsections : IRuleSection[] = []
            if (BaseContent.content != undefined) {
                contentsections = BaseContent.content;
            }
            const NewSection = {
                title : sections[i].title,
                description: DescriptionFactory(sections[i].description, this),
                content :  this.BuildSections(contentsections)
            }
            NewSections.push(NewSection);
        }
        return NewSections;
    }

    /**
     * When destroyed, also delete all associated
     * addon objects.
     */
    destructor() {
        let i = 0;
        for (i = 0; i < this.Description.length; i++) {
            delete this.Description[i];
        }
    }


    /**
     * Gets the content of the first description item of an object
     */
    public GetDescription () {
        if (this.Description.length > 0) {
            return this.Description[0].Content;
        }
        return '';
    }

}

export {IBookRule, BookRule}

