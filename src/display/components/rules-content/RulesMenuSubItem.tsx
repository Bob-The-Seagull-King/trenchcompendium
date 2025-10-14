import React, {useEffect, useState} from 'react'
import {Collapse} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";
import CustomNavLink from '../subcomponents/interactables/CustomNavLink';
import { useLocation, useNavigate } from 'react-router-dom';
import { CollectionsListPage } from '../../../classes/viewmodel/pages/CollectionListPage';
import { DisplayCollectionType, DisplayCollectionDataDex } from '../../pages/DisplayPageStatic';
import { FactionCollection } from '../../../classes/feature/faction/FactionCollection';
import RulesMenuItem from './RulesMenuItem';

interface RulesMenuItemProps {
    title: string;
    slug: string;
    open? : boolean;
    controller?: CollectionsListPage,
    superslug? : string,
    children?: RulesMenuItemProps[];
    onNavigate?: () => void;
}

const RulesMenuSubItem: React.FC<{ data: RulesMenuItemProps, level?: number; parentPath?: string, onNavigate?: any }> = ({
  data,
  level = 0,
  onNavigate,
  parentPath = "compendium" // Set "compendium" as the base path
}) => {
    
    const urlPath = useLocation().pathname;

    function GetSubItems(item : RulesMenuItemProps) {
        const SubItems : RulesMenuItemProps[] = []
        if (item.controller) {
            const DisplayPage: DisplayCollectionType = DisplayCollectionDataDex[item.controller.TypeName]
            
            if (DisplayPage.menushowitems == true) {        
                item.controller.initCollection();
            }

            for (let i = 0; i < item.controller.Collection.itemcollection.length; i++) {
                const Item = item.controller.Collection.itemcollection[i]

                if (DisplayPage.searchId=="faction") {
                    const children_list : RulesMenuItemProps[] = []
                    for (let j = 0; j < (Item.HeldItem as FactionCollection).SubModelsList.length; j++) {
                        if ((Item.HeldItem as FactionCollection).SubModelsList[j].var_name != "base") {
                            const NewItem = (Item.HeldItem as FactionCollection).SubModelsList[j].faction
                            children_list.push(
                                {
                                    title: (NewItem.Name != undefined)? NewItem.Name : "",
                                    slug: NewItem.ID,
                                }
                            )
                        }
                    }
                    SubItems.push({
                        title: Item.HeldItem.Name,
                        slug: Item.HeldItem.ID,
                        children: children_list
                    })
                } else {
                    SubItems.push({
                        title: Item.HeldItem.Name,
                        slug: Item.HeldItem.ID
                    })
                }
            }
        } else if (item.slug == "armoury") {
            SubItems.push({
                title: "Ranged Weapons",
                slug: "ranged"
            })
            SubItems.push({
                title: "Melee Weapons",
                slug: "melee"
            })
            SubItems.push({
                title: "Armour",
                slug: "armour"
            })
            SubItems.push({
                title: "Equipment",
                slug: "equipment"
            })
        }
        return SubItems
    }

    function GetAllItems(item : RulesMenuItemProps) {
        const AllItems : RulesMenuItemProps[] = []

        if (item.children) {
            AllItems.push(...item.children)
        }

        AllItems.push(...GetSubItems(item))

        return AllItems
    }

    // Store open state per item
    const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

    const toggleItem = (slug: string) => {
        setOpenItems(prev => ({
            ...prev,
            [slug]: !prev[slug] // Toggle open state for this item
        }));
    };
        // Navigation

    const navigate = useNavigate(); 

    function NavigateOut(link : string) {
        navigate(link, {state: Date.now().toString()});
        if (onNavigate) onNavigate();
    }
    const isOpen = openItems[data.slug] || data.open == true; // Check if item is open
    const itemPath = (data.superslug != undefined)? data.superslug : (data.slug != "")? `${parentPath}/${data.slug}` : `${parentPath}` ; // Prepend "compendium" base path
    const basePath = (data.slug != "")? `${parentPath}/${data.slug}` : `${parentPath}` ; // Prepend "compendium" base path
    
    const location = useLocation()
    const [isCurrentPage, setCurrentPage] = useState(false)
    const [keyvar, setkeyvar] = useState(0)

    useEffect(() => {
        setCurrentPage(((urlPath.substring(1)) == (itemPath)))
        if (((urlPath.substring(1)).includes(itemPath))) {
            setOpenItems(prev => ({
                ...prev,
                [data.slug]: true // Toggle open state for this item
            }));
            setkeyvar(keyvar + 1)
        } else {
            setOpenItems(prev => ({
                ...prev,
                [data.slug]: false // Toggle open state for this item
            }));
            
        }
    }, [location]);

    
    return (
        <li className={`menu-list-item ${data.children ? "has-children" : ""}`} key={data.slug}>
            <div key={keyvar} className="menu-list-item-anchor-wrap">
                <CustomNavLink link={`/${itemPath}`} runfunc={() => {
                    NavigateOut(`/${itemPath}`)
                    }}
                    classes={((isCurrentPage == true)? "current" : "")}
                >
                    {data.title}
                </CustomNavLink>
            </div>
            

            {((data.children && data.children.length > 0) || (GetSubItems(data).length > 0)) && (
                <>
                    <span className="collapse-chevron-wrap" onClick={() => toggleItem(data.slug)}>
                        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
                    </span>

                    <Collapse in={isOpen}>
                        <div>
                            <RulesMenuItem
                                data={GetAllItems(data)}
                                level={level + 1}
                                parentPath={basePath}
                                onNavigate={onNavigate}
                            />
                        </div>
                    </Collapse>
                </>
            )}
        </li>
    );
            

};

export default RulesMenuSubItem;

