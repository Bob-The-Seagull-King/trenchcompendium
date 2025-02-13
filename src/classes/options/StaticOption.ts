import { DescriptionFactory } from "../../utility/functions";
import { IRequest, Requester } from "../../factories/Requester";
import { ContextEventEntry, ContextEventVals } from "../../resources/staticcontext/contexteventtypes";
import { OptionCallTable } from "../../resources/staticcontext/optioncontexttable";
import { StaticOptionContextObject } from "./StaticOptionContextObject";
import { ContextObject } from "../../classes/contextevent/contextobject";
import { EventRunner } from "../contextevent/contexteventhandler";

interface IStaticOption {
    ref_id : string, // ID of the option (unique only to the parent object)
    name : string, // Representation name of the option
    description : [], // Description of what this option means
    category : string, // Used to determine if the option is basic or uses context objects
    contextvars : ContextEventEntry // Variables used for events.
}

interface IChoice {
    id : number, // ID of the choice (unique only to the parent object)
    value : any, // Unaltered value of the choice
    display_str : string // String representation of the choice for lists
}

/**
StaticOptions are built in StaticOptionContextObjects based
on provided data - different types of staticoptions exist and
gather their specific selections in unique ways.

Generation is decided in the StaticOption factory, and includes
the ability to ask questions in order to get selection options.
*/
class StaticOption {
    public RefID : string;
    public Name : string;
    public Category : string;
    public ContextVars : ContextEventEntry;
    
    public Description;
    public Selections : IChoice[] = [];

    public MyStaticObject : ContextObject | null;

    public constructor(data : IStaticOption, parent : StaticOptionContextObject) {
        this.ContextVars = data.contextvars;
        this.RefID = data.ref_id;
        this.Name = data.name;
        this.Category = data.category;

        this.MyStaticObject = parent;
        this.Description = DescriptionFactory(data.description, this);
    }

    /**
     * Creates a set of choices to select from.
     */
    public async FindChoices() {undefined}

    /**
     * Getter for selections
     */
    public ReturnChoices() {        
        return this.Selections
    }

    /**
     * Gets a single selection by position in array
     */
    public GetSingleChoice(id : number) {
        return this.Selections[id];
    }

    /**
     * Creates an array of the ID values of
     * choices.
     */
    public GetChoiceIDs() {
        const id_arr : number[] = []

        for (let i = 0; i < this.Selections.length; i++) {
            id_arr.push(this.Selections[i].id)
        }

        return id_arr;
    }

}

interface IStaticOptionTypeList extends IStaticOption {
    type : 'text' | 'number',   // Type used to limit input
    strictness : 'loose' | 'free_form' | 'strict', // How limited should input be (allow anything to only from chosen options)
    predefined_options : string[] // Any preset options
    data_search? : IRequest, // Search request to find additional values
    option_context : ContextEventVals // Used for choice generating methods.
}

class StaticOptionTypeList extends StaticOption {

    public EntryType;
    public Strictness;
    public PresetOptions;
    public DataSearch : IRequest | null = null;
    public OptionContext;

    public constructor(data : IStaticOptionTypeList, parent :  StaticOptionContextObject) {
        super(data, parent)

        this.EntryType = data.type;
        this.Strictness = data.strictness;
        this.PresetOptions = data.predefined_options;
        this.OptionContext = data.option_context;

        if (data.data_search) {
            this.DataSearch = data.data_search;
        }
        
        this.FindChoices();
    }

    /**
     * Performs a search based on the provided request,
     * and combines that with any preset options.
     */
    public async FindChoices() {
        this.Selections = []

        let id_num = 0;
        for (let i = 0; i < this.PresetOptions.length; i++) {
            const val_key = Object.keys(this.OptionContext)[0]
            const value = OptionCallTable[val_key].genericReturn(this, this.OptionContext[val_key], this.PresetOptions[i])

            this.Selections.push({
                id: id_num,
                value: this.PresetOptions[i],
                display_str : value
            })
            id_num += 1;
        }

        if (this.DataSearch != null) {
            const results = Requester.MakeRequest(this.DataSearch);

            for (let i = 0; i < results.length; i++) {
                const val_key = Object.keys(this.OptionContext)[0]
                const value = OptionCallTable[val_key].genericResultReturn(this, this.OptionContext[val_key], results[i])

                this.Selections.push({
                    id: id_num,
                    value: results[i],
                    display_str : value
                })
                id_num += 1;
            }
        }
    }
    
}

interface IStaticOptionContextObjectList extends IStaticOption {
    parent_level : number, // how many levels above this object to start a search from
    question : StaticOptionContextObjectQuestion, // the question to use in filtering context objects
    question_name : string // string name of the event to run
}

interface StaticOptionContextObjectQuestion {
    classes : string[] // classes to include in the search
    questions : QuestionBase[] // Questions, a given object must meet one or more of these questions
}

interface QuestionBase { // To meet a question, all parameters must be met
    tagq? : ContextEventEntry, // Search for contents in that objects tags
    baseq? : ContextEventEntry,  // Search for contents in that objects option_search_viable context data entry
    propertyq? : ContextEventEntry, // Search for properties on an object (if not present, count as failure)
}

class StaticOptionContextObjectList extends StaticOption {
    public ParentRefLevel : number;
    public Question : StaticOptionContextObjectQuestion;
    public QuestionName : string;

    public constructor(data : IStaticOptionContextObjectList, parent :  StaticOptionContextObject) {
        super(data, parent)

        this.QuestionName = data.question_name;
        this.ParentRefLevel = data.parent_level;
        this.Question = data.question;
    }

    /**
     * Perform an event to find what context objects
     * to choose from.
     */
    public async FindChoices() {
        this.Selections = []
        let OptionContextList : ContextObject[] = []

        const RelevantContextObject : ContextObject | null = this.FindContextObject()
        if (RelevantContextObject != null) {
            const Events : EventRunner = new EventRunner();

            OptionContextList = await Events.runEvent(this.QuestionName, RelevantContextObject, [], [], this.Question)

            for (let i = 0; i < OptionContextList.length; i++) {
                if (OptionContextList[i] != this.MyStaticObject) {
                    this.Selections.push({
                        id: i,
                        value: OptionContextList[i],
                        display_str : OptionContextList[i].GetTrueName()
                    })
                }
            }
        }
    }

    /**
     * Finds the source object to use in the event,
     * going up X steps in the context tree. Will return the
     * highest-stage object (ie, if the parent level is 3 but
     * only 2 are there, the 2nd will be returned rather 
     * than null)
     */
    public FindContextObject() {
        let baseobject : ContextObject | null = this.MyStaticObject;

        if (baseobject == null) { return null; }
        for (let i = 0; i < this.ParentRefLevel; i++) {
            const tempobject : ContextObject | null = baseobject.MyContext;
            if (tempobject != null) {
                baseobject = tempobject;
            }
        }

        return baseobject;
    }
    
}

export {IStaticOption, StaticOption, IStaticOptionTypeList, StaticOptionTypeList, IStaticOptionContextObjectList, StaticOptionContextObjectList, StaticOptionContextObjectQuestion, QuestionBase, IChoice}