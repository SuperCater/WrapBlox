import type WrapBlox from "../index.js";
import type { BirthData, RawUserData } from "../Types/UserTypes.js";
import User from "./User.js";

export default class AuthedUser extends User {
	private cookie: string;

	constructor(client: WrapBlox, data: RawUserData, cookie: string) {
		super(client, data);
		this.cookie = cookie;
	}

	async fetchBirthdate() {
		return await this.client.fetchHandler.fetchLegacyAPI(
			"GET",
			"Users",
			`/users/${this.id}/birthdate`,
			{ cookie: this.cookie },
		);
	}

	async setBirthdate(date: BirthData & { password: string }): Promise<void> {
		return await this.client.fetchHandler.fetchLegacyAPI(
			"POST",
			"Users",
			`/users/${this.id}/birthdate`,
			{ cookie: this.cookie, body: date },
		);
	}

	async setDescription(description: string): Promise<void> {
		return await this.client.fetchHandler.fetchLegacyAPI(
			"POST",
			"Users",
			`/users/${this.id}/description`,
			{ cookie: this.cookie, body: { description } },
		);
	}

	async fetchCountryCode(): Promise<string> {
		return (
			await this.client.fetchHandler.fetchLegacyAPI(
				"GET",
				"Users",
				`/users/${this.id}/country`,
				{ cookie: this.cookie },
			)
		).countryCode;
	}
}
