import { IntRange } from "./BaseTypes.js";
import type { Role } from "./GroupTypes.js";

export type RawUserData = {
	name : string,
	displayName : string,
	id : number,
	hasVerifiedBadge : boolean,
	externalAppDisplayName? : string,
	isBanned : boolean,
	created : string,
	description : string,
}

export type RawUserGroupRoles = {
	group: {
		id: number,
		name: string,
		memberCount: number,
		hasVerifiedBadge: boolean
	},
	role: Role,
	isNotificationsEnabled: boolean
}

export type FriendServiceMetadata = {
	isFriendsFilterBarEnabled: boolean,
	isFriendsPageSortExperimentEnabled: boolean,
	isFriendsUserDataStoreCacheEnabled: boolean,
	frequentFriendSortRollout: number,
	userName: string,
	displayName: string,
}

export type RawFriendData = {
	isOnline : boolean,
	isDeleted : boolean,
	friendFrequentScore : number,
	friendFrequentRank : number,
} & RawUserData;


export type RawFriendRequest = {
	friendRequest : {
		sentAt : string,
		senderId : number,
		sourceUniverseId : number,
		originSourceType : number,
		contactName : string,
	},
	mutualFriendsList : string[],
} & RawUserData;

export type BirthData = {
	birthMonth : number,
	birthDay : number,
	birthYear : number,
}

export type AvatarImageType = "Png" | "Jpeg" | "WebP";
export type AvatarType = "R6" | "R15"
export type AvatarAssetType =
 | "Gear"

 | "Pants"
 | "Shirt"
 | "TShirt"

 | "LeftShoeAccessory"
 | "RightShoeAccessory"
 | "ShirtAccessory"
 | "PantsAccessory"
 | "TShirtAccessory"
 | "SweaterAccessory"
 | "JacketAccessory"
 | "ShortsAccessory"
 | "DressSkirtAccessory"

 | "Hat"
 | "WaistAccessory"
 | "NeckAccessory"
 | "ShoulderAccessory"
 | "FrontAccessory"
 | "BackAccessory"
 | "FaceAccessory"
 | "HairAccessory"

 | "RunAnimation"
 | "WalkAnimation"
 | "FallAnimation"
 | "JumpAnimation"
 | "IdleAnimation"
 | "SwimAnimation"
 | "ClimbAnimation"

 export type AvatarAsset = {
	id: number,
	name: string,
	assetType: {
		id: number,
		name: AvatarAssetType
	},
	currentVersionId: number,
	meta?: {
		order?: number,
		puffiness?: number,
		position?: {
			X: number,
			Y: number,
			Z: number,
		},
		rotation?: {
			X: number,
			Y: number,
			Z: number,
		},
		scale?: {
			X: number,
			Y: number,
			Z: number,
		},
		version?: number,
	}
 }

 export type AvatarEmote = {
	assetId: number,
	assetName: string,
	position: number
 }

 export type UserAvatarV1 = {
	scales: {
		height: number,
		width: number,
		head: number,
		depth: number,
		proportion: number,
		bodyType: number,
	},
	playerAvatarType: AvatarType,
	bodyColors: {
		headColorId: number,
		torsoColorId: number,
		rightArmColorId: number,
		leftArmColorId: number,
		rightLegColorId: number,
		leftLegColorId: number,
	},
	assets: AvatarAsset[],
	defaultShirtApplied: boolean,
	defaultPantsApplied: boolean,
	emotes: AvatarEmote[],
 }

 export type UserAvatarV2 = {
	scales: {
		height: number,
		width: number,
		head: number,
		depth: number,
		proportion: number,
		bodyType: number,
	},
	playerAvatarType: AvatarType,
	bodyColor3s: {
		headColor3: string,
    	torsoColor3: string,
    	rightArmColor3: string,
    	leftArmColor3: string,
    	rightLegColor3: string,
    	leftLegColor3: string
	},
	assets: AvatarAsset[],
	defaultShirtApplied: boolean,
	defaultPantsApplied: boolean,
	emotes: AvatarEmote[],
 }