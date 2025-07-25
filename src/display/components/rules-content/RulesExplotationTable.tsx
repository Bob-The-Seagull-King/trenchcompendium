import '../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { ExplorationTable } from '../../../classes/feature/exploration/ExplorationTable';
import RulesExplorationLocation from "./RulesExplorationLocation";
import PageMetaInformation from "../generics/PageMetaInformation";

const RulesExplotationTable = (props: any) => {
    const explorationTableObject: ExplorationTable = props.data

    let title;

    if( explorationTableObject.Name ) {
        title = explorationTableObject.Name.toString();
    } else {
        title = '';
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with ExplorationTableDisplay.tsx</div>}>
            <PageMetaInformation
                title={title}
                description={'Find ' + explorationTableObject.Name + ' for explorations in your Trench Crusade campaign games. '}
            />

            <h1>
                {explorationTableObject.Name}
            </h1>

            <div className='RulesExplotationTable rules-exploration-table rules-card'>
                <div className={'rules-card-title rules-exploration-table-title'}>
                    {explorationTableObject.Name}
                </div>

                <div className={'rules-card-content rules-card-table-content rules-exploration-table-content'}>
                    <table className={'rules-card-table rules-exploration-table-content-table'}>
                        <thead>
                            <tr>
                                <th>
                                    {'Score'}
                                </th>
                                <th>
                                    {'Location'}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {explorationTableObject.ExplorationLocations.map((item) => (
                                <tr key={item.ID}>
                                    <td className={'label-cell text-center'}>
                                         {item.TableValue}
                                    </td>
                                    <td>
                                        <RulesExplorationLocation data={item} />
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

export default RulesExplotationTable;