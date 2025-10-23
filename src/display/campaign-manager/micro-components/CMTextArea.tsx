
import React, {useState} from 'react';
import {useCampaign} from "../../../context/CampaignContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp, faCircleNotch, faFloppyDisk, faPen} from "@fortawesome/free-solid-svg-icons";
import {Button} from "react-bootstrap";
import CMMarkdownTip from "./CMMarkdownTip";
import {renderMiniMarkdown} from "../../../utility/util";

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

    const [expanded, setExpanded] = useState(false);

    const CHAR_LIMIT = 200;
    const isLong = renderMiniMarkdown(text).length > CHAR_LIMIT;

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
                        <div className={'CMTextarea-text-wrap'}>
                            <p
                                className={`CMTextarea-text ${isLong ? 'is-long' : ''} ${expanded ? 'is-expanded' : ''}`}
                                dangerouslySetInnerHTML={{__html: renderMiniMarkdown(text)}}
                            >
                            </p>

                            {!expanded && isLong && (
                                <span
                                    className="show-more small"
                                    onClick={() => setExpanded(true)}
                                >
                                    {'Show more'}
                                    <FontAwesomeIcon icon={faChevronDown} className={'ms-2'}/>
                                </span>
                            )}
                            {expanded && isLong && (
                                <span
                                    className="show-less small"
                                    onClick={() => setExpanded(false)}
                                >
                                    {'Show less'}
                                    <FontAwesomeIcon icon={faChevronUp} className={'ms-2'}/>
                                </span>
                            )}
                        </div>

                    ) : (
                        <div className={'CMTextarea-text-wrap'}>
                            <i>{'No '}{title}</i>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <textarea
                        rows={12}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <CMMarkdownTip />
                    <div className={'my-4'} />
                </>

            )}
        </div>
    );
};

export default CMTextarea;
