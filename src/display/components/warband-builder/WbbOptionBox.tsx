import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheck, faPen} from '@fortawesome/free-solid-svg-icons';
import {usePlayMode} from "../../../context/PlayModeContext";

interface WbbOptionBoxProps {
    title: string;
    value: string;
    onClick: () => void;
}

const WbbOptionBox: React.FC<WbbOptionBoxProps> = ({ title, value, onClick }) => {

    const { playMode, togglePlayMode } = usePlayMode();

    return (
        <div className="WbbOptionBox">
            <div className="WbbOptionBox-title">
                {title}
            </div>

            <div className="WbbOptionBox-body">
                <div className="WbbOptionBox-value">
                    {value}
                </div>

                {!playMode &&
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
