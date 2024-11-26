import { expect } from 'chai';
import mock from 'mock-fs';
import { parseGitmodulesDependencies } from '../../src/parseGitmodulesDependencies';

describe('parseGitmodulesDependencies', () => {
  before(() => {
    mock.restore();
  });
  after(() => {
    mock.restore();
  });
  describe('with no gitmodules file', function () {
    it('should return an empty dependency list', function () {
      const parsedDependencies = parseGitmodulesDependencies();
      expect(parsedDependencies).to.deep.eq({});
    });
  });
  describe('with an empty file', function () {
    before(() => {
      mock({
        '.gitmodules': '',
      });
    });
    it('should return an empty dependency list', function () {
      const parsedDependencies = parseGitmodulesDependencies();
      expect(parsedDependencies).to.deep.eq({});
    });
  });
  describe('with a file with several dependencies', function () {
    before(() => {
      mock({
        '.gitmodules': `
      [submodule "lib/forge-std"]
        path = lib/forge-std
        url = https://github.com/foundry-rs/forge-std
      [submodule "lib/openzeppelin-contracts"]
        path = lib/openzeppelin-contracts
        url = https://github.com/OpenZeppelin/openzeppelin-contracts
      `,
      });
    });
    it('should be able to parse them', function () {
      const parsedDependencies = parseGitmodulesDependencies();
      expect(parsedDependencies['forge-std']).to.eq('https://github.com/foundry-rs/forge-std');
      expect(parsedDependencies['openzeppelin-contracts']).to.eq(
        'https://github.com/OpenZeppelin/openzeppelin-contracts',
      );
      expect(Object.keys(parsedDependencies)).to.have.length(2);
    });
  });
});
