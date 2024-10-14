import Badge from "../../src/Classes/Badge.js";
import WrapBlox from "../../src/index.js";
import dotenv from "dotenv";
dotenv.config();

const client = new WrapBlox();
const badgeId = 1308554930906649;

test("login", async () => {
	if (!process.env.TESTCOOKIE) {
		console.log("No cookie provided, skipping...")
		return;
	}

	const user = await client.login(process.env.TESTCOOKIE)
	console.log(`Logged in as ${user.name}:${user.id}`)

	expect(user).toBeDefined();
});

test("fetchBadge", async () => {
    const badge = await client.fetchBadge(badgeId);

    console.log("Fetched badge:\n", badge)

    expect(badge).toBeDefined();
    expect(badge).toBeInstanceOf(Badge);
});

test("fetchIcon", async () => {
	const badge = await client.fetchBadge(badgeId);
	const icon = await badge.fetchIcon();

	console.log("Fetched icon:\n", icon)
});