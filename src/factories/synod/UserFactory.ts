import { SynodDataCache } from "../../classes/_high_level_controllers/SynodDataCache";
import { ISiteUser, SiteUser } from "../../classes/user_synod/site_user";
import {SYNOD} from "../../resources/api-constants";

const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));

class UserFactory {

    /**
     * Creates an ability based on provided data
     * @param _ability The data in IPlayerAbility format describing the ability
     * @returns A newly created ability
     */
    static async BuildUser(_rule: ISiteUser) {
        
        console.log("e")
        const synodcache = SynodDataCache.getInstance();
        
        if (synodcache.userObjectCache[_rule.id]) {
            return (synodcache.userObjectCache[_rule.id]);
        }
        console.log("f")
        const rule = new SiteUser(_rule)
        synodcache.userObjectCache[_rule.id] = rule;
        await rule.BuildAchievements(_rule);
        await rule.BuildFriends(_rule);
        await rule.BuildRequests(_rule);
        await rule.BuildWarbands(_rule);
        return rule;
    }

    static async CreateUserByID(_val : number) {
        console.log("a")
        const synodcache : SynodDataCache = SynodDataCache.getInstance();
        let userdata : ISiteUser | undefined = undefined;

        if (synodcache.CheckCache(_val)) {
            userdata = (synodcache.userDataCache[_val]);
        }

        console.log("b")
        if (synodcache.CheckCallCache(_val)) {
            const EMERGENCY_OUT = 1000; // If we spend 100 seconds on one user, just give up
            let count_check = 0;
            while ((!synodcache.CheckCache(_val)) && (count_check < EMERGENCY_OUT)) {
                await delay(100);
                count_check += 1;
            }                   
            userdata = (synodcache.userDataCache[_val]);
        }

        console.log("c")
        if (!synodcache.CheckCache(_val)) {
            synodcache.AddCallCache(_val);
            
            const response : Response = await fetch(`${SYNOD.URL}/wp-json/synod/v1/user-public/${_val}`)
            if (response) {
                const json : any = await response.json();
                console.log(json)                
                userdata = json
                console.log(json);
                synodcache.AddCache(_val, json)
            }
        }

        console.log("d")
        console.log(userdata)
        if (userdata != undefined) {
            const user = await UserFactory.BuildUser(userdata)
            return user;
        }

        return null;
    }

}

export {UserFactory}