import type WrapBlox from "../index.js";
import { 
    type UniverseAvatarType,
    type RawUniverseData,
    type UniverseCreatorType,
    
    Place
} from "../index.js";

export default class Universe {
    readonly client: WrapBlox;
	readonly rawData: RawUniverseData;

    readonly id: number;
    readonly rootPlaceId: number;
    
    readonly name: string;
    readonly description: string;
    
    readonly sourceName: string;
    readonly sourceDescription: string;
    
    readonly creator: {
        readonly id: number;
        readonly name: string;
        readonly type: UniverseCreatorType;
        readonly isRNVAccount: boolean;
        readonly hasVerifiedBadge: boolean;
    };
    
    readonly price: number;
    readonly allowedGearGenres: string[];
    readonly allowedGearCategories: string[];
    
    readonly isGenreEnforced: boolean;
    readonly copyingAllowed: boolean;
    
    readonly playing: number;
    readonly visits: number;
    readonly maxPlayers: number;
    
    readonly created: Date;
    readonly updated: Date;
    
    readonly studioAccessToApisAllowed: boolean;
    readonly createVipServersAllowed: boolean;
    readonly universeAvatarType: UniverseAvatarType;
    
    readonly genre: string;
    readonly genre_l1: string;
    readonly genre_l2: string;
    readonly isAllGenre: boolean;
    
    readonly isFavoritedByUser: boolean;
    readonly favoritedCount: number;
    readonly licenseDescription: string;

    constructor(client: WrapBlox, rawData: RawUniverseData) {
        this.client = client;
        this.rawData = rawData;

        this.id = rawData.id;
        this.rootPlaceId = rawData.rootPlaceId;

        this.name = rawData.name;
        this.description = rawData.description || "";

        this.sourceName = rawData.sourceName;
        this.sourceDescription = rawData.sourceDescription;

        this.creator = rawData.creator;

        this.price = rawData.price || 0;
        this.allowedGearGenres = rawData.allowedGearGenres;
        this.allowedGearCategories = rawData.allowedGearCategories;

        this.isGenreEnforced = rawData.isGenreEnforced;
        this.copyingAllowed = rawData.copyingAllowed;

        this.playing = rawData.playing;
        this.visits = rawData.visits;
        this.maxPlayers = rawData.maxPlayers;

        this.created = new Date(rawData.created);
        this.updated = new Date(rawData.updated);

        this.studioAccessToApisAllowed = rawData.studioAccessToApisAllowed;
        this.createVipServersAllowed = rawData.createVipServersAllowed;
        this.universeAvatarType = rawData.universeAvatarType;

        this.genre = rawData.genre;
        this.genre_l1 = rawData.genre_l1;
        this.genre_l2 = rawData.genre_l2;
        this.isAllGenre = rawData.isAllGenre;

        this.isFavoritedByUser = rawData.isFavoritedByUser;
        this.favoritedCount = rawData.favoritedCount;
        this.licenseDescription = rawData.licenseDescription;
    };

    // Miscellanous

    /**
     * Fetches the root place associated with the universe.
     *
     * @returns {Promise<Place>} A promise that resolves to the root place.
     */
    async fetchRootPlace(): Promise<Place> {
        return await this.client.fetchPlace(this.rootPlaceId);
    };

    /**
     * Returns a string representation of the Universe instance.
     * The format of the returned string is `${this.name}:${this.id}`.
     *
     * @returns {string} The formatted string
     */
    toString(): string {
        return `${this.name}:${this.id}`;
    };
};