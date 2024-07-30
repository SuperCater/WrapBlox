import { APIGroupSettings, APIRoles, RawGroupData, RawMemberData } from "../Types/GroupTypes.js";
import WrapBlox, { SortOrder } from "../index.js";
import Member from "./Member.js";
import Role from "./Role.js";

class Group {
	rawdata: RawGroupData;

	name: string;
	description: string;
	id: number;
	client: WrapBlox;

	private cachedIcon?: string;



	constructor(client: WrapBlox, rawdata: RawGroupData) {
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

	async fetchMembers(): Promise<Member[]> {
		const ret = await this.client.fetchHandler.fetchAll('GET', 'Groups', `/groups/${this.id}/users`)
		return ret.map((member: RawMemberData) => {
			return new Member(this.client, this, member);
		});
	}

	async fetchIcon(format: "Png" | "Webp" = "Png", size: "150x150" | "420x420" = "150x150"): Promise<string | undefined> {
		const ret = await this.client.fetchHandler.fetch('GET', 'Thumbnails', "/groups/icons", {
			params: {
				groupIds: [this.id],
				format: format,
				size: size,
			}
		});

		const real = ret.data[0];
		if (!real) return undefined;
		return real.imageUrl;


	}

	async fetchSettings(): Promise<APIGroupSettings> {
		return await this.client.fetchHandler.fetch('GET', 'Groups', `/groups/${this.id}/settings`);
	}

	async fetchPayoutInfo() {
		const ret = await this.client.fetchHandler.fetch('GET', 'Groups', `/groups/${this.id}/payouts`);
		return ret.data;
	}

	async payoutUser(userId: number, amount: number) {
		return await this.client.fetchHandler.fetch('POST', 'Groups', `/groups/${this.id}/payouts`, {
			body: {
				PayoutType: 1,
				Recipients: [{
					recipientId: userId,
					recipientType: 1,
					amount: amount

				}]
			}
		});
	}

	async fetchRawRoles(): Promise<APIRoles[]> {
		const ret = await this.client.fetchHandler.fetch('GET', 'Groups', `/groups/${this.id}/roles`);
		return ret.roles;
	}

	async fetchRoles() {
		const ret = await this.fetchRawRoles();
		return ret.map((role: APIRoles) => {
			return new Role(this.client, this, role);
		});
	}

	async fetchRole(roleId: number): Promise<Role | undefined> {
		const roles = await this.fetchRoles();
		return roles.find((role) => role.id === roleId);
	}
	
	async fetchRoleByName(name: string): Promise<Role | undefined> {
		const roles = await this.fetchRoles();
		return roles.find((role) => role.name === name);
	}
	
	async fetchRoleByRank(rank: number): Promise<Role | undefined> {
		const roles = await this.fetchRoles();
		return roles.find((role) => role.rank === rank);
	
	}

	async fetchWallPosts(limit: 25 | 50 | 100 = 25, order: SortOrder = "Asc", cursor?: string) {
		const ret = await this.client.fetchHandler.fetch('GET', 'Groups', `/groups/${this.id}/wall/posts`, {
			params: {
				limit: limit,
				cursor: cursor,
				sortOrder: order
			}
		});
		return ret.data;
	}
	
	
	async setRoleByRank(userid : number, rank : number) {
		const role = await this.fetchRoleByRank(rank);
		if (!role) throw new Error('Role not found');
		
		return await this.client.fetchHandler.fetch('PATCH', 'Groups', `/groups/${this.id}/users/${userid}`, {
			body: {
				roleId: role.id,
			}
		});
	}
	
	async setRoleByName(userid : number, name : string) {
		const role = await this.fetchRoleByName(name);
		if (!role) throw new Error('Role not found');
		
		return await this.client.fetchHandler.fetch('PATCH', 'Groups', `/groups/${this.id}/users/${userid}`, {
			body: {
				roleId: role.id,
			}
		});
	}
	
	async setRoleById(userid : number, roleid : number) {
		return await this.client.fetchHandler.fetch('PATCH', 'Groups', `/groups/${this.id}/users/${userid}`, {
			body: {
				roleId: roleid,
			}
		});
	}
	
	async setShout(message : string) {
		return await this.client.fetchHandler.fetch('PATCH', 'Groups', `/groups/${this.id}/status`, {
			body: {
				message: message
			}
		});
	}









}

export default Group;