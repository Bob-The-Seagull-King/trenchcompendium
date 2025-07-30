import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheck, faPen} from '@fortawesome/free-solid-svg-icons';
import {usePlayMode} from "../../../context/PlayModeContext";

interface WbbOptionBoxProps {
    title: string;
    value: string | number;
    onClick: () => void;
    overrideplay? : boolean
}

const WbbOptionBox: React.FC<WbbOptionBoxProps> = ({ title, value, onClick, overrideplay }) => {

    const { playMode, togglePlayMode } = usePlayMode();

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

                {(!playMode && overrideplay != true) &&
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
