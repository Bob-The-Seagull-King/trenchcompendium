import { Collapse } from "react-bootstrap";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import LoadingOverlay from "../../generics/Loading-Overlay";
import FighterSTL_List from "../../StlPromotions/FighterSTL_List";

interface StlFinderCollapseProps {
    model_slug: string;
}


// Render order for buckets

const StlFinderCollapse: React.FC<StlFinderCollapseProps> = ({ model_slug = "" }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={`StlFinderCollapse fighter-card-collapse`}>
            <div
                onClick={() => setOpen(!open)}
                className={"fighter-card-collapse-title"}
            >
                <span className={"text"}>{"STL finder"}</span>
                <span className={"collapse-chevron-wrap"}>
                  <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} className="" />
                </span>
            </div>

            <Collapse in={open}>
                <div className="fighter-card-collapse-content">
                    <div className={"fighter-card-collapse-content-inner"}>
                        <FighterSTL_List
                            model_slug={ model_slug}
                            isOpen={open}
                        />
                    </div>
                </div>
            </Collapse>
        </div>
    );
};

export default StlFinderCollapse;
