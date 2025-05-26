import React from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import CustomNavLink from "../components/subcomponents/interactables/CustomNavLink";
import {ROUTES} from "../../resources/routes-constants";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../utility/AuthContext";


const FooterMain: React.FC = () => {

    const navigate = useNavigate();
    const { userId, isLoggedIn } = useAuth()

    // main rules related links
    const rules_links = [
        {
            title: 'Playtest Rules',
            link: '/compendium/game/rules'
        },
        {
            title: 'Factions',
            link: '/compendium/game/rules'
        },
        {
            title: 'Campaign Rules',
            link: '/compendium/game/rules'
        },
        {
            title: 'Scenarios',
            link: '/compendium/scenario'
        },
    ]

    // Warband related links
    const warband_links = [
        {
            title: 'Your Warbands',
            link: ROUTES.WARBAND_ROUTE
        },
        {
            title: 'New Warband',
            link: ROUTES.WARBAND_ROUTE + '/new/'
        },
    ]

    // Account related links
    const profile_link = isLoggedIn && userId
        ? `/profile/${userId}`
        : '/login'

    const account_settings_link = isLoggedIn && userId
        ? `/profile/${userId}/settings`
        : '/login'

    const account_links = [
        {
            title: 'Your Profile',
            link: profile_link
        },
        {
            title: 'Account Settings',
            link: account_settings_link
        },
        {
            title: 'Premium Membership',
            link: ROUTES.PAGE_MEMBERSHIP
        },
        {
            title: 'Supporter Packs',
            link: ROUTES.PAGE_SUPPORTER_PACKS
        },
        {
            title: 'Collaborations',
            link: ROUTES.PAGE_COLLABORATE
        },
    ]


    const legal_links = [
        {
            title: 'Legal Notice',
            link: ROUTES.PAGE_LEGAL
        },
        {
            title: 'Privacy',
            link: ROUTES.PAGE_PRIVCACY
        },
        {
            title: 'Terms & Conditions',
            link: ROUTES.PAGE_TERMS
        },
        {
            title: 'Withdrawal',
            link: ROUTES.PAGE_WITHDRAWAL
        },
        {
            title: 'Contact',
            link: ROUTES.PAGE_CONTACT
        }
    ]


    const footer_link_lists = [
        {
            title: 'Trench Crusade Rules',
            links: rules_links
        },
        {
            title: 'Warbands',
            links: warband_links
        },
        {
            title: 'Account',
            links: account_links
        },
        {
            title: 'Legal Information',
            links: legal_links
        }
    ]

    return (
        <footer className="FooterMain">
            <div className={'footer-upper'}>
                <div className={'container'}>
                    <div className={'row'}>
                        {footer_link_lists.map((list, i) => (
                            <div className={'col-12 col-sm-6 col-lg-3'} key={i}>
                                <div className={'footer-link-list'}>
                                    <h6>{list.title}</h6>
                                    <ul>
                                        {list.links.map((linkItem, j) => (
                                            <li key={j}>
                                                <CustomNavLink
                                                    link={linkItem.link}
                                                    runfunc={() => {
                                                        navigate(linkItem.link)
                                                    }}>
                                                    {linkItem.title}
                                                </CustomNavLink>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>

            <div className={'footer-bar'}>
                <div className={'container'}>

                    <CustomNavLink
                        link={ROUTES.PAGE_LEGAL}
                        runfunc={() => {
                            navigate(ROUTES.PAGE_LEGAL)
                        }}>
                        {'Legal Notice'}
                    </CustomNavLink>

                    <CustomNavLink
                        link={ROUTES.PAGE_PRIVCACY}
                        runfunc={() => {
                            navigate(ROUTES.PAGE_PRIVCACY)
                        }}>
                        {'Privacy'}
                    </CustomNavLink>

                    <CustomNavLink
                        link={ROUTES.PAGE_TERMS}
                        runfunc={() => {
                            navigate(ROUTES.PAGE_TERMS)
                        }}>
                        {'Terms & Conditions'}
                    </CustomNavLink>
                </div>
            </div>
        </footer>
    )
}

export default FooterMain