import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheck, faPen} from '@fortawesome/free-solid-svg-icons';

interface RulesOptionBoxProps {
    title: string;
    value: string | number;
    onClick: () => void;
}

const RulesOptionBox: React.FC<RulesOptionBoxProps> = ({ title, value, onClick }) => {

    return (
        <div className="WbbOptionBox">
            <div className="WbbOptionBox-title">
                {title}
            </div>

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

                <div className="btn btn-primary" onClick={onClick}>
                    <FontAwesomeIcon icon={faPen} className={'icon-inline-left'}/>
                    {'Change'}
                </div>
            </div>
        </div>
    );
};

export default RulesOptionBox;
