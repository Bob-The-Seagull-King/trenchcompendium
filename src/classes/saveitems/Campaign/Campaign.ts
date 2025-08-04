export class Campaign {
    id: string;
    name: string;
    players: any[];
    warbands: any[];
    created: Date;

    constructor(data?: Partial<Campaign>) {
        this.id = data?.id || '';
        this.name = data?.name || 'New Campaign';
        this.players = data?.players || [];
        this.warbands = data?.warbands || [];
        this.created = data?.created ? new Date(data.created) : new Date();
    }




    /**
     * Get Campaign Name
     */
    GetName () {
        return this.name;
    }

    /**
     * Returns the user ID of the Admin
     * @constructor
     */
    GetAdminID () {
        return 3;
    }

    /**
     * Is the user with this ID the admin of the campaign?
     *
     * @param ID
     */
    IsAdmin ( ID: number ) {
        if( ID === this.GetAdminID() ) {
            return true;
        }
        return false;
    }

    /**
     * Returns the global campaign notes as string
     */
    GetNotes () {
        return '';
    }

    /**
     * Return the campaign warbands
     * @TODO - this is dummy data
     */
    GetWarbands () {
        return [
            {
                warbandImageId: 1,
                warbandImageURL: 'https://synod.trench-companion.com/wp-content/uploads/2025/07/Black-Grail-Dirge-Faction-Image.jpg',
                playerName: 'Player 1 name',
                playerProfileUrl: 'lorem',
                playerId: 3,
                playerImageId: 2,
                playerImageURL: 'https://synod.trench-companion.com/wp-content/uploads/2025/07/Chorister-Profile-Picture.jpg',
                warbandRating: '699 Ducats | 2 Glory'
            },
            {
                warbandImageId: 1,
                warbandImageURL: 'https://synod.trench-companion.com/wp-content/uploads/2025/05/Court-of-the-seven-headed-serpent-Faction-Image-2.jpg',
                playerName: 'Player 2 name',
                playerProfileUrl: 'lorem',
                playerId: 3,
                playerImageId: 2,
                playerImageURL: 'https://synod.trench-companion.com/wp-content/uploads/2025/07/Yuzbasi-Captain-Profile-Picture-300x300.jpg',
                warbandRating: '680 Ducats | 0 Glory'
            }
        ]

    }

    /**
     * Get Campaign players info
     * @TODO - this is dummy data
     *
     */
    GetPlayers () {
        return [
            {
                playerName: 'Player 1 name',
                playerProfileUrl: 'lorem',
                playerId: 3,
                playerImageId: 2828,
                playerStatus: 'Free Member',
                playerImageURL: 'https://synod.trench-companion.com/wp-content/uploads/2025/07/Chorister-Profile-Picture.jpg',
            },
            {
                playerName: 'Player 2 name',
                playerProfileUrl: 'lorem',
                playerId: 3,
                playerImageId: 2818,
                playerStatus: 'Supporter',
                playerImageURL: 'https://synod.trench-companion.com/wp-content/uploads/2025/07/Yuzbasi-Captain-Profile-Picture-300x300.jpg',
            }
        ]
    }
}
