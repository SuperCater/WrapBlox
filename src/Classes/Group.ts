import FetchHandler from "../Modules/fetchHandler.js";
import { RawGroupData } from "../Types/GroupTypes.js";
import WrapBlox from "../index.js";
import User from "./User.js";

class Group {
	rawdata : RawGroupData;
	
	name : string;
	description : string;
	id : number;
	client : WrapBlox;

	
	
	constructor(client : WrapBlox, rawdata : RawGroupData) {
		this.client = client;
		this.rawdata = rawdata;
		this.name = rawdata.name;
		this.description = rawdata.description;
		this.id = rawdata.id;
	}
	
	async fetchOwner() {
		return await this.client.fetchUser(this.rawdata.owner.userId);
	}
	
	async fetchJoinRequests() {
		return await FetchHandler.fetchAll('GET', 'Groups', `/groups/${this.id}/join-requests`);
	}
	
	
	
	
}

export default Group;