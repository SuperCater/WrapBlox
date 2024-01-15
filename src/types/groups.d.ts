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
		poster : {
			buildersClubMembershipType : number,
			hasVerifiedBadge : boolean,
			userId : number,
			username : string,
			displayName : string,
		}
		created : string,
		updated : string,
	},
	memberCount : number,
	isBuildersClubOnly : boolean,
	publicEntryAllowed : boolean,
	isLocked : boolean,
	hasverifiedBadge : boolean,
}

export type FriendGroup = {
	user : {
		buildersClubMembershipType : number,
		hasVerifiedBadge : boolean,
		userId : number,
		username : string,
		displayName : string,
	},
	groups : {
		group : Group,
		role : {
			id : number,
			name : string,
			rank : number,
			description : string,
			memberCount : number,
		},
		isPrimaryGroup : boolean,
	}[]
}

export type GroupRoles = {
	group : Group,
	role : {
		id : number,
		name : string,
		rank : number,
		memberCount : number,
	},
	isPrimaryGroup : boolean,
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

export type JoinRequests = {
	data : JoinRequest[]
} & BaseCursor


export type JoinRequest = {
	requester : {
		buildersClubMembershipType : number,
		hasVerifiedBadge : boolean,
		userId : number,
		username : string,
		displayName : string,
	},
	created : string
}

export type SelfMembership = {
	groupId : number,
	isPrimary : boolean,
	isPendingJoin : boolean,
	userRole : {
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
	permissions : {
		groupPostsPermissions : {
			viewWall : boolean,
			postToWall : boolean,
			deleteFromWall : boolean,
			viewStatus : boolean,
			postToStatus : boolean,
		},
		groupMembershipPermissions : {
			changeRank : boolean,
			inviteMembers : boolean,
			removeMembers : boolean,
		},
		groupManagementPermissions : {
			manageRelationships : boolean,
			manageClan : boolean,
			viewAuditLogs : boolean,
		},
		groupEconomyPermissions : {
			spendGroupFunds : boolean,
			advertiseGroup : boolean,
			createItems : boolean,
			manageItems : boolean,
			addGroupPlaces : boolean,
			manageGroupGames : boolean,
			viewGroupPayouts : boolean,
			viewAnalytics : boolean,
		},
		groupOpenCloudPermissions : {
			useCloudAuthentication : boolean,
			administerCloudAuthentication : boolean,
		}
	},
	areGroupGamesVisible : boolean,
	areGroupFundsVisible : boolean,
	areEnemiesAllowed : boolean,
	canConfigure : boolean,
}

export type GroupRole = {
	id : number,
	name : string,
	rank : number,
	memberCount : number,
}

export type GroupRoleMembers = {
	data : {
		buildersClubMembershipType : number,
		hasVerifiedBadge : boolean,
		userId : number,
		username : string,
		displayName : string,
	}[]
} & BaseCursor

export type GroupMembers = {
	data : {
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
	}[]
} & BaseCursor

export type PayoutPercentages = {
	user : {
		buildersClubMembershipType : number,
		hasVerifiedBadge : boolean,
		userId : number,
		username : string,
		displayName : string,
	},
	percentage : number,
}

export type Role = {
	groupId : number,
	id : number,
	name : string,
	description : string,
	rank : number,
	memberCount : number,
}