export type RawGroupData = {
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
		},
		created : string,
		updated : string,
	},
	memberCount : number,
	isBuildersClubOnly : boolean,
	publicEntryAllowed : boolean,
	isLocked : boolean,
	hasVerifiedBadge : boolean,
}