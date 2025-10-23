import AlertCustom from "../../components/generics/AlertCustom";
import React from "react";
import CMPlayerListEntry from "./CMPlayerListEntry";


/**
 * A unified way to show the markdown tip
 * @constructor
 */
const CMMarkdownTip: React.FC = () => {

    return (
        <AlertCustom
            type={'info'}
            className={'mt-3'}
        >
            <div className={'fw-bold'}>{'You can use the following markdown'}</div>
            <div className={'mt-2'}>
                <div>
                    {'**Bold text**'} → <strong>{'Bold text'}</strong>
                </div>
                <div>
                    {'*Italic text*'} → <em>{'Italic text'}</em>
                </div>
                <div>
                    {'[Linktext](https://example.com)'} → <a href={"/"} rel={'nofollow noreferrer noopener'}
                                                             target={'_blank'}>{'Linktext'}</a>
                </div>
            </div>
        </AlertCustom>

    );
}
export default CMMarkdownTip;
