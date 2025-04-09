import React, {useState} from 'react'
import {Collapse} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";
import CustomNavLink from '../../subcomponents/interactables/CustomNavLink';
import { useNavigate } from 'react-router-dom';
import { CollectionsListPage } from '../../../../classes/viewmodel/pages/CollectionListPage';
import { DisplayCollectionType, DisplayCollectionDataDex } from '../../../pages/DisplayPageStatic';
import { FactionCollection } from '../../../../classes/feature/faction/FactionCollection';

interface RulesMenuItemProps {
    title: string;
    slug: string;
    controller?: CollectionsListPage,
    children?: RulesMenuItemProps[];
}

const RulesMenuItem: React.FC<{ data: RulesMenuItemProps[], level?: number; parentPath?: string }> = ({
  data,
  level = 0,
  parentPath = "compendium" // Set "compendium" as the base path
}) => {
    
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
    }

    return (
        <ul className={`menu-list level-${level}`}>
            {data.map((item) => {
                const isOpen = openItems[item.slug]; // Check if item is open
                const itemPath = (item.slug != "")? `${parentPath}/${item.slug}` : `${parentPath}` ; // Prepend "compendium" base path

                return (
                    <li className={`menu-list-item ${item.children ? "has-children" : ""}`} key={item.slug}>
                        <div className="menu-list-item-anchor-wrap">
                            <CustomNavLink link={`/${itemPath}`} runfunc={() => {NavigateOut(`/${itemPath}`)}}>
                                {item.title}
                            </CustomNavLink>
                        </div>
                        

                        {((item.children && item.children.length > 0) || (GetSubItems(item).length > 0)) && (
                            <>
                                <span className="collapse-chevron-wrap" onClick={() => toggleItem(item.slug)}>
                                    <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
                                </span>

                                <Collapse in={isOpen}>
                                    <div>
                                        <RulesMenuItem data={GetAllItems(item)} level={level + 1} parentPath={itemPath} />
                                    </div>
                                </Collapse>
                            </>
                        )}
                    </li>
                );
            })}
        </ul>
    );
};

export default RulesMenuItem;

