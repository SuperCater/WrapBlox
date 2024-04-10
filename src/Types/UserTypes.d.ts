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
} & RawUserData

export type BirthData = {
	birthMonth : number,
	birthDay : number,
	birthYear : number,
}