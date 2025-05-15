import '../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import KeywordDisplay from "../features/glossary/KeywordDisplay";

const RulesKeywordsTable = (props: any) => {
    const items = props.data;

    return (
        <ErrorBoundary fallback={<div>Something went wrong with InjuryDisplay.tsx</div>}>
            <div className='RulesKeywordsTable rules-card'>
                <div className={'rules-card-title rules-injury-table-title'}>
                    {'Keywords'}
                </div>

                <div className={'rules-card-content rules-card-table-content rules-injury-table-content'}>
                    <table className={'rules-card-table rules-injury-table-content-table'}>
                        <tbody>
                        {items.map((item : any) => (
                            <tr key={item.HeldItem.ID}>
                                <td className={'label-cell text-center'}>
                                    {item.HeldItem.Name}
                                </td>
                                <td>
                                <KeywordDisplay data={item.HeldItem} />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default RulesKeywordsTable;