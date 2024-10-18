import WrapBlox, { BadgeAwarderType, BadgeCreatorType, RawAwardedBadgeData, User } from "../index.js";
import Badge from "./Badge.js";

class AwardedBadge extends Badge {
    readonly user: User;

    readonly creator: {
        readonly id: 0,
        readonly name: string,
        readonly type: BadgeCreatorType
    };
	readonly awarder: {
        readonly id: number,
        readonly type: BadgeAwarderType
    };

    constructor(client: WrapBlox, rawData: RawAwardedBadgeData, user: User) {
        super(client, rawData);

        this.user = user;
        this.creator = rawData.creator;
        this.awarder = rawData.awarder;
    };

    async fetchAwardedDate(useCache = true): Promise<Date | undefined> {
        const rawDate = (await this.client.fetchHandler.fetchEndpoint("GET", "Badges", `/users/${this.user.id}/badges/${this.id}/awarded-date`, { useCache: useCache }))?.awardedDate
        if (!rawDate) return undefined;

        return new Date(rawDate);
    };
};

export default AwardedBadge;