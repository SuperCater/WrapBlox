import WrapBlox, { Place, Universe } from "../../src/index.js";

import dotenv from "dotenv";
dotenv.config();

const client = new WrapBlox();
const placeId = 24040136;
let preFetchedPlace: Place;
const silent = true;

const log = (message: unknown, ...optionalParams: unknown[]) => {
	if (silent) return;
	console.log(message, ...optionalParams);
};

beforeAll(async () => {
	if (!process.env.TESTCOOKIE) {
		console.log("No cookie provided, skipping...")
		return;
	}

	const user = await client.login(process.env.TESTCOOKIE)
	log(`Logged in as ${user.name}:${user.id}`)

	expect(user).toBeDefined();
});

test("fetchPlace", async () => {
    const placeById = await client.fetchPlace(placeId);

    preFetchedPlace = placeById;
    log(`Fetched place: ${placeById.toString()}`);

    expect(placeById).toBeDefined();
    expect(placeById).toMatchObject<Place>(placeById);
});

test("fetchServers", async () => {
    const servers = await preFetchedPlace.fetchServers();

    log(`Fetched [${servers.length}] servers:`, servers);

    expect(servers).toBeDefined();
    expect(servers).toBeInstanceOf(Array);
    expect(servers).toHaveLength(servers.length);
});

test("fetchUniverse", async () => {
    const universe = await preFetchedPlace.fetchUniverse();

    log(`Fetched universe: ${universe.toString()}`);

    expect(universe).toBeDefined();
    expect(universe).toMatchObject<Universe>(universe);
});