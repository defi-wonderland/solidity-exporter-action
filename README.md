[![build-test](https://github.com/defi-wonderland/interface-exporter-action/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/defi-wonderland/interface-exporter-action/actions/workflows/test.yml)
[![tag badge](https://img.shields.io/github/v/tag/defi-wonderland/interface-exporter-action)](https://github.com/defi-wonderland/interface-exporter-action/tags)
[![license badge](https://img.shields.io/github/license/defi-wonderland/interface-exporter-action)](./LICENSE)

# Interface Exporter Action

Interface Exporter Action automates the process of extracting TypeScript interfaces from Solidity contracts and provides compatibility with TypeChain. Developers can seamlessly generate typings with only a few lines of yaml code.

## Action Inputs

| Input           | Description                                                          | Default        | Options        |
| --------------- | -------------------------------------------------------------------- | -------------- | -------------- |
| out_dir         | The path to the directory where contracts are built                  | **Required**   |                |
| interfaces_dir  | The path to the directory where the interfaces are located           | src/interfaces |                |
| typing_type     | Typing option which NPM package will be compatible                   | **Required**   | abi, contracts |
| package_name    | Chosen name for the exported NPM package                             | **Required**   |                |
| destination_dir | The path to the destination directory where the NPM will be exported | **Required**   |                |
| contracts_dir   | The path to the directory where the contracts are located            | **Optional**   |                |

## Action Outputs

| Output | Description                                              |
| ------ | -------------------------------------------------------- |
| passed | Boolean describing if the action passed correctly or not |

# Usage

## Example

Interface Exporter Action generates an NPM package with your interfaces ABIs:

```yaml
- name: Use Node.js
  uses: actions/setup-node@v3
  with:
    node-version: 16
    registry-url: "https://registry.npmjs.org"

- name: Install dependencies
  run: yarn --frozen-lockfile

- name: Build project and generate out directory
  run: yarn build

- name: Export interfaces for abi compatibility
  uses: defi-wonderland/interface-exporter-action@v1
  with:
    out_dir: ./out
    interfaces_dir: src/interfaces
    typing_type: abi
    package_name: @my-cool-protocol/core-interfaces-abi
    destination_dir: abi-project

- name: Publish
  run: cd abi-project && npm publish --access public
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Interface Exporter Action generates an NPM package with your contracts:

```yaml
- name: Use Node.js
  uses: actions/setup-node@v3
  with:
    node-version: 16
    registry-url: "https://registry.npmjs.org"

- name: Install dependencies
  run: yarn --frozen-lockfile

- name: Build project and generate out directory
  run: yarn build

- name: Export contracts, abis and interfaces
  uses: defi-wonderland/interface-exporter-action@v1
  with:
    out_dir: ./out
    interfaces_dir: src/interfaces
    contracts_dir:  src/contracts
    typing_type: contracts
    package_name: @my-cool-protocol/core-interfaces-abi
    destination_dir: abi-project

- name: Publish
  run: cd abi-project && npm publish --access public
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

# Development

Install the dependencies

```bash
npm install
```

Run the tests

```bash
npm test
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

# Contributors

Maintained with love by [Wonderland](https://defi.sucks). Made possible by viewers like you.
