import WrapBlox, { BadgeImageFormat, BadgeImageSize, BadgeServiceMetadata, RawBadgeData } from "../index.js";

class Badge {
    readonly client: WrapBlox;
    readonly rawData: RawBadgeData;

    readonly id: number;
    readonly name: string;
	readonly displayName: string;

	readonly description: string;
	readonly displayDescription: string;

	readonly iconImageId: number;
	readonly displayIconImageId: number;

    readonly created: Date;
    readonly updated: Date;

    readonly statistics: {
		readonly pastDayAwardedCount: number,
		readonly awardedCount: number,
		readonly winRatePercentage: number
	};

	readonly awardingUniverse: {
		readonly id: number,
		readonly name: string,
		readonly rootPlaceId: number
	};

	readonly enabled: boolean;

    constructor(client: WrapBlox, rawData: RawBadgeData) {
        this.client = client;
        this.rawData = rawData;

        this.id = rawData.id;
        this.name = rawData.name;
        this.displayName = rawData.displayName;

        this.description = rawData.description;
        this.displayDescription = rawData.displayDescription;

        this.iconImageId = rawData.iconImageId;
        this.displayIconImageId = rawData.displayIconImageId;

        this.created = new Date(rawData.created);
        this.updated = new Date(rawData.updated);

        this.statistics = rawData.statistics;
        this.awardingUniverse = rawData.awardingUniverse;

        this.enabled = rawData.enabled
    };

    /*
		Methods related to the Badges API
		Docs: https://badges.roblox.com/docs/index.html
	*/

    async fetchServiceMetadata(useCache = true): Promise<BadgeServiceMetadata> {
        return await this.client.fetchHandler.fetch("GET", "Badges", "/metadata", { useCache: useCache })
    };

    /*
		Methods related to the Thumbnails API
		Docs: https://thumbnails.roblox.com/docs/index.html
	*/

    async fetchIcon(size: BadgeImageSize = BadgeImageSize["150x150"], format: BadgeImageFormat = "Png", isCircular = true, useCache = true): Promise<string> {
        return (await this.client.fetchHandler.fetch("GET", "Thumbnails", "/badges/icons", {
			useCache: useCache,
			params: {
				badgeIds: [this.id],
				size: size,
				format: format,
				isCircular: isCircular,
			}
		})).data[0].imageUrl;
    };

    // Miscellaneous

    toString(): string {
        return `${this.name}:${this.id}`
    };
};

export default Badge;