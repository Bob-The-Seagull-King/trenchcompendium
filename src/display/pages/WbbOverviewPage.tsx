import React, { useEffect, useState } from 'react';
import WbbWarbandListItem from "../components/warband-builder/WbbWarbandListItem";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faPlus, faUser, faXmark} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import { SumWarband, WarbandManager } from '../../classes/saveitems/Warband/WarbandManager';
import CustomNavLink from '../components/subcomponents/interactables/CustomNavLink';
import { UserWarband } from '../../classes/saveitems/Warband/UserWarband';
import PageMetaInformation from "../components/generics/PageMetaInformation";
import LoadingOverlay from "../components/generics/Loading-Overlay";
import {useAuth} from "../../utility/AuthContext";
import {Button, Modal} from "react-bootstrap";


/**
 * This is the warband overview page,
 * - here, the saved warbands for this user are shown
 * - user can navigate to create a new Warband
 *
 * @constructor
 */
const WbbOverviewPage = (prop: any) => {
    const Manager : WarbandManager = prop.manager;
    const navigate = useNavigate();
    const { userId, isLoggedIn } = useAuth()

    const [allwarbands, setwarbands] = useState<SumWarband[]>([])
    const [keyvar, setkeyvar] = useState(0);
    const [isLoading, setisloading] = useState(false);

    useEffect(() => {
        async function SetWarbands() {
            setisloading(true)
            await Manager.GetItemsAll();
            setwarbands(Manager.CurWarbands());
            setkeyvar((prev) => prev + 1);
            setisloading(false)
        }

        SetWarbands();
    }, []);

    function updateSelf() {
        Manager.SetStorage();
        setkeyvar((prev) => prev + 1);
    }

    /**
     * Navigates to create new WB Screen
     */
    const handleCreateNew = () => {
        navigate('/warband/new');

    };

    const [showDropdown, setShowDropdown] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const toggleDropdown = () => setShowDropdown(!showDropdown);
    const closeDropdown = () => setShowDropdown(false);

    return (
        <div className={'WbbOverviewPage'}>
            <div className={'container'}>
                <div className={'headline-wrap'}>
                    <PageMetaInformation
                        title={'Your Warbands'}
                        description={'Manage your warbands in Trench Companion, the official resource for Trench Crusade.'}
                    />

                    <h1>{'Your Warbands'}</h1>


                    <div className="btn-group warband-actions-btn-group" role="group"
                         aria-label="Global warband actions">
                        <CustomNavLink
                            classes={'btn btn-primary btn-new-warband'}
                            runfunc={handleCreateNew}
                            link={'/warband/new'}
                        >
                            <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                            <span className={'new-warband-label'}>{'New Warband'}</span>
                        </CustomNavLink>

                        {/* @TODO: iclude to show import UI */}
                        {/*<div className="btn-group" role="group">*/}
                        {/*    <button*/}
                        {/*        type="button"*/}
                        {/*        className="btn btn-primary dropdown-toggle"*/}
                        {/*        onClick={toggleDropdown}*/}
                        {/*    >*/}
                        {/*    </button>*/}
                        {/*    {showDropdown && (*/}
                        {/*        <ul className="dropdown-menu dropdown-menu-end show" aria-labelledby="wbb-global-actions-group">*/}
                        {/*            <li className={'dropdown-item'} onClick={() => setShowImportModal(true)}>*/}
                        {/*                {'Import Warband'}*/}
                        {/*            </li>*/}
                        {/*        </ul>*/}
                        {/*    )}*/}
                        {/*</div>*/}
                    </div>
                </div>


                <div className={'row'} key={keyvar}>

                    {(!isLoading && !isLoggedIn) &&
                        <div className={'col-12 col-lg-6'}>
                            <div className={'login-alert'}>
                                <h3>
                                    {'You are not logged in'}
                                </h3>
                                <p>
                                    {'Log in or create an account in order to save your warbands permanently across devices.'}
                                </p>

                                <a href={'/login'} className={'btn btn-primary'}>
                                    <FontAwesomeIcon
                                        icon={faUser}
                                        className="icon-inline-left-l"/>
                                    {'Login'}
                                </a>
                            </div>
                        </div>
                    }


                    {isLoading ? (
                        <div className={'warbands-loading-wrap'}>
                            <LoadingOverlay
                                message={'Loading your warbands'}
                            />
                        </div>
                    ) : (
                        <>
                            {allwarbands.map(item => (
                                <WbbWarbandListItem key={item.warband_data.ID} item={item} manager={Manager}
                                                    parentfunc={updateSelf}/>
                            ))}
                        </>
                    )}


                    {!isLoading &&
                        <div className={'col-12 col-lg-6'}>
                            <CustomNavLink
                                runfunc={handleCreateNew}
                                link={'/warband/new'}
                                classes={'WbbWarbandListItem-new'}
                            >
                                <div className={'WbbWarbandListItem-new-inner'}>
                                    <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                                    {'New Warband'}
                                </div>
                            </CustomNavLink>
                        </div>
                    }
                </div>
            </div>

            {/** Upload / Import Warband file */}
            {/* @TODO: implement warband import here */}
            <Modal show={showImportModal} onHide={() => setShowImportModal(false)} centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{`Import Warband`}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={ () => setShowImportModal(false) }
                    />
                </Modal.Header>

                <Modal.Body>

                    <div className="mb-3">
                        <label htmlFor="import-file-select" className="form-label">
                            {'Select a file'}
                        </label>
                        <input
                            className="form-control"
                            type="file"
                            id="import-file-select"
                            onChange={() => alert('file selected')}
                        />
                    </div>

                    <div className="mb-3">
                        <button
                            onClick={() => alert('@TODO: Import functionality')}
                            className={'btn btn-primary'}

                        >
                            {'Import Warband'}
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default WbbOverviewPage;