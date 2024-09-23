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
	displayName : string;
	
	
	constructor(client : WrapBlox, group : Group, rawdata : RawMemberData) {
		this.client = client;
		this.rawdata = rawdata;
		this.userId = rawdata.user.userId;
		this.name = rawdata.user.username;
		this.displayName = rawdata.user.displayName;
		this.role = rawdata.role;
		this.group = group;
	};
	
	async fetchUser() {
		return await this.client.fetchUser(this.userId);
	}
	
	/**
	 * @returns {string} The member's name - If the member has a display name which is not the same as their username, it will return "{DisplayName} (@{Username}), otherwise it will return the username
	 */
	toString(): string {
		if (this.name === this.displayName) return this.name;
		return `${this.displayName} (@${this.name})`;
	}
}