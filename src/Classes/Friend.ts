import type WrapBlox from "../index.js";
import type { RawFriendData } from "../index.js";
import AuthedUser from "./AuthedUser.js";
import User from "./User.js";


export default class Friend extends User {
	friendFrequentScore: number;
	isDeleted: boolean;
	isOnline: boolean;
	/**
	 * The other user in the friendship
	 */
	friend : User | AuthedUser;
	
	
	constructor(client : WrapBlox, rawdata : RawFriendData, friend : User | AuthedUser) {
		super(client, rawdata);
		this.friendFrequentScore = rawdata.friendFrequentScore;
		this.isOnline = rawdata.isOnline;
		this.isDeleted = rawdata.isDeleted;
		this.friend = friend;
	
		
	}
};