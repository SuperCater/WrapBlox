export type RawPlaceData = {
    placeId: number,
    name: string,
    description: string,
    sourceName: string,
    sourceDescription: string,
    url: string,
    builder: string,
    builderId: number,
    hasVerifiedBadge: boolean,
    isPlayable: boolean,
    reasonProhibited: string,
    universeId: number,
    universeRootPlaceId: number,
    price: number,
    imageToken: string,
};

export type PlaceServer = {
    id: number,
    maxPlayers: number,
    playing: number,
    playerTokens: string[],
    players: {
        playerToken: string,
        id: number,
        name: string,
        displayName: string,
    }[],

    fps: number,
    ping: number,

    name: string,
    vipServerId: number,
    accessCode: string,
    owner: {
        hasVerifiedBadge: boolean,
        id: number,
        name: string,
        displayName: string,
    },
};