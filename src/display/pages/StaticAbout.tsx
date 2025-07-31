/**
 * A Static page for contact options
 */


import React from 'react'
import RulesBannerImage from "../components/rules-content/RulesBannerImage";

const StaticAbout: React.FC = () => {
    return (
        <div className="StaticAbout page-static ">
            <div className={'narrow-content'}>
                <div className={'container'}>

                    <h1>About the Trench Companion</h1>

                    <h2>
                        What Is This?
                    </h2>

                    <p>
                        {"Trench Companion is a fan-made tool designed to support players of Trench Crusade. From building your warband to running full campaigns, it brings all game content into one place — streamlined, accessible, and always up to date."}
                    </p>
                    <hr/>
                    <p>
                        {"We’re developing Trench Companion continuously, with new features and content planned well into the future. Below, you’ll find a roadmap showing our current release stages and what’s coming next."}
                    </p>

                    <div className={'spacer-20'}></div>
                    <div className={'spacer-20'}></div>

                    <h2 style={{maxWidth: '575px', marginLeft: 'auto', marginRight: 'auto'}}>
                        Future Plans
                    </h2>

                    <div className={'StaticTimeline'}>
                        <div className={'timeline-entry'}>
                            <h3>
                                {'Genesis'}
                            </h3>
                            <h4>
                                {'July 2025'}
                            </h4>
                            <p>
                                {'In this initial release of Trench-Companion a full rules compendium will maintain an up-to-date catalogue of all game rules. Not only that, but the Warband Buidler will allow users to create and maintain warbands effortlessly - stored locally or on our online Synod servers.'}
                            </p>
                        </div>


                        <div className={'timeline-entry'}>
                            <h3>
                                {'It Never Ends Update'}
                            </h3>
                            <h4>
                                {'September 2025'}
                            </h4>
                            <p>
                                {'In the first major update to Trench-Companion the Campaign Manager and Play Mode will be added. A campaign manager allows users to associate their warbands with a Campaign or join a friend\'s campaign, tracking progress across games. Not only that, but scenarios can be played out in the Play Mode to track victory points, glorious deeds, and all other manner of game features.'}
                            </p>
                        </div>

                        <div className={'timeline-entry'}>
                            <h3>
                                {'Pride Cometh Update '}
                            </h3>
                            <h4>
                                {'January 2026'}
                            </h4>

                            <p>
                                {'In the second major update the ability for Homebrew Content to be created will be officially included. Expansive documentation and guides will be made to help users create their own custom homebrew content and add it to their games and share with their fellow players! Premium users will also receive a glut of new cosmetic options and the ability to have their homebrew content hosted for other users to access effortlessly.'}
                            </p>
                        </div>

                        <div className={'timeline-entry'}>
                            <h3>
                                {'Ḩ̶̨̹̰͖̈́́̃ï̵̭̍̾͆͆ś̴̡̨̠̤̠̏̎͆ ̸̜̎̿̃͘A̷̧͈̅r̸̭̠̬̺̘̓́̏r̵̲̬͐i̸̝̍̔v̷̨̻̙̘̝̆̏̔͘a̴͉͙̲͒̐̿͆̀l̴̬̪̏̏̀ ̶̢̲̮̼͎̒̀̈́͂̂I̷̩͎̊̀̕s̶͇̺̘̟̀̾̀̄ ̶͇̻̃͌͒̕͜U̷̡̦̜͆̓͐p̷͉̆̋ọ̶̎̌̽̍ṋ̷̥͘ ̴̙̝͉̪̀Ǔ̴̳͈͉̬̌̃s̵̮͒̋̿'}
                            </h3>
                            <h4>
                                <del>
                                    {'2̷̧̨̺͚͚̿́̓̋͝0̴̛̗̽2̶̰͉̜̈́̿̒6̶̨̣͓̬̓̑'}
                                </del>
                            </h4>

                            <p>
                                {'What comes next lies shrouded in mystery. As the world of Trench Crusade evolves, we are preparing for something greater — new features, expanded systems, and gifts yet unnamed. No promises, only omens. Expect the unexpected.'}
                            </p>
                        </div>
                    </div>


                    <h2>
                        {'Do you want to know more?'}
                    </h2>

                    <div className={'row '}>
                        <div className={'col-12 col-md-6'}>
                            <RulesBannerImage
                                imageId={2899}
                                linkUrl={'/blog'}
                                linkText={'Blog'}
                            />
                        </div>
                        <div className={'col-12 col-md-6'}>
                            <RulesBannerImage
                                imageId={2900}
                                linkUrl={'/page/premium-membership'}
                                linkText={'How to support'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StaticAbout