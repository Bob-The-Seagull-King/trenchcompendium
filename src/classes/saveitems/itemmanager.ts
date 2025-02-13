import { Item, IItem } from './item';

class ItemManager {
    public ItemList: Item[] = []; 

    constructor() {
        this.ItemList = this.GrabItems();
    }    

    /**
     * @param _name The name of the item to find
     * @returns The first instance of a item with that name
     */
    public GetItemByName(_name : string) {
        let i = 0;
        for (i=0; i < this.ItemList.length ; i++) {
            try {
                if (this.ItemList[i].Title.trim() == _name) {
                    return this.ItemList[i]
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
        const TempList: Item[] = [];  
        const data = localStorage.getItem('compendiumsaveitem');  
        try {
            const ItemList: IItem[] = JSON.parse(data || "");
            for (let i = 0; i < ItemList.length; i++) {
                TempList.push(new Item(ItemList[i]))
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
        const _list: IItem[] = []
        for (let i = 0; i < this.ItemList.length; i++) {
            try {
                _list.push(this.ItemList[i].ConvertToInterface())
            } catch (e) {
                console.log("Conversion Failed")
            }
        }
        localStorage.setItem('compendiumsaveitem', JSON.stringify(_list));
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
                const ContentNew: Item = new Item(JSON.parse(_content) as IItem);
                this.ItemList.push(ContentNew);
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
        for (i = 0; i < this.ItemList.length; i++) {
            if (this.ItemList[i].ID == TestPack.id) {
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
        return this.ItemList;
    }

    /**
     * Remove a Content Pack from the manager and
     * update the stored information to match.
     * @param _pack The Content Pack to remove from the manager
     */
    public DeletePack(_pack : Item) {
        let i = 0;
        for (i = 0; i < this.ItemList.length; i++) {
            if (_pack == this.ItemList[i]) {
                this.ItemList.splice(i, 1);
                break;
            }
        }
        
        this.SetStorage();
    }

    /**
     * Builds a new item and saves it to the browser
     */
    public NewItem(_title : string) {
        const msg = ""

        if (_title.trim().length <= 0) {
            return "The Item must have a Title";
        }

        const _Item : IItem = {            
            id : this.CalcID(_title.trim()),
            title : _title
        }

        this.ItemList.push(new Item(_Item))
        this.SetStorage();

        return msg;
    }

    /**
     * Recreates a copy of the item as a new item.
     */
    public DuplicateItem(_Item : Item) {        
        const NewMember : Item = new Item(_Item.ConvertToInterface());
        NewMember.Title = _Item.Title + " - Copy"
        NewMember.ID = this.CalcID(_Item.Title + " - Copy");
        
        this.ItemList.push(NewMember);
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
    public ShufflePack(_pack : Item, direction: boolean) {
        
        let i = 0;
        for (i = 0; i < this.ItemList.length; i++) {
            if (_pack == this.ItemList[i]) {
                break;
            }
        }

        if ((i == 0 && direction == true) || (i == this.ItemList.length - 1 && direction == false)) {return;}

        const new_i = i + (direction? -1 : 1);

        const MemberArray = this.ItemList.slice();
        [MemberArray[i], MemberArray[new_i]] = [MemberArray[new_i], MemberArray[i]]

        this.ItemList = MemberArray;

        this.SetStorage();
    }
}

export {ItemManager}