import type WrapBlox from "../index.js";
import {
    type RawPlaceData,
} from "../index.js";

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

    async fetchUniverse() {
        return this.client.fetchUniverse(this.universeId);
    }

    toString(): string {
        return `${this.name}:${this.id}`;
    }
};