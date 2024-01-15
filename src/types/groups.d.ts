import { BaseCursor } from "./bases"

export type PartialGroup = {
	id: number,
	name: string,
	description: string,
	owner: {
		id: number,
		type: string // maybe can type this better
	},
	created: string,
	hasVerifiedBadge: boolean,
}

export type RoleGroups = {
	group: {
		id: number,
		name: string,
		memberCount: number,
		hasVerifiedBadge: boolean,
	},
	role: {
		id: number,
		name: string,
		rank: number,
	},
}

export type WallPosts = {
	data : {
		id : number,
		poster : {
			user : {
				buildersClubMembershipType : number,
				hasVerifiedBadge : boolean,
				userId : number,
				username : string,
				displayName : string,
			},
			role : {
				id : number,
				name : string,
				rank : number,
				description : string,
				memberCount : number,
			}
		},
		body : string,
		created : string,
		updated : string,
	}[]
} & BaseCursor

export type Group = {
	id : number,
	name : string,
	description : string,
	owner : {
		buildersClubMembershipType : number,
		hasVerifiedBadge : boolean,
		userId : number,
		username : string,
		displayName : string,
	},
	shout : {
		body : string,
		created : string,
		updated : string,
	},
	memberCount : number,
	isBuildersClubOnly : boolean,
	publicEntryAllowed : boolean,
	isLocked : boolean,
	hasverifiedBadge : boolean,
}


export type ActionTypes = "DeletePost" | "RemoveMember" | "AcceptJoinRequest" | "DeclineJoinRequest" | "PostStatus" | 'ChangeRank' | "BuyAd" | "SendAllyRequest" | 'CreateEnemy' | "AcceptAllyRequest" | "DeclineAllyRequest" | "DeleteAlly" | "DeleteEnemy" | "AddGroupPlace" | 'RemoveGroupPlace' | 'CreateItems' | 'ConfigureItems' | 'SpendGroupFunds' | 'ChangeOwner' | 'Delete' | 'AdjustCurrencyAmounts' | 'Abandon' | 'Claim' | 'Rename' | 'ChangeDescription' | 'InviteToClan' | 'KickFromClan' | 'CancelClanInvite' | 'BuyClan' | 'CreateGroupAsset' | 'UpdateGroupAsset' | 'ConfigureGroupAsset' | 'RevertGroupAsset' | 'CreateGroupDeveloperProduct' | 'ConfigureGroupGame' | 'CreateGroupDeveloperSubscriptionProduct' | 'Lock' | 'Unlock' | 'CreateGamePass' | 'CreateBadge' | 'ConfigureBadge' | 'SavePlace' | 'PublishPlace' | 'UpdateRolesetRank' | 'UpdateRolesetData'

export type AuditLogs = {
	data : {
		actor : {
			user : {
				buildersClubMembershipType : number,
				hasVerifiedBadge : boolean,
				userId : number,
				username : string,
				displayName : string,
			},
			role : {
				id : number,
				name : string,
				rank : number,
				description : string,
				memberCount : number,
			}
		},
		actionType : ActionTypes,
		description : string,
		created : string,
	}
}

export type GroupNameHistory = {
	data : {
		name : string,
		created : string,
	}[]
} & BaseCursor

export type GroupSettings = {
	isApprovalRequired : boolean,
	isBuildersClubRequired : boolean,
	areEnemiesAllowed : boolean,
	areGroupFundsVisible : boolean,
	areGroupGamesVisible : boolean,
	isGroupNameChangeEnabled : boolean,
}

export type GroupMetadata = {
	groupConfiguration : {
		nameMaxLength : number,
		descriptionMaxLength : number,
		iconMaxFileSize : number,
		cost : number,
		isUsingTwoStepWebviewComponent : boolean,
	},
	recurringPayoutsConfiguration : {
		maxPayoutPartners : boolean,
	},
	roleConfiguration : {
		nameMaxLength : number,
		descriptionMaxLength : number,
		limit : number,
		cost : number,
		minRank : number,
		maxRank : number,
	},
	groupNameChangeConfiguration : {
		cost : number,
		cooldownInDays : number,
		ownershipCooldownInDays : number,
	},
	isPremiumPayoutsEnabled : boolean,
	isDefaultEmblemPolicyEnabled : boolean,
}

export type SelfGroupMetadata = {
	groupLimit : number,
	currentGroupCount : number,
	groupStatusMaxLength : number,
	groupPostMaxLength : number,
	isGroupWallNotificationsEnabled : boolean,
	groupWallNotificationsSubscribeIntervalInMilliseconds : number,
	areProfileGroupsHidden : boolean,
	isGroupDetailsPolicyEnabled : boolean,
	showPreviousGroupNames : boolean,
}