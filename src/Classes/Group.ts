import { RawGroupData } from "../Types/GroupTypes.js";

class Group {
	rawdata : RawGroupData;
	
	name : string;
	description : string;
	id : number;

	
	
	constructor(rawdata : RawGroupData) {
		this.rawdata = rawdata;
		this.name = rawdata.name;
		this.description = rawdata.description;
		this.id = rawdata.id;
	}
	
	public async fetchOwner() {
		
	}
}