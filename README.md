# Data Generator

## Getting Started

This application will generate a set of mock data to
simulate a set of backend services interacting amongst each other.

There is a single scrape endpoint `GET /metrics/:service?from=0&to=10`.
The scrape endpoint will return an array of metric samples that have been taken between the two points
