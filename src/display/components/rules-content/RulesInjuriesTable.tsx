import '../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import Rulesinjury from "./Rulesinjury";

const RulesInjuriesTable = (props: any) => {
    const items = props.data;

    return (
        <ErrorBoundary fallback={<div>Something went wrong with InjuryDisplay.tsx</div>}>
            <div className='RulesInjuriesTable rules-injury-table rules-card'>
                <div className={'rules-card-title rules-injury-table-title'}>
                    {'Elites Injury Chart'}
                </div>

                <div className={'rules-card-content rules-card-table-content rules-injury-table-content'}>
                    <table className={'rules-card-table rules-injury-table-content-table'}>

                        <thead>
                        <tr>
                            <th>
                                {'Score D66'}
                            </th>
                            <th>
                                {'Injury'}
                            </th>
                        </tr>
                        </thead>
                        <tbody>

                        {items.map((item : any) => (
                            <tr key={item.HeldItem.ID}>
                                <td className={'label-cell text-center'}>
                                    {item.HeldItem.TableVal}
                                </td>
                                <td>
                                    <Rulesinjury
                                        injury={item.HeldItem}
                                    />
                                </td>
                            </tr>
                        ))}

                        {/*{injuryTableObject.injuryLocations.map((item) => (*/}
                        {/*    <tr key={item.ID}>*/}
                        {/*        <td className={'label-cell text-center'}>*/}
                        {/*            {item.TableValue}*/}
                        {/*        </td>*/}
                        {/*        <td>*/}
                        {/*            <RulesinjuryLocation data={item}/>*/}
                        {/*        </td>*/}
                        {/*    </tr>*/}
                        {/*))}*/}
                        </tbody>
                    </table>
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default RulesInjuriesTable;