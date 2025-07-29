import React, {useEffect, useState} from 'react'
import { Offcanvas } from 'react-bootstrap'
import SynodImage from "../../../utility/SynodImage";

import {ProfilePictureOption, SiteUser} from '../../../classes/user_synod/site_user';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faClose, faStar} from "@fortawesome/free-solid-svg-icons";
import LoadingOverlay from "../generics/Loading-Overlay";
import { SiteUserPublic } from '../../../classes/user_synod/user_public';
import {UserFactory} from "../../../factories/synod/UserFactory";
import ImageCredits from "../../../utility/ImageCredits";


interface ProfileChangeProfilePictureDrawerProps {
    show: boolean
    onClose: () => void
    userId: number
}

const ProfileChangeProfilePictureDrawer: React.FC<ProfileChangeProfilePictureDrawerProps> = ({ show, onClose, userId }) => {
    const [loading, setLoading] = React.useState(true)

    const [user, setUser] = useState<SiteUser | null>(null)
    const [options, setOptions] = useState<ProfilePictureOption[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchUserAndOptions = async () => {
            try {
                const siteUser = await UserFactory.CreatePrivateUserByID(userId)
                if (!siteUser) throw new Error('User not found')
                setUser(siteUser)

                const opts = await siteUser.getProfilePictureOptions()
                setOptions(opts)
            } catch (err: any) {
                setError('Could not load profile picture options.')
            } finally {
                setLoading(false)
            }
        }

        fetchUserAndOptions()
    }, [userId])

    const handleProfilePictureChange = async (newProfilePictureId: number) => {
        if (!user) return // userData is your SiteUser instance

        setLoading(true)

        try {
            await user.updateProfilePicture(newProfilePictureId)
        } catch (error) {
            console.error('Error updating profile picture:', error)
            alert('Failed to update profile picture.')
        } finally {
            setLoading(false)
            onClose()
        }
    }

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
                    {(loading || !user )? (
                        <LoadingOverlay
                            message={'Loading your settings'}
                        />
                    ) : (
                        <>
                            {options.map((opt) => (
                                <div
                                    key={opt.id}
                                    className={[
                                        'pfp-option',
                                        !opt.available && 'unavailable',
                                        opt.id === user.GetProfilePictureId() && 'current',
                                    ].filter(Boolean).join(' ')}

                                    onClick={opt.available ? () => handleProfilePictureChange(opt.id) : undefined}
                                >
                                    { (!opt.available && opt.id !== user.GetProfilePictureId() ) &&
                                        <>
                                            {opt.tier == 'premium' &&
                                                <FontAwesomeIcon icon={faStar} className={'premium-icon'} />
                                            }
                                        </>
                                    }

                                    { opt.id === user.GetProfilePictureId() &&
                                        <FontAwesomeIcon icon={faCheck}  className={'selected-icon'} />
                                    }
                                    <img src={opt.url} className={'sdv'+opt.source_title} />


                                    { (opt.source_title && opt.source_url) &&
                                        <ImageCredits
                                            sourceTitle={opt.source_title}
                                            sourceUrl={opt.source_url}
                                            popoverSlug={opt.url}
                                        />
                                    }

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