
import React, {useState} from 'react';
import {useCampaign} from "../../../context/CampaignContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFloppyDisk, faPen} from "@fortawesome/free-solid-svg-icons";

interface CMTextareaProps {
    initialText: string; // the current text
    title: string; // title for the textarea
    onSave: (newText: string) => void; // function on save
    canEdit?: boolean; // boolean capas
}

const CMTextarea: React.FC<CMTextareaProps> = ({ initialText, title, onSave, canEdit }) => {
    const { campaign } = useCampaign();
    const [text, setText] = useState<string>(initialText);
    const [showTextarea, setShowTextarea] = useState(false);


    // Handle save btn click
    const handleSave = () => {
        setShowTextarea(false);
        onSave(text);
    };

    // do not show if not admin and no text is set
    if( !canEdit && text == '' ) {
        return null;
    }

    return (
        <div className="CMTextarea">
            <div className={'WbbTextarea-title'}>
                {title}

                {canEdit &&
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
                                    <br/>
                                </React.Fragment>
                            ))}
                        </div>
                    ) : (
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

export default CMTextarea;
