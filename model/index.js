const generator = require('./traffic-generator');
const fs = require('fs');

/*
 * We're going to generate our data with the assumption that there are multiple regions in different timezones
 * Each of these regions have a gmt offset, the total registered user-base, and the times at which these regions
 * typically come online and go offline. With each of these regions, we can construct a data-set through layering.
 *
 * We're going to do some funky things with sine waves to determine our overall throughput
 */
const regions = [
  {
    gmt: -10,
    users: 200000,
    peakTimes: [[9, 13], [18, 22]]
  },
  {
    gmt: -7,
    users: 750000,
    peakTimes: [[6, 10], [17, 20]]
  },
  {
    gmt: -5,
    users: 1100000,
    peakTimes: [[6, 8], [11, 13], [17, 24]]
  },
  {
    gmt: -4,
    users: 650000,
    peakTimes: [[9, 12], [19, 24]]
  },
  {
    gmt: 0,
    users: 300000,
    peakTimes: [[7, 11], [16, 20]]
  },
  {
    gmt: 2,
    users: 400000,
    peakTimes: [[19, 22]]
  },
  {
    gmt: 3,
    users: 1500000,
    peakTimes: [[7, 11], [14, 16], [19, 21]]
  },
  {
    gmt: 7,
    users: 150000,
    peakTimes: [[19, 22]]
  },
  {
    gmt: 8,
    users: 75000,
    peakTimes: [[7, 9], [20, 23]]
  },
  {
    gmt: 9,
    users: 450000,
    peakTimes: [[7, 10], [20, 22]]
  },
  {
    gmt: 10,
    users: 100000,
    peakTimes: [[18, 21]]
  },
  {
    gmt: 12,
    users: 90000,
    peakTimes: [[18, 22]]
  }
];

const samples = [];
const SECONDS_IN_DAY = 24 * 60 * 60;
for (let i = 0; i < SECONDS_IN_DAY; i++) {
  const obj = generator(regions, i);
  samples.push(obj);
}

const csv = ["time,active_users"];
for (let sample of samples) {
  csv.push(`${sample.time},${sample.traffic}`);
}

fs.writeFileSync('./output.csv', csv.join("\n"));
