import type WrapBlox from "../index.js";
import {
	type BadgeServiceMetadata,
	type RawBadgeData,
	BadgeImageFormat,
	BadgeImageSize,
} from "../index.js";

export default class Badge {
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
		readonly pastDayAwardedCount: number;
		readonly awardedCount: number;
		readonly winRatePercentage: number;
	};

	readonly awardingUniverse: {
		readonly id: number;
		readonly name: string;
		readonly rootPlaceId: number;
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

		this.enabled = rawData.enabled;
	}

	/*
		Methods related to the Badges API
		Docs: https://badges.roblox.com/docs/index.html
	*/

	/**
	 * Fetches the service metadata for badges.
	 *
	 * @param useCache - A boolean indicating whether to use cached data. Defaults to true.
	 * @returns A promise that resolves to the badge service metadata.
	 */
	async fetchServiceMetadata(useCache = true): Promise<BadgeServiceMetadata> {
		return await this.client.fetchHandler.fetchLegacyAPI(
			"GET",
			"Badges",
			"/metadata",
			{ useCache: useCache },
		);
	}

	/*
		Methods related to the Thumbnails API
		Docs: https://thumbnails.roblox.com/docs/index.html
	*/

	/**
	 * Fetches the icon for the badge.
	 *
	 * @param {BadgeImageSize} [size=BadgeImageSize["150x150"]] - The size of the badge image.
	 * @param {BadgeImageFormat} [format="Png"] - The format of the badge image.
	 * @param {boolean} [isCircular=false] - Whether the badge image should be circular.
	 * @param {boolean} [useCache=true] - Whether to use the cache for the request.
	 * @returns {Promise<string>} - A promise that resolves to the URL of the badge image.
	 */
	async fetchIcon(
		size: BadgeImageSize = BadgeImageSize["150x150"],
		format: BadgeImageFormat = "Png",
		isCircular = false,
		useCache = true,
	): Promise<string> {
		return (
			await this.client.fetchHandler.fetchLegacyAPI(
				"GET",
				"Thumbnails",
				"/badges/icons",
				{
					useCache: useCache,
					params: {
						badgeIds: [this.id],
						size: size,
						format: format,
						isCircular: isCircular,
					},
				},
			)
		).data[0].imageUrl;
	}

	// Miscellaneous

	/**
	 * Converts the Badge instance to a string representation.
	 *
	 * @returns {string} A string in the format `${this.name}:${this.id}`.
	 */
	toString(): string {
		return `${this.name}:${this.id}`;
	}
}
