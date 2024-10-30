import { expect } from 'chai';
import { transformRemappings } from '../../src/transformRemappings';
import mock from 'mock-fs';

describe('transformRemappings', () => {
  before(() => {
    mock({
      'remappings.txt': 'interfaces=../../interfaces',
    });
  });
  after(() => {
    mock.restore();
  });

  describe('with remapping for path inside node_modules', function () {
    before(() => {
      mock({
        'remappings.txt': `
          interfaces=../../interfaces
          solmate/=node_modules/solmate/src/`,
      });
    });
    it('should transform imports with remappings', () => {
      const fileContent = `
                                  import '../../../interfaces/ITest.sol';
                                  import './someFile.sol';
                                  import {FixedPointMathLib} from 'solmate/utils/FixedPointMathLib.sol';
                                `;

      const transformedContent = transformRemappings(fileContent);

      expect(transformedContent).to.include(`import '../../../../../interfaces/ITest.sol';`);
      expect(transformedContent).to.include(`import './someFile.sol';`);
      expect(transformedContent).to.include(`import {FixedPointMathLib} from 'solmate/src/utils/FixedPointMathLib.sol';`);
    });
  });

  it('should handle imports from node_modules correctly', () => {
    const fileContent = `
      import '../../../node_modules/some-package/Contract.sol';
      import 'node_modules/another-package/Token.sol';
      import {FixedPointMathLib} from 'node_modules/solmate/src/utils/FixedPointMathLib.sol';
    `;

    const transformedContent = transformRemappings(fileContent);

    expect(transformedContent).to.include(`import 'some-package/Contract.sol';`);
    expect(transformedContent).to.include(`import 'another-package/Token.sol';`);
    expect(transformedContent).to.include(`import {FixedPointMathLib} from 'solmate/src/utils/FixedPointMathLib.sol';`);
  });
});
