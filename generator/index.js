const generateConcurrentUsers = require('./concurrent-users');
const generateServiceData = require('./service-data');

class ServiceContainer {
    constructor(ratio = 1) {
        // Load in our config from the config file
        this.regionCfg = require('./region_config.json');
        this.serviceCfg = require('./service_config.json');

        this.services = this.services.bind(this);
        this.data = this.data.bind(this);

        this.ratio = ratio;
    }

    services() {
        return Object.keys(this.serviceCfg);
    }

    data(service, from, to) {
        const parses = {};

        for (let i = from; i < to; i++) {
            // Every 10s
            if (i % 10000 === 0) {
                const second = Math.floor(i / 1000);
                const { traffic } = generateConcurrentUsers(this.regionCfg.regions, second);

                const pods = generateServiceData(this.serviceCfg[service], traffic * this.ratio);

                parses[i] = pods.reduce((agg, pod) => {
                    agg[`${service}-${pod.pod}`] = {
                        ts: i,
                        meta: {
                            service,
                            pod: `${service}-${pod.pod}`
                        },
                        http: {
                            status: pod.status,
                            latency: pod.latency
                        },
                        os: {
                            cpu: pod.cpu,
                            memory: pod.mem
                        }
                    };
                    return agg;
                }, {});
            }
        }

        return parses;
    }
}

module.exports = ServiceContainer;
