import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheck, faPen} from '@fortawesome/free-solid-svg-icons';
import {useWbbMode} from "../../../context/WbbModeContext";

interface WbbOptionBoxProps {
    title: string;
    value: string | number;
    onClick: () => void;
    overrideplay? : boolean
}

const WbbOptionBox: React.FC<WbbOptionBoxProps> = ({ title, value, onClick, overrideplay }) => {

    const { play_mode, edit_mode, view_mode, print_mode, mode, setMode } = useWbbMode(); // play mode v2

    return (
        <div className="WbbOptionBox" onClick={(e) => {
            e.stopPropagation();
        }}>
            {title &&
                <div className="WbbOptionBox-title">
                    {title}
                </div>
            }

            <div className="WbbOptionBox-body">
                <div className="WbbOptionBox-value">
                    { value === '' ? (
                        <>
                            {'-'}
                        </>
                    ):(
                        <>
                            {value}
                        </>
                    )}
                </div>

                {/* @TODO: what is overrideplay used for? */}
                {(edit_mode && overrideplay != true) &&
                    <div className="btn btn-primary" onClick={onClick}>
                        <FontAwesomeIcon icon={faPen} className={'icon-inline-left'}/>
                        {'Change'}
                    </div>
                }
            </div>
        </div>
    );
};

export default WbbOptionBox;
