import React from 'react'
import { Offcanvas } from 'react-bootstrap'
import SynodImage from "../../../utility/SynodImage";

import {ProfilePictureOption, SiteUser} from '../../../classes/user_synod/site_user';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClose, faStar} from "@fortawesome/free-solid-svg-icons";


interface ProfileChangeProfilePictureDrawerProps {
    show: boolean
    onClose: () => void
    userData: SiteUser
}

const ProfileChangeProfilePictureDrawer: React.FC<ProfileChangeProfilePictureDrawerProps> = ({ show, onClose, userData }) => {
    const [options, setOptions] = React.useState<ProfilePictureOption[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        if (show) {
            userData.getProfilePictureOptions()
                .then(setOptions)
                .catch((err) => console.error(err))
                .finally(() => setLoading(false))
        }
    }, [show, userData])
    console.log('options');
    console.log(options);

    return (
        <Offcanvas
            show={show}
            onHide={onClose}
            placement="bottom"
            className="ProfileChangeProfilePictureDrawer"
        >
            <Offcanvas.Header >
                <Offcanvas.Title>
                    {'Change Profile Picture'}
                    <div className="offcanvas-close" onClick={onClose}>
                        <FontAwesomeIcon icon={faClose} className=""/>
                    </div>
                </Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>
                <div className={'pfp-selection'}>
                    {loading ? (
                        // @TODO: add loading spinner
                        <p>Loading...</p>
                    ) : (
                        // @TODO: mark current
                        // @TODO: do selection
                        <>
                            {options.map((opt) => (
                                <div
                                    key={opt.id}
                                    className={`pfp-option${!opt.available ? ' unavailable' : ''}`}
                                >
                                    { (!opt.available) &&
                                        <>
                                            {opt.tier == 'premium' &&
                                                <FontAwesomeIcon icon={faStar} />
                                            }
                                        </>
                                    }
                                    <img src={opt.url}  />
                                </div>
                            ))}
                        </>
                    )}
                </div>


            </Offcanvas.Body>
        </Offcanvas>
    )
}

export default ProfileChangeProfilePictureDrawer