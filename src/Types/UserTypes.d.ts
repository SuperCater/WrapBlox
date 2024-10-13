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
};

export type RawUserGroupRoles = {
	group: {
		id: number,
		name: string,
		memberCount: number,
		hasVerifiedBadge: boolean
	},
	role: Role,
	isNotificationsEnabled: boolean
};

export type FriendServiceMetadata = {
	isFriendsFilterBarEnabled: boolean,
	isFriendsPageSortExperimentEnabled: boolean,
	isFriendsUserDataStoreCacheEnabled: boolean,
	frequentFriendSortRollout: number,
	userName: string,
	displayName: string,
};

export type RawFriendData = RawUserData & {
	isOnline : boolean,
	isDeleted : boolean,
	friendFrequentScore : number,
	friendFrequentRank : number,
};

export type RawFriendRequest = RawUserData & {
	friendRequest : {
		sentAt : string,
		senderId : number,
		sourceUniverseId : number,
		originSourceType : number,
		contactName : string,
	},
	mutualFriendsList : string[],
};

export type BirthData = {
	birthMonth : number,
	birthDay : number,
	birthYear : number,
};

export type AvatarImageFormat = "Png" | "Jpeg" | "Webp";
export type AvatarBustImageFormat = "Png" | "Webp";
export type AvatarType = "R6" | "R15";
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
 | "ClimbAnimation";

export type Avatar3D = {
	camera: {
		position: {
		  x: number;
		  y: number;
		  z: number;
		};
		direction: {
		  x: number;
		  y: number;
		  z: number;
		};
		fov: number;
	  };
	  aabb: {
		min: {
		  x: number;
		  y: number;
		  z: number;
		};
		max: {
		  x: number;
		  y: number;
		  z: number;
		};
	  };
	  mtl: string;
	  obj: string;
	  textures: string[];
};

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
};

export type AvatarEmote = {
	assetId: number,
	assetName: string,
	position: number
};

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
};

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
};