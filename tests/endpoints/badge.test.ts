import WrapBlox, { Badge } from "../../src/index.js";
import dotenv from "dotenv";
dotenv.config();

const client = new WrapBlox();
const badgeId = 1308554930906649;
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

test("fetchBadge", async () => {
    const badge = await client.fetchBadge(badgeId);

    if (!silent) console.log("Fetched badge:\n", badge)

    expect(badge).toBeDefined();
    expect(badge).toBeInstanceOf(Badge);
});

test("fetchIcon", async () => {
	const badge = await client.fetchBadge(badgeId);
	const icon = await badge.fetchIcon();

	if (!silent) console.log("Fetched icon:\n", icon)
});