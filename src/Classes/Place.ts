import type WrapBlox from "../index.js";
import {
    PlaceServer,
    ServerType,
    type RawPlaceData,
} from "../index.js";
import Universe from "./Universe.js";

export default class Place {
    readonly client: WrapBlox;
    readonly rawdata: RawPlaceData;

    readonly id: number;
    readonly name: string;
    readonly description: string;

    readonly sourceName: string;
    readonly sourceDescription: string;

    readonly url: string;
    readonly builder: string;
    readonly builderId: number;
    readonly hasVerifiedBadge: boolean;

    readonly isPlayable: boolean;
    readonly reasonProhibited: string;

    readonly universeId: number;
    readonly universeRootPlaceId: number;
    readonly price: number;

    readonly imageToken: string;

    constructor(client: WrapBlox, rawdata: RawPlaceData) {
        this.client = client;
        this.rawdata = rawdata;

        this.id = rawdata.placeId;
        this.name = rawdata.name;
        this.description = rawdata.description;

        this.sourceName = rawdata.sourceName;
        this.sourceDescription = rawdata.sourceDescription;

        this.url = rawdata.url;
        this.builder = rawdata.builder;
        this.builderId = rawdata.builderId;
        this.hasVerifiedBadge = rawdata.hasVerifiedBadge;

        this.isPlayable = rawdata.isPlayable;
        this.reasonProhibited = rawdata.reasonProhibited;

        this.universeId = rawdata.universeId;
        this.universeRootPlaceId = rawdata.universeRootPlaceId;
        this.price = rawdata.price;

        this.imageToken = rawdata.imageToken;
    };

	/*
		Methods related to the Games API
		Docs: https://games.roblox.com/docs/index.html
	*/

    async fetchServers(maxResults = 100, serverType: ServerType = ServerType.Public, useCache = true): Promise<PlaceServer[]> {
        return (await this.client.fetchHandler.fetchEndpointList("GET", "Games", `/games/${this.id}/servers/${serverType}`,
            { useCache: useCache, params: {} },
            { maxResults: maxResults, perPage: 100 }));
    };

    /**
     * Fetches the universe data associated with the current instance.
     *
     * @returns {Promise<Universe>} A promise that resolves to the universe data.
     */
    async fetchUniverse(): Promise<Universe> {
        return this.client.fetchUniverse(this.universeId);
    }

    /**
     * Returns a string representation of the Place object.
     * The format of the returned string is `${this.name}:${this.id}`.
     *
     * @returns {string} The formatted string
     */
    toString(): string {
        return `${this.name}:${this.id}`;
    }
};