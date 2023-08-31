[![build-test](https://github.com/defi-wonderland/interface-exporter-action/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/defi-wonderland/interface-exporter-action/actions/workflows/test.yml)
[![tag badge](https://img.shields.io/github/v/tag/defi-wonderland/interface-exporter-action)](https://github.com/defi-wonderland/interface-exporter-action/tags)
[![license badge](https://img.shields.io/github/license/defi-wonderland/interface-exporter-action)](./LICENSE)

# Interface Exporter Action

Interface Exporter Action automates the process of extracting TypeScript interfaces from Solidity contracts and provides compatibility with TypeChain. The action allows users to generate an NPM package compatible with web3-v1 or ethers-v6 typings. Developers can seamlessly generate typings with only a few lines of yaml code.

## Action Inputs

| Input           | Description                                                           | Default        | Options                            |
| --------------- | --------------------------------------------------------------------- | -------------- | -----------------------            |
| out_dir         | The path to the directory where contracts are built                   | **Required**   |                                    |
| interfaces_dir  | The path to the directory where the interfaces are located            | src/interfaces |                                    |
| typing_type     | Typing option which NPM package will be compatible                    | **Required**   | abi, ethers-v6, web3-v1, contracts |
| package_name    | Chosen name for the exported NPM package                              | **Required**   |                                    |
| destination_dir | The path to the destination directory where the NPM will be exported  | **Required**   |                                    |
| contracts_dir   | The path to the directory where the contracts are located             | **Optional**   |                                    |

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

Interface Exporter Action generates an NPM package with typechain which has compatibility with ethers-v6. Also, the Action provides ABIs interfaces.

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

- name: Add typechain to install dependencies
  run: yarn add typechain @typechain/ethers-v6

- name: Export interfaces for ethers compatibility
  uses: defi-wonderland/interface-exporter-action@v1
  with:
    out_dir: out
    interfaces_dir: src/interfaces
    typing_type: ethers-v6
    package_name: @my-cool-protocol/core-interfaces-ethers
    destination_dir: ethers-project

- name: Publish
  run: cd ethers-project && npm publish --access public
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Interface Exporter Action generates an NPM package with typechain which has compatibility with web3. Also, the Action provides ABIs interfaces.

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

- name: Add typechain to install dependencies
  run: yarn add typechain @typechain/web3-v1

- name: Export interfaces for web3 compatibility
  uses: defi-wonderland/interface-exporter-action@v1
  with:
    out_dir: ./out
    interfaces_dir: src/interfaces
    typing_type: web3-v1
    package_name: @my-cool-protocol/core-interfaces-web3
    destination_dir: web3-project

- name: Publish
  run: cd web3-project && npm publish --access public
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

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

Build the typescript and package it for distribution

```bash
npm run build && npm run package
```

Run the tests

```bash
npm test
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

# Contributors

Maintained with love by [Wonderland](https://defi.sucks). Made possible by viewers like you.
