import { ToolsController } from "../../../_high_level_controllers/ToolsController";
import { WarbandManager } from "../WarbandManager";


class CompendiumImporter {

    
    private static instance: CompendiumImporter;
    UserWarbandManager : WarbandManager;

    /**
     * Initializes all controllers, this also means all initialization
     * is done at once on the page load.
     */
    constructor () {
        const toolcont = ToolsController.getInstance();
        this.UserWarbandManager = toolcont.UserWarbandManager;
    }

    public static getInstance(): CompendiumImporter {
        if (!CompendiumImporter.instance) {
            CompendiumImporter.instance = new CompendiumImporter();
        }
        return CompendiumImporter.instance;
    }

    public async readFileOnUpload(uploadedFile: File | undefined): Promise<boolean> {
        await this.UserWarbandManager.GetItemsAll()

        return new Promise((resolve) => {
            if (!uploadedFile) {
                resolve(false);
                return;
            }

            const fileReader = new FileReader();

            fileReader.onloadend = () => {
                try {
                    this.ConvertImportToWarband( fileReader.result ? fileReader.result.toString() : "" );
                    resolve(true);
                } catch (e) {
                    resolve(false);
                }
            };

            fileReader.readAsText(uploadedFile);
        });
    }

    private ConvertImportToWarband(_content : string) {
        console.log("FOUND")
        console.log(_content)
    }

}

export {CompendiumImporter}