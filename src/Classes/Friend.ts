import type WrapBlox from "../index.js";
import type { RawFriendData } from "../index.js";
import UserSession from "./UserSession.js";
import User from "./User.js";


export default class Friend extends User {
	friendFrequentScore: number;
	isDeleted: boolean;
	isOnline: boolean;
	/**
	 * The other user in the friendship
	 */
	friend : User | UserSession;
	
	
	constructor(client : WrapBlox, rawdata : RawFriendData, friend : User | UserSession) {
		super(client, rawdata);
		this.friendFrequentScore = rawdata.friendFrequentScore;
		this.isOnline = rawdata.isOnline;
		this.isDeleted = rawdata.isDeleted;
		this.friend = friend;
	
		
	}
};