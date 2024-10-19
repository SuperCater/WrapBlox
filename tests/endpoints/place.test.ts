import WrapBlox, { Place, Universe } from "../../src/index.js";

import dotenv from "dotenv";
dotenv.config();

const client = new WrapBlox();
const placeId = 24040136;
let preFetchedPlace: Place;
const silent = true;

test("login", async () => {
	if (!process.env.TESTCOOKIE) {
		console.log("No cookie provided, skipping...")
		return;
	}

	const user = await client.login(process.env.TESTCOOKIE)
	if (!silent) console.log(`Logged in as ${user.name}:${user.id}`)

	expect(user).toBeDefined();
});

test("fetchPlace", async () => {
    const placeById = await client.fetchPlace(placeId);

    preFetchedPlace = placeById;
    if (!silent) console.log(`Fetched place: ${placeById.toString()}`);

    expect(placeById).toBeDefined();
    expect(placeById).toMatchObject<Place>(placeById);
});

test("fetchServers", async () => {
    const servers = await preFetchedPlace.fetchServers();

    if (!silent) console.log(`Fetched [${servers.length}] servers:`, servers);

    expect(servers).toBeDefined();
    expect(servers).toBeInstanceOf(Array);
    expect(servers).toHaveLength(servers.length);
});

test("fetchUniverse", async () => {
    const universe = await preFetchedPlace.fetchUniverse();

    if (!silent) console.log(`Fetched universe: ${universe.toString()}`);

    expect(universe).toBeDefined();
    expect(universe).toMatchObject<Universe>(universe);
});