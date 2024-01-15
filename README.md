# WrapBlox

Wrapblox is an API wrapper for the Roblox API written in typescript. It is currently in development and really isnt meant for production.

## Installation

Install using NPM

```bash
npm install wrapblox
```

## Usage

```typescript
import WrapBlox from "wrapblox";

const wrapblox = new WrapBlox("optional cookie", "optional API Key");

const user = await wrapblox.getUser(1); // Returns a user object
```
