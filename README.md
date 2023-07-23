# Outfit Picker V2 API

## Introduction

Outfit Picker V2 API is a server-side application designed to provide an API interface for the [Outfit Picker V2 client](https://github.com/derekology/outfit-picker-v2-client) to manage the outfits in a MongoDB database. It allows the app to interact with the database by sending requests to add, remove, or retrieve outfit documents based on specified queries.

## Features

- Connects to MongoDB to store and retrieve outfit documents.
- Provides endpoints to perform CRUD operations on outfits.
- Supports query parameters to filter outfits based on various criteria.

## Getting Started

### Prerequisites

Before running the Outfit Picker V2 API, make sure you have the following prerequisites installed on your system:

- Node.js (at least version 12.x)
- npm (Node Package Manager)
- MongoDB (Make sure MongoDB server is running or have access to a MongoDB instance)

### Installation

1. Clone the repository from GitHub:

```bash
git clone https://github.com/derekology/outfit-picker-v2-api.git
cd outfit-picker-v2-api
```

2. Install the required dependencies:

```bash
npm install
```
### Configuration
The API requires certain configuration options to connect to the MongoDB database and set up authentication and authorization. Before running the application, make sure to add a .env file in the root with the following details:

- PROD_URL: Production URL for CORS (or empty string)
- LOCAL_URL: Local URL for CORS (or empty string)
- DEV_URL: Development URL for CORS (or empty string)
- MONGODB_USER: MongoDB username
- MONGODB_PASSWORD: MongoDB username
- MONGODB_CLUSTER: MongoDB cluster
- MONGODB_DATABASE: MongoDB database string (including TLD)
- PROD_URL: MongoDB connection string

### Usage
To start the Outfit Picker V2 API server, run the following command:

```bash
node server.js
```
The API server will start listening on the configured port, and you can now send requests to the provided endpoints.

### API Endpoints
The API provides the following endpoints to manage outfits:
- POST '/addClothing': Adds a document based on a query object sent in the request body containing 'owner', 'type', 'article', 'colour', 'weight', 'imageUrl', and 'isAvailable' values. 
- POST '/getClothing': Retrieves documents based on a query object sent in the request body.
- POST '/updateClothing': Updates a document based on a query object sent in the request body containing the target document id and an object of updated attributes and values.
- POST '/deleteClothing': Deletes a document based on a query object sent in the request body containing the target document id.

### Contact
If you have any questions about this project, please feel free to reach out to me at me@derekw.co.