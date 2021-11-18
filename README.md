# Data Generator

Data generator for backend metrics

## Getting Started

- Run `nvm install 16`
- Run `npm install`
- Run `node index.js` to start the server

## How to Use

This application exposes two endpoints, both of which will be necessary to automate metrics gathering.

- `GET http://localhost:4000/services` will return an array of each of the service names that are mocked with this backend.

- `GET http://localhost:4000/metrics/{service}` will return an object defining all of the metrics parses within a given time window.
  - The application generates data as summaries of 10 seconds of throughput.
  - This endpoint accepts two query parameters, `from` and `to`; 
  These two parameters are both UNIX timestamps in milliseconds.
  If the `from` and `to` parameters do not cover a window, no data will be returned
  - Additionally, if more than one parse window is covered by the parameters, multiple sample sets will be returned
