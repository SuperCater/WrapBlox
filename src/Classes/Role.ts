import { APIRoles } from "../Types/GroupTypes.js";
import WrapBlox, { Group, Member } from "../index.js";

export default class Role {
	id: number;
	name: string;
	memberCount: number;
	rank: number;
	rawdata: APIRoles;
	client: WrapBlox;
	group: Group;

	constructor(client: WrapBlox, group: Group, data: APIRoles) {
		this.id = data.id;
		this.name = data.name;
		this.client = client;
		this.group = group;
		this.rawdata = data;
		this.memberCount = data.memberCount;
		this.rank = data.rank;
	}

	async fetchMembers() {
		const ret = await this.client.fetchHandler.fetchAll('GET', 'Groups', `/groups/${this.group.id}/roles/${this.id}/users`);
		return ret.map((member) => {
			const newData = {
				user: member,
				role: {
					id: this.id,
					name: this.name,
					rank: this.rank,
				}
			}

			return new Member(this.client, this.group, newData);
		});

	}
	
	async setRank(rank: number) {
		const data = await this.client.fetchHandler.fetch('POST', 'Groups', `/groups/${this.group.id}/rolesets/${this.id}`, {
			rank: rank
		});
		this.rank = data.rank;
		return this;
	}
	
	async setName(name: string) {
		const data = await this.client.fetchHandler.fetch('POST', 'Groups', `/groups/${this.group.id}/rolesets/${this.id}`, {
			name: name
		});
		this.name = data.name;
		return this;
	}
	
	async setDescription(description: string) {
		const data = await this.client.fetchHandler.fetch('POST', 'Groups', `/groups/${this.group.id}/rolesets/${this.id}`, {
			description: description
		});
		this.rawdata.description = data.description;
		return this;
	}
	
	async delete() {
		await this.client.fetchHandler.fetch('DELETE', 'Groups', `/groups/${this.group.id}/rolesets/${this.id}`);
		return this;
	}
	
	




}