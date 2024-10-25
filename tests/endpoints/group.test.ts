import FetchError from "../../src/Classes/Internal/FetchError.js";
import WrapBlox, { Group, Universe } from "../../src/index.js";
import dotenv from "dotenv";
dotenv.config();

const client = new WrapBlox();
const groupId = 33991282;
let preFetchedGroup: Group;
const silent = true;

const log = (message: unknown, ...optionalParams: unknown[]) => {
	if (silent) return;
	console.log(message, ...optionalParams);
};

const authenticated = () => {
	if (!client.isLoggedIn()) {
		log("Not logged in, skipping...")
		return false;
	}

	return true;
}

beforeAll(async () => {
	if (!process.env.TESTCOOKIE) {
		console.log("No cookie provided, skipping...")
		return;
	}

	const user = await client.login(process.env.TESTCOOKIE)
	log(`Logged in as ${user.name}:${user.id}`)

	expect(user).toBeDefined();
});

test("fetchGroup", async () => {
    const groupById = await client.fetchGroup(groupId);
    const groupByName = await client.fetchGroup("Purple Robotics, LLC");

    preFetchedGroup = groupById;
    log(`Fetched group: ${groupById.toString()}, ${groupByName.toString()}`);

    expect(groupById).toBeDefined();
    expect(groupById).toMatchObject<Group>(groupById);

    expect(groupByName).toBeDefined();
    expect(groupByName).toMatchObject<Group>(groupByName);
})

test("fetchAuditLog", async () => {
    if (!authenticated()) return;

    const auditLog = await preFetchedGroup.fetchAuditLog();

    log("Group audit log:\n", auditLog)

    expect(auditLog).toBeDefined();
})

test("fetchUniverses", async () => {
    const universes = await preFetchedGroup.fetchUniverses(1);

    log(`Fetched [${universes.length}] created universes:\n`, universes.map((data: Universe) => data.toString()).join("\n"));

    expect(universes).toBeDefined();
    expect(universes).toBeInstanceOf(Array);
    for (const universe of universes) {
        expect(universe).toMatchObject<Universe>(universe);
    }
});