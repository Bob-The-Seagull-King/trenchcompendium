import { FilterManager } from "../../../../classes/viewmodel/collections/filters/FilterManager"
import {FilterTagItem, FilterTextItem, FilterMiscItem} from "../../../components/subcomponents/filters/FilterItems"
import GenericDisplay from "../../../components/generics/GenericDisplay"
import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons"

export interface PanelType {
    id      : string,
    returnButton: ( open : NoneToNoneFunction) => JSX.Element
    returnModal: () => JSX.Element
}

export interface PanelDataTable {[moveid: Lowercase<string>]: PanelType}

type NoneToNoneFunction = () => void;

export const PanelDataDex : PanelDataTable = {
    contentpack: {
        id : "Content Pack",
        returnButton(open : NoneToNoneFunction) {
            return (
                <FontAwesomeIcon icon={faCircleInfo} onClick={() => open()} className="pageaccestext hovermouse" style={{fontSize:"3em"}}/>
            )
        },
        returnModal() {
            return (
                <div className="row p-3 overflow-auto flex-grow-1">
                    <div className="height70">
                        <div className="col-12">
                            <div className="row">
                                <p className="bodytext">
                                    Content packs are structured JSON files that allow people to make their game content accessable in
                                    the compendium. Here, you can add or delete content packs to include them in the Compendium. You can
                                    hold up to 5MB of content packs at any given time.
                                </p>
                                <p className="bodytext">
                                    Once uploaded you can activate or deactive a content pack. Deactivating it removes it from the Compendium,
                                    but still keeps the file stored on your browser and can be turned on again at any time.
                                </p>
                                <p className="bodytext">
                                    If two pieces of data across your uploaded content packs share the same ID value, this can cause issues
                                    when searching and constructing information. When this incompatability is detected, you will be notified.
                                    and are encouraged to remove the offending content pack.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}