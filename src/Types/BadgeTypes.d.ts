export type RawBadgeData = {
	id: number,

	name: string,
	displayName: string,

	description: string,
	displayDescription: string,

	iconImageId: number,
	displayIconImageId: number,

	created: string,
	updated: string,

	statistics: {
		pastDayAwardedCount: number,
		awardedCount: number,
		winRatePercentage: number
	},

	awardingUniverse: {
		id: number,
		name: string,
		rootPlaceId: number
	}

	enabled: boolean,
};

export type BadgeImageFormat = "Png" | "Webp";
export type BadgeCreatorType = "Place" | "Group";
export type BadgeAwarderType = "Place";

export type RawAwardedBadgeData = RawBadgeData & {
	creator: {
        id: 0,
        name: string,
        type: BadgeCreatorType
    },
	awarder: {
        id: number,
        type: BadgeAwarderType
    },
};

export type BadgeServiceMetadata = {
	badgeCreationPrice: number,
	maxBadgeNameLength: number,
	maxBadgeDescriptionLength: number
};

export type AwardedBadge = {
	badgeId : number,
	awardedDate : string,
};