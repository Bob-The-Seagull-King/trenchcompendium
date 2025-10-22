
import React, {useState} from 'react';
import {useCampaign} from "../../../context/CampaignContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch, faFloppyDisk, faPen} from "@fortawesome/free-solid-svg-icons";
import {Button} from "react-bootstrap";

interface CMTextareaProps {
    initialText: string; // the current text
    title: string; // title for the textarea
    onSave: (newText: string) => void; // function on save
    canEdit?: boolean; // boolean capas
    isBusy?: boolean;
}

const CMTextarea: React.FC<CMTextareaProps> = ({ initialText, title, onSave, canEdit, isBusy }) => {
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
            <div className={'CMTextarea-title'}>
                {title}

                {canEdit &&
                    <>
                        {(!showTextarea) ? (
                            <>
                                {isBusy ? (
                                    <Button
                                        variant={"primary"}
                                        className={'btn-sm'}
                                        disabled={true}
                                    >
                                        <FontAwesomeIcon icon={faCircleNotch} className={'fa-spin me-2'}/>
                                        Saving
                                    </Button>

                                ):(
                                    <Button
                                        variant={"primary"}
                                        className={'btn-sm'}
                                        onClick={() => setShowTextarea(true)}
                                    >
                                        <FontAwesomeIcon icon={faPen} className={'me-2'}/>
                                        Edit
                                    </Button>
                                )}
                            </>
                        ) : (
                            <div className={'btn btn-primary btn-sm'}
                                 onClick={() => {
                                     handleSave()
                                 }}
                            >
                                <FontAwesomeIcon icon={faFloppyDisk} className={'me-2'}/>
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
