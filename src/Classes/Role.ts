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
			console.log(member)
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




}