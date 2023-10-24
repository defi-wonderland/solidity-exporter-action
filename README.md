[![build-test](https://github.com/defi-wonderland/solidity-exporter-action/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/defi-wonderland/solidity-exporter-action/actions/workflows/test.yml)
[![tag badge](https://img.shields.io/github/v/tag/defi-wonderland/solidity-exporter-action)](https://github.com/defi-wonderland/solidity-exporter-action/tags)
[![license badge](https://img.shields.io/github/license/defi-wonderland/solidity-exporter-action)](./LICENSE)

# Solidity Exporter Action

Solidity Exporter Action automates the process of extracting TypeScript interfaces from Solidity contracts and interfaces and provides compatibility with TypeChain. Developers can seamlessly generate typings with only a few lines of yaml code.

## Action Inputs

| Input        | Description                                                                                                                              | Default        | Options               |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------- | --------------------- |
| package_name | name of the package to be published                                                                                                      | **Required**   |                       |
| out          | path to the `out` folder containing the compiled contracts                                                                               | out            |                       |
| interfaces   | path to the interfaces directory                                                                                                         | src/interfaces |                       |
| contracts    | path to the contracts directory                                                                                                          | src/contracts  |                       |
| export_type  | `interface` for exporting only the interfaces and their ABIs, `contracts` for exporting the contracts, interfaces and their ABIs as well | interfaces     | interfaces, contracts |

## Action Outputs

| Output | Description                                              |
| ------ | -------------------------------------------------------- |
| passed | Boolean describing if the action passed correctly or not |

# Usage

## Example

Solidity Exporter Action generates NPM packages with your interfaces and contracts ABIs using a matrix of arguments with both and then publishes them to NPM:

```yaml
name: Export And Publish Interfaces And Contracts

on: [push]

jobs:
  export:
    name: Generate Interfaces And Contracts
    runs-on: ubuntu-latest
    strategy:
      matrix:
        export_type: ['interfaces', 'contracts']

    steps:
      - uses: actions/checkout@v3

      - name: Install Foundry
        uses: foundry-rs/foundry-toolchain@v1
        with:
          version: nightly

      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: yarn --frozen-lockfile

      - name: Build project and generate out directory
        run: yarn build

      - name: Update version
        run: yarn version --new-version "0.0.0-${GITHUB_SHA::8}" --no-git-tag-version

      - name: Export Solidity - ${{ matrix.export_type }}
        uses: defi-wonderland/solidity-exporter-action@v1
        with:
          package_name: '@your-project-name'
          out: 'out'
          interfaces: 'solidity/interfaces'
          contracts: 'solidity/contracts'
          export_type: '${{ matrix.export_type }}'

      - name: Publish
        run: cd export/@your-project-name-${{ matrix.export_type }} && npm publish --access public
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

# Development

Install the dependencies

```bash
// Using yarn
yarn

// Using npm
npm install
```

Run the tests

```bash
// Using yarn
yarn test

// Using npm
npm test
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

# Contributors

Maintained with love by [Wonderland](https://defi.sucks). Made possible by viewers like you.
