import React, {useState} from 'react'
import {Collapse} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";

interface RulesMenuItemProps {
    title: string;
    slug: string;
    children?: RulesMenuItemProps[];
}

const RulesMenuItem: React.FC<{ data: RulesMenuItemProps[], level?: number; parentPath?: string }> = ({
  data,
  level = 0,
  parentPath = "compendium" // Set "compendium" as the base path
}) => {

    // Store open state per item
    const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

    const toggleItem = (slug: string) => {
        setOpenItems(prev => ({
            ...prev,
            [slug]: !prev[slug] // Toggle open state for this item
        }));
    };

    return (
        <ul className={`menu-list level-${level}`}>
            {data.map((item) => {
                const isOpen = openItems[item.slug]; // Check if item is open
                const itemPath = `${parentPath}/${item.slug}`; // Prepend "compendium" base path

                return (
                    <li className={`menu-list-item ${item.children ? "has-children" : ""}`} key={item.slug}>
                        <a href={`/${itemPath}`} className="menu-list-item-anchor">
                            {item.title}
                        </a>

                        {item.children && item.children.length > 0 && (
                            <>
                                <span className="collapse-chevron-wrap" onClick={() => toggleItem(item.slug)}>
                                    <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
                                </span>

                                <Collapse in={isOpen}>
                                    <div>
                                        <RulesMenuItem data={item.children} level={level + 1} parentPath={itemPath} />
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

