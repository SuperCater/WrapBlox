import type { APIUserGroup } from "../Types/UserTypes.js";
import type WrapBlox from "../index.js";
import type { APIRoles, Group, Role } from "../index.js";

class UserRoleManager {
	rawdata : APIUserGroup[];
	client : WrapBlox;
	constructor(client : WrapBlox, data : APIUserGroup[]) {
		this.rawdata = data;
		this.client = client;
	}
	
	async fetchGroups() : Promise<Group[]> {
		return await Promise.all(this.rawdata.map(async (group) => {
			return await this.client.fetchGroup(group.group.id);
		}));
	}
	
	isInGroup(groupId : number) : boolean {
		return this.rawdata.some((group) => group.group.id === groupId);
	}
	
	async getGroup(groupId : number) : Promise<Group | undefined> {
		const group = this.rawdata.find((group) => group.group.id === groupId);
		if (!group) return undefined;
		return await this.client.fetchGroup(group.group.id);
	}
	
	getRawRole(groupId : number) : APIRoles | undefined{
		const group = this.rawdata.find((group) => group.group.id === groupId);
		if (!group) return undefined;
		return group.role
	}
	
	async getRole(groupId : number) : Promise<Role | undefined> {
		const group = this.rawdata.find((group) => group.group.id === groupId);
		if (!group) return undefined;
		const realGroup = await this.getGroup(group.group.id);
		if (!realGroup) return undefined;
		
		return realGroup.fetchRole(group.role.id);
	}
	
	
	
	
	
}

export default UserRoleManager;