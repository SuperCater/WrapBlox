import WrapBlox, { GroupActionType, GroupAuditLog, groupOwnerType, RawGroupData, SortOrder, User } from "../index.js";

class Group {
    readonly client: WrapBlox;
    readonly rawData: RawGroupData;

    readonly id: number;
    readonly name: string;
    readonly description: string;
    readonly owner: {
		readonly id: number,
		readonly type: groupOwnerType,
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

    async fetchAuditLog(maxResults = 100, sortOrder: SortOrder = "Asc", actionType?: GroupActionType, useCache = true): Promise<GroupAuditLog[]> {
        const returnData = [] as GroupAuditLog[];
        const rawData = await this.client.fetchHandler.fetchList("GET", "Groups", `/groups/${this.id}/audit-log`, { useCache: useCache, params: { sortOrder: sortOrder, actionType: actionType } }, maxResults);

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

    

    // Miscellaneous

    async fetchOwner(): Promise<User> {
        return await this.client.fetchUser(this.owner.id);
    };

    toString(): string {
        return `${this.name}:${this.id}`;
    };
}

export default Group;