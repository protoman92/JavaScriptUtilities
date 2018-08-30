import {Errors} from '../src';

describe('Error utilities should work correctly', () => {
  it('Parsing errors should work correctly', () => {
    /// Setup
    let actualError = 'Error!';

    /// When
    let error1 = Errors.parseError(new Error(actualError));
    let error2 = Errors.parseError(actualError);
    let error3 = Errors.parseError(() => new Error(actualError));
    let error4 = Errors.parseError(() => actualError);

    /// Then
    expect(error1.message).toEqual(actualError);
    expect(error2.message).toEqual(actualError);
    expect(error3.message).toEqual(actualError);
    expect(error4.message).toEqual(actualError);
  });
});
