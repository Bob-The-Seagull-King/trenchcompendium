import { WarbandFactory } from '../../../factories/warband/WarbandFactory';
import { UserWarband, IUserWarband } from './UserWarband';

class WarbandManager {
    public WarbandItemList: UserWarband[] = []; 

    constructor() {
        this.WarbandItemList = this.GrabItems();
    }    

    /**
     * @param _name The name of the item to find
     * @returns The first instance of a item with that name
     */
    public GetItemByName(_name : string) {
        let i = 0;
        for (i=0; i < this.WarbandItemList.length ; i++) {
            try {
                const nameval = this.WarbandItemList[i].Name 
                if ((nameval != undefined? nameval : "" ).trim() == _name) {
                    return this.WarbandItemList[i]
                }
            } catch (e) {
                console.log("Broken Save Item Found")
            }
        }
        return null;
    }

    /**
     * Gets all of the saved items.
     */
    public GrabItems() {
        const TempList: UserWarband[] = [];  
        const data = localStorage.getItem('compendiumsaveitem');  
        try {
            const ItemList: IUserWarband[] = JSON.parse(data || "");
            for (let i = 0; i < ItemList.length; i++) {
                TempList.push(new UserWarband(ItemList[i]))
            }
            return TempList;
        } catch (e) {
            console.log("Local storage is not valid.")
        }
        return TempList;
    }

    /**
     * Updates the browser's local storage to reflect
     * the manager's array of items.
     */
    public SetStorage() {
        const _list: IUserWarband[] = []
        for (let i = 0; i < this.WarbandItemList.length; i++) {
            try {
                _list.push(this.WarbandItemList[i].ConvertToInterface())
            } catch (e) {
                console.log("Conversion Failed")
            }
        }
        localStorage.setItem('userwarbanditem', JSON.stringify(_list));
    }

    /**
     * Attempts to convert a given file into an
     * object, returning a message if something went wrong in
     * the conversion process.
     * @param _content The string representation of the File
     * @returns String message, "" means nothing unusual has
     * occured, non empty strings indicate an error.
     */
    public FileToContentPack(_content : string) {
        let ReturnMsg = "";
        try {
            ReturnMsg = this.ValidateFileData(_content) 
            if (ReturnMsg == "") {
                const ContentNew: UserWarband = new UserWarband(JSON.parse(_content) as IUserWarband);
                this.WarbandItemList.push(ContentNew);
                this.SetStorage();
            } else {
                return ReturnMsg;
            }
        } catch (e) {
            ReturnMsg = "File was not in the Item Sheet format.";
        }

        return ReturnMsg;
    }

    /**
     * Checks if the provided information can convert into
     * a JSON format and that the minimum structure of an item
     * is provided.
     * @param _content The string representation of the File
     * @returns String message, "" means nothing unusual has
     * occured, non empty strings indicate an error.
     */
    private ValidateFileData(_content : string) {
        const TestPack = (JSON.parse(_content))
        let i = 0;

        // Check that no Content Pack shares the same ID
        for (i = 0; i < this.WarbandItemList.length; i++) {
            if (this.WarbandItemList[i].ID == TestPack.id) {
                return "You already have a Item Sheet with the same ID";
            }
        }

        return ""
    }

    /**
     * Getter for the Content Packs
     * @returns All Content Packs
     */
    public GetPack() {
        return this.WarbandItemList;
    }

    /**
     * Remove a Content Pack from the manager and
     * update the stored information to match.
     * @param _pack The Content Pack to remove from the manager
     */
    public DeletePack(_pack : UserWarband) {
        let i = 0;
        for (i = 0; i < this.WarbandItemList.length; i++) {
            if (_pack == this.WarbandItemList[i]) {
                this.WarbandItemList.splice(i, 1);
                break;
            }
        }
        
        this.SetStorage();
    }

    public TstClearStorag() {
        this.WarbandItemList = [];
        this.SetStorage();
    }

    /**
     * Builds a new item and saves it to the browser
     */
    public async NewItem(_title : string, fact_id : string) {
        const msg = ""

        if (_title.trim().length <= 0) {
            return "The Item must have a Title";
        }

        const _Item : IUserWarband = {
            id: this.CalcID(_title.trim()),
            contextdata: {},
            name: _title,
            source: 'user_warband',
            tags: {},
            ducat_bank: 0,
            glory_bank: 0,
            notes: [],
            context: {
                id: this.CalcID(_title.trim() + "_context"),
                limit_ducat: 0,
                limit_model: 0,
                value_ducat: 0,
                value_glory: 0
            },
            exploration: {
                explorationskills: [],
                locations: [],
                contextdata: {},
                id: this.CalcID(_title.trim() + "_exploration"),
                name: _title+"_exploration",
                source: 'user_warband',
                tags: {}
            },
            faction: {
                faction_property: {
                    object_id: fact_id,
                    selections: []
                },
                faction_rules : [],
                contextdata: {},
                id: this.CalcID(_title.trim() + "_exploration"),
                name: _title+"_exploration",
                source: 'user_warband',
                tags: {}
            },            
            models : [],
            equipment : [],
        }

        this.WarbandItemList.push(await WarbandFactory.CreateUserWarband(_Item))
        this.SetStorage();

        return msg;
    }

    /**
     * Recreates a copy of the item as a new item.
     */
    public DuplicateItem(_Item : UserWarband) {        
        const NewMember : UserWarband = new UserWarband(_Item.ConvertToInterface());
        NewMember.Name = _Item.Name + " - Copy"
        NewMember.ID = this.CalcID(_Item.Name + " - Copy");
        
        this.WarbandItemList.push(NewMember);
        this.SetStorage();
    }

    /**
     * Generates an ID based on upload time.
     */
    public CalcID(_name : string) {
        const currentDate = new Date();
        const milliseconds = currentDate.getMilliseconds();
        
        return _name + milliseconds.toString();
    }

    /**
     * Moves a content pack within the array
     * @param _pack the content pack to move
     * @param direction if the pack should be moved up (true) or down (false)
     */
    public ShufflePack(_pack : UserWarband, direction: boolean) {
        
        let i = 0;
        for (i = 0; i < this.WarbandItemList.length; i++) {
            if (_pack == this.WarbandItemList[i]) {
                break;
            }
        }

        if ((i == 0 && direction == true) || (i == this.WarbandItemList.length - 1 && direction == false)) {return;}

        const new_i = i + (direction? -1 : 1);

        const MemberArray = this.WarbandItemList.slice();
        [MemberArray[i], MemberArray[new_i]] = [MemberArray[new_i], MemberArray[i]]

        this.WarbandItemList = MemberArray;

        this.SetStorage();
    }
}

export {WarbandManager}