import { RawUserData } from "../Types/UserTypes.js";

class User {
	rawData : RawUserData;
	id : number;
	name : string;
	displayName : string;
	description : string;
	
	
	constructor(rawdata : RawUserData) {
		this.rawData = rawdata;
		this.id = rawdata.id;
		this.name = rawdata.name;
		this.displayName = rawdata.displayName;
		this.description = rawdata.description;
	}
	
	
}

export default User;