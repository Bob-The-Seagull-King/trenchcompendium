import { ISiteUserPublic, SiteUserPublic } from "../../classes/user_synod/user_public";
import { SynodDataCache } from "../../classes/_high_level_controllers/SynodDataCache";
import { ISiteUser, SiteUser } from "../../classes/user_synod/site_user";
import {SYNOD} from "../../resources/api-constants";
import { useAuth } from "../../utility/AuthContext";

const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));

class UserFactory {

    /**
     * 
     * PUBLIC USERS
     * 
     */

    static async BuildUserPublic(_rule: ISiteUserPublic) {
        
        const synodcache = SynodDataCache.getInstance();
        
        if (synodcache.publicObjectCache[_rule.id]) {
            return (synodcache.publicObjectCache[_rule.id]);
        }
        
        const rule = new SiteUserPublic(_rule)
        synodcache.publicObjectCache[_rule.id] = rule;
        await rule.BuildAchievements(_rule);
        await rule.BuildFriends(_rule);
        await rule.BuildWarbands(_rule);
        return rule;
    }

    static async CreatePublicUserByID(_val : number) {

        const synodcache : SynodDataCache = SynodDataCache.getInstance();
        let userdata : ISiteUserPublic | undefined = undefined;

        if (synodcache.CheckPublicCache(_val)) {
            userdata = (synodcache.publicDataCache[_val]);
        }

        if (synodcache.CheckPublicCallCache(_val)) {
            const EMERGENCY_OUT = 1000; // If we spend 100 seconds on one user, just give up
            let count_check = 0;
            while ((!synodcache.CheckPublicCache(_val)) && (count_check < EMERGENCY_OUT)) {
                await delay(100);
                count_check += 1;
            }                   
            userdata = (synodcache.publicDataCache[_val]);
        }

        if (!synodcache.CheckPublicCache(_val)) {
            synodcache.AddPublicCallCache(_val);
            
            const response : Response = await fetch(`${SYNOD.URL}/wp-json/synod/v1/user-public/${_val}`)
            if (response) {
                const json : any = await response.json();              
                userdata = json
                synodcache.AddPublicCache(_val, json)
            }
        }

        if (userdata != undefined) {
            console.log(userdata)
            const user = await UserFactory.BuildUserPublic(userdata)
            return user;
        }

        return null;
    }
    
    /**
     * 
     * PRIVATE USERS
     * 
     */

    static async BuildUserPrivate(_rule: ISiteUser) {
        
        const synodcache = SynodDataCache.getInstance();
        
        if (synodcache.userObjectCache[_rule.id]) {
            return (synodcache.userObjectCache[_rule.id]);
        }
        
        const rule = new SiteUser(_rule)
        synodcache.userObjectCache[_rule.id] = rule;
        await rule.GenerateWarbands(_rule);
        return rule;
    }

    static async CreatePrivateUserByID(_val : number) {

        const synodcache : SynodDataCache = SynodDataCache.getInstance();
        let userdata : ISiteUser | undefined = undefined;

        if (synodcache.CheckCache(_val)) {
            userdata = (synodcache.userDataCache[_val]);
        }

        if (synodcache.CheckCallCache(_val)) {
            const EMERGENCY_OUT = 1000; // If we spend 100 seconds on one user, just give up
            let count_check = 0;
            while ((!synodcache.CheckCache(_val)) && (count_check < EMERGENCY_OUT)) {
                await delay(100);
                count_check += 1;
            }                   
            userdata = (synodcache.userDataCache[_val]);
        }

        if (!synodcache.CheckCache(_val)) {
            synodcache.AddCallCache(_val);


            /**
             * This gets the Auth token from local storage. We could use the Auth Context maybe?
             */
            const token = localStorage.getItem('jwtToken')

            const response = await fetch(`${SYNOD.URL}/wp-json/synod/v1/user-full/${_val}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            if (response) {
                const json : any = await response.json();              
                userdata = json
                synodcache.AddCache(_val, json)
            }
        }

        if (userdata != undefined) {
            const user = await UserFactory.BuildUserPrivate(userdata)
            return user;
        }

        return null;
    }
}

export {UserFactory}