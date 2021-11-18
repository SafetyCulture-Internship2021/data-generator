const { compose } = require("@hapi/glue");
const ServiceContainer = require('./generator');

async function execute() {
    // Generate 10% of the data
    const serviceContainer = new ServiceContainer(0.1);

    const svc = await compose({
        server: {
            port: 4000,
        }
    }, {
        relativeTo: __dirname
    });

    svc.route({
        method: "GET",
        path: "/services",
        handler: (req, h) => {
            return serviceContainer.services();
        }
    })

    svc.route({
        method: "GET",
        path: "/metrics/{service}",
        handler: (req, h) => {
            const { service } = req.params;
            const { from, to } = req.query;

            if (serviceContainer.services().indexOf(service) === -1) {
                return [];
            }

            const fromInt = parseInt(from, 10);
            const toInt = parseInt(to, 10);

            return serviceContainer.data(service, fromInt, toInt);
        }
    })

    await svc.start();
}

execute()
    .then(() => {
        console.log('Metrics backend is up and running on port 4000');
    })
    .catch((err) => {
        console.error(err);
    });
