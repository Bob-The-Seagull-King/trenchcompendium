import React, {useEffect, useState} from 'react'
import {Collapse} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";
import CustomNavLink from '../subcomponents/interactables/CustomNavLink';
import { useLocation, useNavigate } from 'react-router-dom';
import { CollectionsListPage } from '../../../classes/viewmodel/pages/CollectionListPage';
import { DisplayCollectionType, DisplayCollectionDataDex } from '../../pages/DisplayPageStatic';
import { FactionCollection } from '../../../classes/feature/faction/FactionCollection';
import RulesMenuSubItem from './RulesMenuSubItem';

interface RulesMenuItemProps {
    title: string;
    slug: string;
    controller?: CollectionsListPage,
    superslug? : string,
    children?: RulesMenuItemProps[];
    onNavigate?: () => void;
}

const RulesMenuItem: React.FC<{ data: RulesMenuItemProps[], level?: number; parentPath?: string, onNavigate?: any }> = ({
  data,
  level = 0,
  onNavigate,
  parentPath = "compendium" // Set "compendium" as the base path
}) => {
        // Navigation

    const navigate = useNavigate(); 

    return (
        <ul className={`menu-list level-${level}`}>
            {data.map((item) => 
                <RulesMenuSubItem
                    data={item}
                    key={parentPath+item.title}
                    level={level}
                    parentPath={parentPath}
                    onNavigate={onNavigate}
                />)}
        </ul>
    );
};

export default RulesMenuItem;

