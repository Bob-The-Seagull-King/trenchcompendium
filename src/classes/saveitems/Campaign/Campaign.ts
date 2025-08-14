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
     * Returns the ID of the Campaign
     *
     */
    GetID () {
        return this.id;
    }

    /**
     * Get Campaign Name
     */
    GetName () {
        return this.name;
    }

    /**
     * Returns the user ID of the Admin
     * @TODO
     */
    GetAdminID () {
        return 3;
    }

    /**
     * Returns the username of the admin
     * @TODO
     */
    GetAdminUserName () {
        return 'Emitoo'
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
    GetDescription () {
        return "This is a test campaign created for demonstration purposes.\n" +
            "Feel free to explore all features without consequences.\n" +
            "Data will not be saved permanently.";
    }

    /**
     * Return the campaign warbands
     * @TODO - this is dummy data
     */
    GetWarbands () {
        return [
            {
                warbandName: 'Serpentis Voluptia',
                warbandImageId: 2905,
                warbandId: 3,
                warbandImageURL: 'https://synod.trench-companion.com/wp-content/uploads/2025/07/Black-Grail-Dirge-Faction-Image.jpg',
                playerName: 'Player 1 name',
                playerProfileUrl: 'lorem',
                playerId: 3,
                playerImageId: 2828,
                playerImageURL: 'https://synod.trench-companion.com/wp-content/uploads/2025/07/Chorister-Profile-Picture.jpg',
                warbandRating: '699 Ducats | 2 Glory',
                warbandRound: 2
            },
            {
                warbandName: 'The knights of the holy father and son',
                warbandImageId: 2877,
                warbandId: 3,
                warbandImageURL: 'https://synod.trench-companion.com/wp-content/uploads/2025/05/Court-of-the-seven-headed-serpent-Faction-Image-2.jpg',
                playerName: 'Player 2 name',
                playerProfileUrl: 'lorem',
                playerId: 3,
                playerImageId: 2818,
                playerImageURL: 'https://synod.trench-companion.com/wp-content/uploads/2025/07/Yuzbasi-Captain-Profile-Picture-300x300.jpg',
                warbandRating: '680 Ducats | 0 Glory',
                warbandRound: 3
            }
        ]
    }

    /**
     * This returns a dummy game
     * @TODO
     */
    GetDummyGame () {
        return {
            warbands: this.GetWarbands(),
            date: '04.07.2025'
        };
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

    /**
     * This should create an announcement for this campaign at the current timestamp
     * @TODO: add functionality
     */
    public CreateAnnouncement ( announcement: string ) {
        // @TODO: create announcement here

        return;
    }

    /**
     * Returns the most recent announcement for this campaign with date
     * @TODO:
     */
    public GetLatestAnnouncement () {

        return ({
            date: '17.05.2025',
            title: 'Welcome',
            text: "Welcome to the new campaign!\n" +
                "Here are the initial rules:\n" +
                "- No cheating\n" +
                "- Report all bugs\n" +
                "- Have fun!\n" +
                "Let the games begin!"
        });
    }

    /**
     * Invita players to a campaign
     *
     * @TODO
     */
    public InvitePlayers(playerIDs: string[]) {
        alert(playerIDs.join(', '));
        // @TODO
        return;
    }
}
