import FetchError from "../../src/Classes/Internal/FetchError.js";
import WrapBlox, { Group, Universe } from "../../src/index.js";
import dotenv from "dotenv";
dotenv.config();

const client = new WrapBlox();
const groupId = 33991282;
let preFetchedGroup: Group;
const silent = false;

test("login", async () => {
	if (!process.env.TESTCOOKIE) {
		console.log("No cookie provided, skipping...")
		return;
	}

	const user = await client.login(process.env.TESTCOOKIE)
	if (!silent) console.log(`Logged in as ${user.name}:${user.id}`)

	expect(user).toBeDefined();
});

test("fetchGroup", async () => {
    const groupById = await client.fetchGroup(groupId);
    const groupByName = await client.fetchGroup("Purple Robotics, LLC");

    preFetchedGroup = groupById;
    if (!silent) console.log(`Fetched group: ${groupById.toString()}, ${groupByName.toString()}`);

    expect(groupById).toBeDefined();
    expect(groupByName).toBeDefined();
})

test("fetchAuditLog", async () => {
    if (!client.isLoggedIn()) {
		if (!silent) console.log("Not logged in, skipping...")
		return;
	}

    const auditLog = await preFetchedGroup.fetchAuditLog();

    if (!silent) console.log("Group audit log:\n", auditLog)

    expect(auditLog).toBeDefined();
})

test("fetchUniverses", async () => {
    try {
        const universes = await preFetchedGroup.fetchUniverses(1);

    console.log(`Fetched [${universes.length}] created universes:\n`, universes.map((data: Universe) => data.toString()).join("\n"));

    expect(universes).toBeDefined();
    } catch (error) {
        if (!(error instanceof FetchError)) throw error;

        console.log(await error.format());
    }
});