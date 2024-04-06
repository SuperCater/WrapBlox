import { RawUserData } from "../Types/UserTypes.js";

class User {
	rawData : RawUserData;
	id : number;
	name : string;
	displayName : string;
	
	
	constructor(rawdata : RawUserData) {
		this.rawData = rawdata;
		this.id = rawdata.id;
		this.name = rawdata.name;
		this.displayName = rawdata.displayName;
	}
	
	IsBanned() {
		return this.rawData.isBanned;
	}
	
	GetUsernameHistory() {
	}
	
	
}

export default User;