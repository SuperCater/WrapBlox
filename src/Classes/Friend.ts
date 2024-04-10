import WrapBlox, { RawFriendData } from "../index.js";
import User from "./User.js";

class Friend extends User {
	friendFrequentScore: number;
	isDeleted: boolean;
	isOnline: boolean;
	constructor(client : WrapBlox, rawdata : RawFriendData) {
		super(client, rawdata);
		this.friendFrequentScore = rawdata.friendFrequentScore;
		this.isOnline = rawdata.isOnline;
		this.isDeleted = rawdata.isDeleted;
	
		
	}
}

export default Friend;