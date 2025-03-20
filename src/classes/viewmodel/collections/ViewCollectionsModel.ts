import { Requester, IRequest } from '../../../factories/Requester'
import { CollectionDataDex, CollectionType } from './CollectionsStatic';
import { VariantSearch } from './filters/FiltersStatic';

class ViewCollectionsModel {

    searchParam: any = {};
    dataresults: any = [];
    itemcollection: any[] = [];

    ObjectList: any[] = [];
    CollectionType: CollectionType;

    TargetItem : any = null;

    /**
     * Empty constructor
     */
    constructor(type : Lowercase<string>) {
        this.ObjectList = []
        this.CollectionType = CollectionDataDex[type]
    }

    public UpdateTargetItem(item : any) {
        console.log(item);
        this.TargetItem = item;
    }

    /**
     * Updates the searchParam value
     * @param request The IRequest formatted searchParam
     */
    public UpdateSearchParams(request: IRequest) {
        this.searchParam = request;
    }

    /**
     * Make a request with the searchParam and store the resulting data
     */
    public RunSearch() {
        this.dataresults = Requester.MakeRequest(this.searchParam as IRequest);
        if (this.dataresults.length == undefined) {
            this.dataresults = [this.dataresults]
        }
        if (this.CollectionType) {
            this.CollectionType.postSearch(this);
        }
    }

    public RunMultiUnitSearch( variantsearchparams : VariantSearch) {
        this.dataresults = Requester.MakeRequest(this.searchParam as IRequest);
        if (this.dataresults.length == undefined) {
            this.dataresults = [this.dataresults]
        }

        const VariantParam = this.searchParam
        VariantParam.searchparam.type = variantsearchparams.item_type;

        const VariantResults = Requester.MakeRequest(VariantParam as IRequest)
        const RelevantResults : string[] = []
        const ExtantVariants : string[] = []

        for (let i = 0; i < this.dataresults.length; i++){
            ExtantVariants.push(this.dataresults[i].id)
        }
        for (let i = 0; i < VariantResults.length; i++){
            const Result = VariantResults[i]
            const dynamicKey = variantsearchparams.base_var_key as keyof (typeof Result);
            if (Result[dynamicKey] != undefined) {
                if (!ExtantVariants.includes(VariantResults[i][dynamicKey])) {
                    RelevantResults.push(Result[dynamicKey])
                }
            }
        }

        const ResultsToAdd = Array.from(new Set([...RelevantResults]))

        for (let i = 0; i < ResultsToAdd.length; i++) {
            const NewSearch = {      
                searchtype: "complex",
                searchparam:    {
                    type: variantsearchparams.base_var_type,
                    request:    {
                        operator: "or",
                        terms: [
                            {             
                                item: "id",
                                value: ResultsToAdd[i],
                                equals: true,
                                strict: true
                            }
                        ],
                        subparams: []
                    }
                }  
            } 
            const AddedItem = Requester.MakeRequest(NewSearch as IRequest)
            for (let j = 0; j < AddedItem.length; j++) {
                this.dataresults.push(AddedItem[j])
            }
        }

        if (this.CollectionType) {
            this.CollectionType.postSearch(this);
        }
    }

    /**
     * Basic get function
     */
    public GetResults() {
        return this.dataresults
    }

    /**
     * Basic get function
     */
    public GetParam() {
        return this.searchParam as IRequest
    }

    /**
     * When destroyed, delete all ability objects
     */
    destructor() {
        this.CleanupItems() 
    }

    /**
     * Delete each ability object stored in the collection
     */
    CleanupItems() {
        let i = 0;
        for (i = 0; i < this.ObjectList.length; i ++) {
            delete this.ObjectList[i]
        }
        this.ObjectList = []
    }

    /**
     * Delete the currently searched text Items
     */
    CleanupCollection() {
        let i = 0;
        for (i = 0; i < this.itemcollection.length; i ++) {
            delete this.itemcollection[i]
        }
        this.itemcollection = []
    }

    /**
     * Basic get function
     */
    public ReturnObjects() {
        this.UpdateList();
        return this.ObjectList;
    }

    /**
     * Basic return function
     */
    public ReturnItems() {
        return this.itemcollection;
    }
    
    /**
     * Updates the list of abilities to be displayed
     * on screen.
     */
    UpdateList() {
        let i = 0;
        this.ObjectList = []
        for (i = 0; i < this.itemcollection.length; i++) {
            if (this.itemcollection[i].IsActive) {
                this.ObjectList.push(this.itemcollection[i].HeldItem)
            }
        }
    }
}

export {ViewCollectionsModel}