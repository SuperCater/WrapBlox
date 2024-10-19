import { UniverseAvatarType } from "./Enums.ts";

export type RawUniverseData = {
    id: number,
    rootPlaceId: number,

    name: string,
    description: string | null,

    sourceName: string,
    sourceDescription: string,

    creator: {
        id: number,
        name: string,
        type: UniverseCreatorType,
        isRNVAccount: boolean,
        hasVerifiedBadge: boolean
    },

    price: number | null,
    allowedGearGenres: string[]; //TODO: properly type this
    allowedGearCategories: string[]; //TODO: properly type this

    isGenreEnforced: boolean,
    copyingAllowed: boolean,

    playing: number,
    visits: number,
    maxPlayers: number,

    created: string,
    updated: string,

    studioAccessToApisAllowed: boolean,
    createVipServersAllowed: boolean,
    universeAvatarType: UniverseAvatarType,

    genre: string, //TODO: properly type this
    genre_l1: string,
    genre_l2: string,
    isAllGenre: boolean,

    isFavoritedByUser: boolean,
    favoritedCount: number,
    licenseDescription: string
}

export type UniverseCreatorType = "User" | "Group";