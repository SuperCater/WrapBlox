import WrapBlox, { Universe } from "../../src/index.js";

import dotenv from "dotenv";
dotenv.config();

const client = new WrapBlox();
const universeId = 7065948;
let preFetchedUniverse: Universe;
const silent = true;

const log = (message: unknown, ...optionalParams: unknown[]) => {
	if (silent) return;
	console.log(message, ...optionalParams);
};

test("login", async () => {
	if (!process.env.TESTCOOKIE) {
		console.log("No cookie provided, skipping...")
		return;
	}

	const user = await client.login(process.env.TESTCOOKIE)
	log(`Logged in as ${user.name}:${user.id}`)

	expect(user).toBeDefined();
});

test("fetchUniverse", async () => {
    const universeById = await client.fetchUniverse(universeId);

    preFetchedUniverse = universeById;
    log(`Fetched universe: ${universeById.toString()}`);

    expect(universeById).toBeDefined();
});

test("fetchRootPlace", async () => {
    const rootPlace = await preFetchedUniverse.fetchRootPlace();

    log(`Fetched root place: ${rootPlace.toString()}`);
    expect(rootPlace).toBeDefined();
});