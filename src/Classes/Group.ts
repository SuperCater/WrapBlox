import type WrapBlox from "../index.js";
import {
    type GroupActionType,
    type GroupAuditLog,
    type RawGroupData,

    GroupOwnerType,
    SortOrder,
} from "../index.js";
import Universe from "./Universe.js";
import User from "./User.js";

export default class Group {
    readonly client: WrapBlox;
    readonly rawData: RawGroupData;

    readonly id: number;
    readonly name: string;
    readonly description: string;
    readonly owner: {
		readonly id: number,
		readonly type: GroupOwnerType,
		readonly name: string
	};

	readonly memberCount: number;
	readonly created: Date;
	readonly hasVerifiedBadge: boolean;

    constructor(client: WrapBlox, rawData: RawGroupData) {
        this.client = client;
        this.rawData = rawData;

        this.id = rawData.id;
        this.name = rawData.name;
        this.description = rawData.description;
        this.owner = rawData.owner;

        this.memberCount = rawData.memberCount;
        this.created = new Date(rawData.created);
        this.hasVerifiedBadge = rawData.hasVerifiedBadge;
    };

    /*
		Methods related to the Groups API
		Docs: https://groups.roblox.com/docs/index.html
	*/

    /**
     * Fetches the audit log for the group.
     *
     * @param maxResults - The maximum number of results to return. Defaults to 100.
     * @param sortOrder - The order in which to sort the results. Defaults to "Asc".
     * @param actionType - The type of action to filter the audit log by. Optional.
     * @param useCache - Whether to use cached data. Defaults to true.
     * @returns A promise that resolves to an array of GroupAuditLog objects.
     */
    async fetchAuditLog(maxResults = 100, sortOrder: SortOrder = "Asc", actionType?: GroupActionType, useCache = true): Promise<GroupAuditLog[]> {
        const returnData = [] as GroupAuditLog[];
        const rawData = await this.client.fetchHandler.fetchLegacyAPIList("GET", "Groups", `/groups/${this.id}/audit-log`,
            { useCache: useCache, params: { sortOrder: sortOrder, actionType: actionType } },
            { maxResults: maxResults, perPage: 100 });

        for (const data of rawData) {
            returnData.push({
                actor: {
                    user: data.actor.user,
                    role: data.actor.role,
                },
                actionType: data.actionType,
                description: data.description,
                created: new Date(data.created),
            })
        };

        return returnData;
    }

    /*
        Methods related to the Thumbnails API
        Docs: https://thumbnails.roblox.com/docs/index.html
    */

    async fetchIcon(format: "Png" | "Webp" = "Png", size: "150x150" | "420x420" = "150x150"): Promise<string | undefined> {
        return (await this.client.fetchHandler.fetchLegacyAPI("GET", "Thumbnails", "/groups/icons", {
            params: {
				groupIds: [this.id],
				format: format,
				size: size,
			}
        })).data[0]?.imageUrl || undefined;
    };

    /*
        Methods related to the Games API
        Docs: https://games.roblox.com/docs/index.html
    */
   
    async fetchUniverses(maxResults = 100, accessFilter: "All" | "Public" | "Private" = "Public", sortOrder: SortOrder = "Asc", useCache = true): Promise<Universe[]> {
        const returnData = [] as Universe[];
        const rawData = await this.client.fetchHandler.fetchLegacyAPIList("GET", "GamesV2", `/groups/${this.id}/games`, {
            useCache: useCache,
            params: {
                accessFilter: accessFilter,
                sortOrder: sortOrder
            }
        }, { maxResults: maxResults, perPage: 50 });

        for (const data of rawData) {
            const universe = await this.client.fetchUniverse(data.id, useCache);
            returnData.push(universe);
        }

        return returnData;
    };

    // Miscellaneous

    /**
     * Fetches the owner of the group.
     *
     * @returns {Promise<User>} A promise that resolves to the User object representing the owner.
     */
    async fetchOwner(): Promise<User> {
        return await this.client.fetchUser(this.owner.id);
    };

    /**
     * Converts the Group object to a string representation.
     * The string in the format `${this.name}:${this.id}`.
     *
     * @returns {string} The formatted string.
     */
    toString(): string {
        return `${this.name}:${this.id}`;
    };
};