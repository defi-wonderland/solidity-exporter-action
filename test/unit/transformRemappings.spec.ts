import { expect } from 'chai';
import { transformRemappings } from '../../src/transformRemappings';
import mock from 'mock-fs';

describe('transformRemappings', () => {
  before(() => {
    mock({
      'remappings.txt': 'foo=bar',
    });
  });
  after(() => {
    mock.restore();
  });
  describe('with remapping for local file only', function () {
    before(function () {
      mock({
        'remappings.txt': 'interfaces=../../interfaces',
      });
    });
    it('should replace path as instructed by remapping with all import syntaxes', function () {
      const fileContent = `
                                  import '../../../interfaces/ITest.sol';
                                  import {ITest} from '../../../interfaces/ITest.sol';
                                  import {ITest, ITest2} from '../../../interfaces/ITest.sol';
                                  import {IBar as IFoo, ITest} from '../../../interfaces/ITest.sol';
                                  import * as Interfaces '../../../interfaces/ITest.sol';
                                  import "../../../interfaces/ITest.sol";
                                  import {ITest} from "../../../interfaces/ITest.sol";
                                  import {ITest, ITest2} from "../../../interfaces/ITest.sol";
                                  import {IBar as IFoo, ITest} from "../../../interfaces/ITest.sol";
                                  import * as Interfaces "../../../interfaces/ITest.sol";
                                `;

      const transformedContent = transformRemappings(fileContent);

      expect(transformedContent).to.include(`import '../../../../../interfaces/ITest.sol';`);
      expect(transformedContent).to.include(`import {ITest} from '../../../../../interfaces/ITest.sol';`);
      expect(transformedContent).to.include(`import {ITest, ITest2} from '../../../../../interfaces/ITest.sol';`);
      expect(transformedContent).to.include(`import {IBar as IFoo, ITest} from '../../../../../interfaces/ITest.sol';`);
      expect(transformedContent).to.include(`import * as Interfaces '../../../../../interfaces/ITest.sol';`);
      expect(transformedContent).to.include(`import "../../../../../interfaces/ITest.sol";`);
      expect(transformedContent).to.include(`import {ITest} from "../../../../../interfaces/ITest.sol";`);
      expect(transformedContent).to.include(`import {ITest, ITest2} from "../../../../../interfaces/ITest.sol";`);
      expect(transformedContent).to.include(`import {IBar as IFoo, ITest} from "../../../../../interfaces/ITest.sol";`);
      expect(transformedContent).to.include(`import * as Interfaces "../../../../../interfaces/ITest.sol";`);
    });

    it('should remove node_modules from import paths', function () {
      const fileContent = `
      import '../../../node_modules/some-package/Contract.sol';
      import 'node_modules/another-package/Token.sol';
      import {FixedPointMathLib} from 'node_modules/solmate/src/utils/FixedPointMathLib.sol';
      import {FixedPointMathLib} from "node_modules/solmate/src/utils/FixedPointMathLib.sol";
      import {FixedPointMathLib as FPL} from "node_modules/solmate/src/utils/FixedPointMathLib.sol";
      import * as FPL from "../node_modules/solmate/src/utils/FixedPointMathLib.sol";
    `;

      const transformedContent = transformRemappings(fileContent);

      expect(transformedContent).to.include(`import 'some-package/Contract.sol';`);
      expect(transformedContent).to.include(`import 'another-package/Token.sol';`);
      expect(transformedContent).to.include(
        `import {FixedPointMathLib} from 'solmate/src/utils/FixedPointMathLib.sol';`,
      );
      expect(transformedContent).to.include(
        `import {FixedPointMathLib} from "solmate/src/utils/FixedPointMathLib.sol";`,
      );
      expect(transformedContent).to.include(
        `import {FixedPointMathLib as FPL} from "solmate/src/utils/FixedPointMathLib.sol";`,
      );
      expect(transformedContent).to.include(`import * as FPL from "solmate/src/utils/FixedPointMathLib.sol";`);
    });
  });

  describe('with remapping for path inside node_modules', function () {
    before(() => {
      mock({
        'remappings.txt': `
          solmate/=node_modules/solmate/src/`,
      });
    });

    it('should apply remapping and then remove node_modules from path', () => {
      const fileContent = `
                                  import {FixedPointMathLib} from 'solmate/utils/FixedPointMathLib.sol';
                                  import 'solmate/utils/FixedPointMathLib.sol';
                                  import "solmate/utils/FixedPointMathLib.sol";
                                  import {FixedPointMathLib as FPL} from 'solmate/utils/FixedPointMathLib.sol';
                                  import * as FPL from "solmate/utils/FixedPointMathLib.sol";
                                `;

      const transformedContent = transformRemappings(fileContent);

      expect(transformedContent).to.include(
        `import {FixedPointMathLib} from 'solmate/src/utils/FixedPointMathLib.sol';`,
      );
      expect(transformedContent).to.include(`import 'solmate/src/utils/FixedPointMathLib.sol';`);
      expect(transformedContent).to.include(`import "solmate/src/utils/FixedPointMathLib.sol";`);
      expect(transformedContent).to.include(
        `import {FixedPointMathLib as FPL} from 'solmate/src/utils/FixedPointMathLib.sol';`,
      );
      expect(transformedContent).to.include(`import * as FPL from "solmate/src/utils/FixedPointMathLib.sol";`);
    });
  });

  it('should leave unrelated imports alone', () => {
    const fileContent = `
      import './Contract.sol';
      import '../contracts/Contract.sol';
      import {Contract} from "../contracts/Contract.sol";
      import "foo/Foo.sol";
      import {Contract as MyName} from'../contracts/Contract.sol';
      import * as MyName from'../contracts/Contract.sol';
    `;

    const transformedContent = transformRemappings(fileContent);

    expect(transformedContent).to.include(`import './Contract.sol';`);
    expect(transformedContent).to.include(`import '../contracts/Contract.sol';`);
    expect(transformedContent).to.include(`import {Contract} from "../contracts/Contract.sol";`);
    expect(transformedContent).to.include(`import "bar/Foo.sol";`);
    expect(transformedContent).to.include(`import {Contract as MyName} from'../contracts/Contract.sol';`);
    expect(transformedContent).to.include(`import * as MyName from'../contracts/Contract.sol';`);
  });

  it('should leave unrelated statements alone', () => {
    const fileContent = `
      // import './Contract.sol';
      // important comment
      contract C {}
    `;

    const transformedContent = transformRemappings(fileContent);

    expect(transformedContent).to.include(`// import './Contract.sol';`);
    expect(transformedContent).to.include(`// important comment`);
    expect(transformedContent).to.include(`contract C {}`);
  });

  // see https://github.com/defi-wonderland/solidity-exporter-action/issues/62 for tracking and details
  it.skip('should not have false positives choosing imports', () => {
    const fileContent = `
      /*  
      import '../../../node_modules/some-package/Contract.sol';
      */
    `;

    const transformedContent = transformRemappings(fileContent);

    expect(transformedContent).not.to.include(`import 'some-package/Contract.sol';`);
    expect(transformedContent).to.include(`import '../../../node_modules/some-package/Contract.sol';`);
  });

  // see https://github.com/defi-wonderland/solidity-exporter-action/issues/62 for tracking and details
  it.skip('should process two imports present in a single line', () => {
    const fileContent = `
      import 'foo/Foo.sol'; import 'foo/Bar.sol';
    `;

    const transformedContent = transformRemappings(fileContent);
    expect(transformedContent).to.include(`import 'bar/Foo.sol'; import 'bar/Bar.sol';`);
  });

  // see https://github.com/defi-wonderland/solidity-exporter-action/issues/62 for tracking and details
  it.skip('should process a multi-line import', () => {
    const fileContent = `
        import {
          Foo,
          Bar,
          Baz
        } from 'foo/Foo.sol';
    `;

    const transformedContent = transformRemappings(fileContent);
    expect(transformedContent).to.include(`
        import {
          Foo,
          Bar,
          Baz
        } from 'bar/Foo.sol';
    `);
  });
});
