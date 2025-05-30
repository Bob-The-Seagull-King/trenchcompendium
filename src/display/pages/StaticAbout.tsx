/**
 * A Static page for contact options
 */


import React from 'react'
import imageroadmap from '../../resources/images/Roadmap.png'

const StaticAbout: React.FC = () => {
    return (
        <div className="StaticAbout page-static">
            <div className={'container'}>
                <h1>About the Trench Companion</h1>

                <div className={'rules-scenario-summary rules-card'}>
                    <div className={'rules-scenario-summary-title rules-card-title'}>
                        What Is This?
                    </div>
                                
                    <div className={'rules-card-content'}>
                        <p>
                            {"The Trench-Companion is a 3rd-Party tool for players and lovers of Trench Crusade. This site aims to be the one-stop source for game information and the easiest place to create and maintain your own warbands, campaigns, and a place to access all manner of Trench Crusade content."}
                        </p>
                        <hr/>
                        <p>
                            {"Development on the Trench-Companion is continual and we plan to release updates and expand on the functionality present well into the future. Not only that, but we aim to maintain the site as the most up-to-date resource for Trench-Crusade available."}
                        </p>
                    </div>
                </div>

                <div className={'rules-scenario-summary rules-card'}>
                    <div className={'rules-scenario-summary-title rules-card-title'}>
                        Future Plans
                    </div>

                    <div className={'rules-scenario-summary-content rules-card-content'}>
                        <p> 
                            <img src={imageroadmap}
                                alt="Trench Companion Roadmap"
                                className={'rules-banner-image-element'}
                                style={{width:"100%"}}
                            />
                        </p> 
                        <table className={'rules-scenario-summary-table rules-card-table'}>
                            <tbody>
                                <tr>
                                    <td className={'label-cell'}>
                                        {"Genesis Update (July 2025)"}
                                    </td>
                                    <td>
                                        {"In this initial release of Trench-Companion a full rules compendium will maintain an up-to-date catalogue of all game rules. Not only that, but the Warband Buidler will allow users to create and maintain warbands effortlessly."}
                                    </td>
                                </tr>
                                <tr>
                                    <td className={'label-cell'}>
                                        {"It Never Ends Update (September 2025)"}
                                    </td>
                                    <td>
                                        {"In the first major update to Trench-Companion the Campaign Manager and Play Mode will be added. A campaign manager allows users to associate their warbands with a Campaign, tracking progress across games. Not only that, but scenarios can be played out in the Play Mode to track victory points, glorious deeds, and all other manner of game features."}
                                    </td>
                                </tr>
                                <tr>
                                    <td className={'label-cell'}>
                                        {"Pride Cometh Update (January 2026)"}
                                    </td>
                                    <td>
                                        {"In the second major update the ability for Homebrew Content to be created will be massively expanded. Expansive documentation and guides will be created to help users create their own custom homebrew content and add it to their games. Premium users will also receive a glut of new options and the ability to have their homebrew content hosted for other users to access."}
                                    </td>
                                </tr>
                                <tr>
                                    <td className={'label-cell'}>
                                        {"??? Update (???)"}
                                    </td>
                                    <td>
                                        {"Who knows what the future holds for the Trench Companion."}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StaticAbout