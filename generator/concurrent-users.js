const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_DAY = 86400;
// 3/5ths of traffic is near-continuous
const BASELINE_RATIO = 0.6;

// randomDecimal generates a decimal within the provided range
const randomDecimal = (min, max) => {
  return Math.random() * (min - max) + max
};

const samplePeak = (peak, second) => {
  const start = peak[0] * SECONDS_IN_HOUR;
  const end = peak[1] * SECONDS_IN_HOUR;

  // We want to see how many seconds are in this peak
  const totalSeconds = end - start;
  // And how many seconds we are into this peak
  const progress = second - start;

  // Progress is just the percentage of the peak that has been completed
  const progressRatio = progress / totalSeconds;

  // Sine waves have troughs at -1/2 Pi and 3/2 Pi, with the peak at 1/2 Pi
  // We can make that easier to work with by saying our progress is a % of 2Pi
  // and offset by -1/2 Pi
  const progressNormalised = (progressRatio * (2 * Math.PI)) - (0.5 * Math.PI);

  // Sine waves are between -1 and 1. Div 2 gives us -0.5 and 0.5, add 0.5 and we go between 0 and 1
  return Math.sin(progressNormalised) / 2 + 0.5;
};

// generateTrafficWave will generate a
const sampleTrafficProfile = (config, second, dauRatio) => {
  // At most, 1% of our users are online in a region at any given point
  const peak = (config.users * 0.01) * dauRatio;
  // Consistent baseline throughput in the region as a fraction of the peak throughput for the day
  const baseline = peak * randomDecimal(BASELINE_RATIO - 0.01, BASELINE_RATIO);

  const matchingPeak = config.peakTimes.find((pt) => {
    const start = pt[0] * SECONDS_IN_HOUR;
    const end = pt[1] * SECONDS_IN_HOUR;

    if (second > start && second < end) {
      return true;
    }
  });
  if (!matchingPeak) {
    return baseline;
  }

  const normalised = samplePeak(matchingPeak, second);
  return peak * (BASELINE_RATIO + ((1 - BASELINE_RATIO) * normalised));
};

// normaliseSeconds will take any input seconds val, and add or remove days of seconds to it
// until we have a value that will sit between 0 seconds (midnight), and
const normaliseSeconds = (s) => {
  while (s >= SECONDS_IN_DAY) {
    s -= SECONDS_IN_DAY;
  }
  while (s < 0) {
    s += SECONDS_IN_DAY;
  }
  return s;
}

// Seconds must be the current time in UTC, everything else will be offset based on that
const sampleCurrentTime = (regions, seconds) => {
  const normalisedTime = normaliseSeconds(seconds);

  const dauRatio = randomDecimal(0.95, 1);
  let traffic = 0;
  for (let region of regions) {
    const regionSeconds = normaliseSeconds(seconds + (region.gmt * SECONDS_IN_HOUR));
    const profile = sampleTrafficProfile(region, regionSeconds, dauRatio);
    if (!Number.isNaN(profile)) {
      traffic += profile;
    }
  }

  return { time: normalisedTime, traffic };
};

module.exports = sampleCurrentTime;