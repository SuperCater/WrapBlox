import { RawMemberData } from "../Types/GroupTypes.js";
import WrapBlox from "../index.js";
import Group from "./Group.js";

export default class Member {
	rawdata : RawMemberData;
	client : WrapBlox;
	userId : number;
	group : Group;
	role : {
		id : number;
		name : string;
		rank : number;
	}
	name : string;
	
	
	constructor(client : WrapBlox, group : Group, rawdata : RawMemberData) {
		this.client = client;
		this.rawdata = rawdata;
		this.userId = rawdata.user.userId;
		this.name = rawdata.user.username;
		this.role = rawdata.role;
		this.group = group;
	};
	
	async fetchUser() {
		return await this.client.fetchUser(this.userId);
	}
}