import { create } from "zustand";
import {ContentPack } from '../classes/contentpacks/contentpack'

type ContentPackStore = {
    ContentPacks: ContentPack[];
    SetFromCookies: () => void;
}

export const useContentPackStore = create<ContentPackStore>((set) => ({
    ContentPacks: [],
    SetFromCookies: () => {
        set(
            (state) => ({ContentPacks: GrabContentPack()})
        )}
}))

function GrabContentPack() {
    const TempList: ContentPack[] = [];  
    const data = localStorage.getItem('contentpackstorage_sitename');  
    try {
        const ContentList: ContentPack[] = JSON.parse(data || "");
        return ContentList;
    } catch (e) {
        undefined;
    }
    return TempList;
}

