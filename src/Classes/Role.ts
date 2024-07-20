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
	
	/**
	 * Fetches all members in the role
	 * @returns {Promise<Member[]>} Array of members in the role
	 */
	async fetchMembers(): Promise<Member[]> {
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
	
	/**
	 * Sets the rank number of the role
	 * @param rank The rank number to set the role to
	 * @returns this
	 */
	async setRank(rank: number) {
		const data = await this.client.fetchHandler.fetch('POST', 'Groups', `/groups/${this.group.id}/rolesets/${this.id}`, {
			rank: rank
		});
		this.rank = data.rank;
		return this;
	}
	
	/**
	 * Sets the name of the role
	 * @param name The name to set the role to
	 * @returns this
	 */
	async setName(name: string) {
		const data = await this.client.fetchHandler.fetch('POST', 'Groups', `/groups/${this.group.id}/rolesets/${this.id}`, {
			name: name
		});
		this.name = data.name;
		return this;
	}
	
	/**
	 * Sets the description of the role
	 * @param description The description to set the role to
	 * @returns this
	 */
	async setDescription(description: string) {
		const data = await this.client.fetchHandler.fetch('POST', 'Groups', `/groups/${this.group.id}/rolesets/${this.id}`, {
			description: description
		});
		this.rawdata.description = data.description;
		return this;
	}
	
	/**
	 * Deletes the role
	 */
	async delete() {
		await this.client.fetchHandler.fetch('DELETE', 'Groups', `/groups/${this.group.id}/rolesets/${this.id}`);
	}
	
	




}