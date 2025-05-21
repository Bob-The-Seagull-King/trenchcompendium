import '../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import Rulesinjury from "./Rulesinjury";
import PageMetaInformation from "../generics/PageMetaInformation";

const RulesInjuriesTable = (props: any) => {
    const items = props.data;

    return (
        <ErrorBoundary fallback={<div>Something went wrong with InjuryDisplay.tsx</div>}>
            <div className={'rules-content-main'}>
                <PageMetaInformation
                    title={"Injuries"}
                    description={'Whenever one of your ELITE models is taken Out of Action during a Battle, you will have to roll D66 for each such model after the battle ends. Consult the Trauma Chart table below to see what happened to your model. Unless rules state otherwise, each Trauma causes a Battle Scar, so mark this on your Warband roster sheet. You can only have one of each type of Battle Scar per ELITE, unless explicitly stated in its entry. If a model rolls a result that would cause it to gain a Battle Scar that it cannot gain again, re-roll on the chart until a viable result is achieved.'}
                />

                <h1>
                    {"Injuries"}
                </h1>
                <p>
                    {'Whenever one of your ELITE models is taken Out of Action during a Battle, you will have to roll D66 for each such model after the battle ends. Consult the Trauma Chart table below to see what happened to your model. Unless rules state otherwise, each Trauma causes a Battle Scar, so mark this on your Warband roster sheet. You can only have one of each type of Battle Scar per ELITE, unless explicitly stated in its entry. If a model rolls a result that would cause it to gain a Battle Scar that it cannot gain again, re-roll on the chart until a viable result is achieved.'}
                </p>
                <br/>
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
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default RulesInjuriesTable;