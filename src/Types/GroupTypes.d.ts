export type RawShout = {
	body : string,
	poster : {
		buildersClubMembershipType : number,
		hasVerifiedBadge : boolean,
		userId : number,
		username : string,
		displayName : string,
	},
	created : string,
	updated : string,
}

export type RawGroupData = {
	id : number,
	name : string,
	description : string,
	owner : {
		buildersClubMembershipType? : number,
		hasVerifiedBadge : boolean,
		userId : number,
		username : string,
		displayName : string,
	},
	shout : RawShout,
	memberCount : number,
	isBuildersClubOnly : boolean,
	publicEntryAllowed : boolean,
	isLocked : boolean,
	hasVerifiedBadge : boolean,
}

export type APIGroupLookup = {
	id : number,
	name : string,
	memberCount : number,
	hasVerifiedBadge : boolean,
}

export type RawMemberData = {
	user : {
		hasVerifiedBadge : boolean,
		userId : number,
		username : string,
		displayName : string,
	},
	role : {
		name : string,
		rank : number,
		id : number,
	},
}

export type APIGroupSettings = {
	isApprovalRequired : boolean,
	areEnemiesAllowed : boolean,
	areGroupFundsVisible : boolean,
	areGroupGamesVisible : boolean,
	isGroupNameChangeEnabled : boolean,
	isBuildersClubRequired : boolean,
}

export type APIPayoutInfo = {
	user : {
        buildersClubMembershipType: number,
        hasVerifiedBadge: boolean,
        userId: number,
        username: string,
        displayName: string,
	}
	percentage : number,
}

export type APIMemberRole = {
	name : string,
	rank : number,
	id : number,
}

export type APIRoles = {
	id : number,
	name : string,
	description : string,
	rank : number,
	memberCount : number,
}