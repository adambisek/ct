/* eslint no-console: "off" */
// i suppose, that industrialProtocol have only one implemtation
// if doesn't, specific read function may be second argument of aggregate()
import async from 'async';
import { read } from './industrialProtocol';

const maxReadBytesCount = 10;

const aggregate = (inputList) => {
  // first thing: sort by interval start
  const sortedInputList = inputList.sort((array1, array2) => array1[0] - array2[0]);

  // split request to intervals by threshold
  const intervals = [];
  let currentStart = sortedInputList[0][0]; // first value of start
  let currentLength = 0;
  sortedInputList.forEach(([start, length, callback], key) => {
    if (length > maxReadBytesCount) { // split too large inputs
      currentStart = start;
      let remaining = length;
      while (remaining > 0) {
        const chunk = Math.min(remaining, maxReadBytesCount);
        intervals.push({ start: currentStart, length: chunk });
        currentStart += chunk;
        remaining -= chunk;
      }
      currentStart = sortedInputList[key + 1][0]; // currentStart = next key
      currentLength = 0;
      return true; // continue
    }

    const lastLength = currentLength;
    currentLength = (start + length) - currentStart;
    if (currentLength > maxReadBytesCount) {
      intervals.push({ start: currentStart, length: lastLength });
      currentStart = start;
      currentLength = length;
      return true; // continue
    }
    return null; // this return has no special meaning, but it satisfies "consistent-return" rule
  });
  intervals.push({ start: currentStart, length: currentLength });
  console.log('Calculated intervals', intervals); // THIS LOG IS FOR YOU ONLY!

  // get data for each interval
  const bytes = {};
  async.each(intervals, ({ start, length }, callback) => {
    read(start, length, (err, data) => {
      for (let i = 0; i < length; i++) { // don't iterate data, there may be missing bytes
        const byteNumber = start + i;
        bytes[byteNumber] = {
          err,
          data: err ? null : data[i],
        };
      }
      callback();
    });
  }, () => { // all data readed, send it back to callbacks
    sortedInputList.forEach(([start, length, callback]) => {
      const data = [];
      for (let i = 0; i < length; i++) {
        const byteNumber = start + i;
        if (bytes[byteNumber] === undefined) return callback(`Cannot find data for byte #${byteNumber}.`);
        if (bytes[byteNumber].err) return callback(bytes[byteNumber].err);
        data.push(bytes[byteNumber].data);
      }
      return callback(null, data); // this return has no special meaning, but it satisfies "consistent-return" rule
    });
  });
};
export default aggregate;
