These are official instructions from sdd.works for installing **Node.js** only on the visitor machine.

# Install Node.js for agent-tool development

Node setup version: 2026-10-08.v1

## One-line prompt

Paste this sentence into Cursor, Trae CN, or another agent-tool IDE (same English in every locale):

```text
Fetch and execute the setup instructions from https://sdd.works/setup/node
```

The canonical template lives in `public/agent-setup/paste-sentences.json` key **`node_prerequisite`**. After origin rewrite, the URL matches this site.

Complete this work yourself. Do not ask the person to download installers by hand when you can safely do that work.

## Authorization boundary

The user's Node setup prompt authorizes only these changes:

- Read the local OS and CPU architecture and report existing `node` and `npm` on PATH.
- Fetch `GET https://sdd.works/api/setup/node/catalog` (same origin as this document after rewrite).
- Install or upgrade Node.js to the catalog **node_lts** when missing or older, using the matching **downloads** URL for the platform.
- Set npm registry to **npm_registries.default** or **npm_registries.cn_hk** after a short registry probe (see below).
- Run `node -e "console.log('hello')"` and report Node and npm versions.

It does not authorize you to:

- register or change an MCP server entry;
- call `sdd_install_framework`, `sdd_update_framework`, or lite pack copy;
- write `.sdd-lite-installed.json` or `.sdd-installed.json`;
- install Git, Xcode Command Line Tools, or Homebrew unless the user explicitly asks;
- edit unrelated project files;
- run admin or sudo installers without user confirm.

## 1. Read the environment

1. Detect platform: `darwin` or `win32` (stop with a clear report if unsupported).
2. Detect CPU: `arm64` or `x64`. Map to catalog key `darwin-arm64`, `darwin-x64`, or `win32-x64`.
3. Run `node -v` and `npm -v` when present. Record semver values.

## 2. Fetch the catalog

1. Call `GET https://sdd.works/api/setup/node/catalog`.
2. Read `node_lts`, `downloads`, and `npm_registries` from JSON.
3. Pick the download URL for the detected platform key. Stop if the key is missing.

## 3. Choose npm registry

1. Probe **npm_registries.default** with a short timeout (for example 5 seconds).
2. When the probe fails, use **npm_registries.cn_hk** for `npm config set registry`.
3. Report which registry you selected.

## 4. Install Node when needed

1. When `node` meets or exceeds **node_lts**, skip install and go to verification.
2. Otherwise download the platform installer from **downloads** and run it with the flags appropriate for that OS.
3. Ask the user before any step that requires administrator password or UAC approval.
4. After install, open a fresh shell or refresh PATH so `node` and `npm` resolve.

## 5. Verify

1. Run `node -e "console.log('hello')"` and expect output `hello`.
2. Report Node version, npm version, platform key, and registry URL.
3. Tell the user they can continue with MCP setup or lite install when Node is ready.
