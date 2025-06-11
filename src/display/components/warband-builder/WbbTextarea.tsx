import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faFloppyDisk, faPen} from '@fortawesome/free-solid-svg-icons';
import {usePlayMode} from "../../../context/PlayModeContext";

interface WbbTextareaProps {
    initialText: string;
    title: string;
    onSave: (newText: string) => void;
}

const WbbTextarea: React.FC<WbbTextareaProps> = ({ initialText, title, onSave }) => {

    const { playMode, togglePlayMode } = usePlayMode();


    const [text, setText] = useState<string>(initialText);

    const [showTextarea, setShowTextarea] = useState(false);

    // Handle save btn click
    const handleSave = () => {
        setShowTextarea(false);
        onSave(text);
    };

    return (
        <div className="WbbTextarea">
            <div className={'WbbTextarea-title'}>
                {title}

                { !playMode &&
                    <>
                        {(!showTextarea) ? (
                            <div className={'btn btn-primary btn-sm'}
                                 onClick={() => setShowTextarea(true)}
                            >
                                <FontAwesomeIcon icon={faPen} className={'icon-inline-left'}/>
                                Edit
                            </div>
                        ) : (
                            <div className={'btn btn-primary'}
                                 onClick={() => {
                                     handleSave()
                                 }}
                            >
                                <FontAwesomeIcon icon={faFloppyDisk} className={'icon-inline-left'}/>
                                Save
                            </div>
                        )}
                    </>
                }
            </div>


            {(!showTextarea) ? (
                <>
                    {(text != '') ? (
                        <div className={'WbbTextarea-text'}>
                            {/* Preserve line breaks*/}
                            {text.split('\n').map((line, i) => (
                                <React.Fragment key={i}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))}
                        </div>
                    ):(
                        <div className={'WbbTextarea-text'}>
                            <i>{'No '}{title}</i>
                        </div>
                    )}
                </>
            ) : (
                <textarea
                    rows={10}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            )}
        </div>
    );
};

export default WbbTextarea;