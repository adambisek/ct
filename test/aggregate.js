/* eslint no-console: "off" */
import assert from 'assert';
import aggregate from '../src/aggregate';

/** @return [start, length, callback] **/
const createInput = (start, length, finalCallback) => {
  const expected = []; // for simplicity, but expected assertion depends on industrialProtocol implementation
  for (let i = 0; i < length; i++) {
    expected.push(`byte ${start + i}`);
  }
  const callback = (err, data) => { // callback for aggregate function, check data and callme back
    assert.equal(err, null);
    assert.deepEqual(data, expected);
    console.log(`For input ${start} - ${length} expected`, expected); // THIS LOG IS FOR YOU ONLY!
    finalCallback();
  };
  return [start, length, callback];
};

/** @return [
 *    [start, length, callback],
 *    [start, length, callback],
 * ]
 **/
const createInputList = (inputList, finalCallback) => {
  let calledTimes = 0;
  const callback = () => {
    calledTimes++;
    if (calledTimes > inputList.length) {
      assert.fail('Some callback invoked multiple times.'); // this would be serious bug
    }
    if (calledTimes === inputList.length) {
      finalCallback(); // this callback invokes only if all callback will be called
    }
  };
  const inputs = [];
  inputList.forEach((input) => {
    const one = createInput(input[0], input[1], callback);
    inputs.push(one);
  });
  return inputs;
};

describe('aggregate()', () => {
  describe('#successful callback call', () => {
    // generally, if done will not be called, mocha will fail on timeout
    // so, if all callbacks will not be invoked, we're covered
    it('should call callback with correct values', (done) => {
      const inputList = createInputList([
        [0, 5],
      ], done);
      aggregate(inputList);
    });
    it('should call callback with correct values', (done) => {
      const inputList = createInputList([
        [0, 0],
      ], done);
      aggregate(inputList);
    });
    it('should call callback with correct values', (done) => {
      const inputList = createInputList([
        [3, 1],
        [4, 1],
      ], done);
      aggregate(inputList);
    });
    it('should call callback with correct values', (done) => {
      const inputList = createInputList([
        [4, 1],
        [3, 1],
      ], done);
      aggregate(inputList);
    });
    it('should call callback with correct values', (done) => {
      const inputList = createInputList([
        [4, 1],
        [3, 1],
        [4, 1],
        [16, 3],
        [18, 2],
        [32, 8],
        [40, 1],
      ], done);
      aggregate(inputList);
    });
    it('should call callback with correct values', (done) => {
      const inputList = createInputList([
        [4, 40],
        [51, 2],
      ], done);
      aggregate(inputList);
    });
  });
});
