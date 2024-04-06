import { RawGroupData, RawMemberData } from "../Types/GroupTypes.js";
import WrapBlox from "../index.js";
import Member from "./Member.js";

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
		return await this.client.fetchHandler.fetchAll('GET', 'Groups', `/groups/${this.id}/join-requests`);
	}
	
	async fetchMembers() : Promise<Member[]> {
		const ret = await this.client.fetchHandler.fetchAll('GET', 'Groups', `/groups/${this.id}/users`)
		return ret.map((member : RawMemberData) => {
			return new Member(this.client, this, member);
		});
	}
	
	
	
	
	
	
	
	
}

export default Group;