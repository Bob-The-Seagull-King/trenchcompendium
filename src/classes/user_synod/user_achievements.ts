import { SynodProfilePicData } from "../_high_level_controllers/SynodImageCache";
import { IUserWarband } from "../saveitems/Warband/UserWarband";

interface IAchievement {
    id: number,
    name: string,
    description: string,
    image_url: string,
    image_id: number
}

export {IAchievement}