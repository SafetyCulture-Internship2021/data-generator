const uuid = require('uuid');

// randomDecimal generates a decimal within the provided range
const randomDecimal = (min, max) => {
    return Math.random() * (min - max) + max
};

const randomWithSpike = (min, max, chance, factor = 2) => {
    const hasSpike = randomDecimal(0, 1) < chance;
    return randomDecimal(min, max) * (hasSpike ? factor : 1)
}

// Apply an additional 10% jitter onto any percentages we generate
const jitter = (percentage = 1, ratio = 0.25) => {
    const jitterFactor = randomDecimal(0, 2 * ratio) - ratio;
    // Apply our jitter to our input percentage
    return percentage * (1 + jitterFactor)
}

const randomStatus = (config) => {
    const s_200 = config["200"]
    const s_400 = config["400"] + s_200
    const s_401 = config["401"] + s_400
    const s_403 = config["403"] + s_401
    const s_404 = config["404"] + s_403
    const s_499 = config["499"] + s_404
    const s_500 = config["500"] + s_499

    const status = randomDecimal(0, 1);

    if (status <= s_200) {
        return "200";
    } else if (status <= s_400) {
        return "400"
    } else if (status <= s_401) {
        return "401"
    } else if (status <= s_403) {
        return "403"
    } else if (status <= s_404) {
        return "404"
    } else if (status <= s_499) {
        return "499"
    } else if (status <= s_500) {
        return "500"
    } else {
        return "502"
    }
};

// This is ripped straight from SO, probably not great?
const randomSkew = (min, max, skew) => {
    let u = 0, v = 0;
    while (u === 0){
        u = Math.random()
    }
    while (v === 0) {
        v = Math.random()
    }

    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)

    num = num / 10.0 + 0.5 // Translate to 0 -> 1
    if (num > 1 || num < 0) {
        num = randomSkew(min, max, skew) // resample between 0 and 1 if out of range
    } else {
        num = Math.pow(num, skew) // Skew
        num *= max - min // Stretch to fill range
        num += min // offset to min
    }

    return num;
}

const sampleServiceData = (config, users) => {
    const traffic = users * jitter(config.trafficRatio, 0.2);
    const perPodTraffic = Math.floor(traffic / config.pod.count);
    const pods = [];

    for (let i = 0; i < config.pod.count; i++) {
        const cpu = Math.floor(randomWithSpike(config.pod.cpu.min, config.pod.cpu.max, config.pod.cpu.spikeChance));
        const mem = Math.floor(randomWithSpike(config.pod.mem.min, config.pod.mem.max, config.pod.mem.spikeChance));

        const status = {};

        const samples = [];

        for (let j = 0; j < perPodTraffic; j++) {
            const stat = randomStatus(config.status);
            if (!status[stat]) {
                status[stat] = 1
            } else {
                status[stat] += 1;
            }
            const latency = Math.floor(randomSkew(config.latency.from, config.latency.to, 2.5))
            const hasSpike = randomDecimal(0, 1) <= config.latencySpikeChance;

            samples.push(hasSpike ? latency * 4 : latency);
        }

        pods.push({
            pod: uuid.v4().split('-')[0],
            cpu,
            mem,
            status,
            latency: samples
        });
    }

    return pods;
};

module.exports = sampleServiceData;
