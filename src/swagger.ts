
import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        version: 'v1.0.0',
        title: 'AdoptSpot API',
        description: 'AdoptSpot API Documentation'
    },
    servers: [
        {
            url: 'http://localhost:6868',
            description: 'Development server'
        },
    ],
    components: {
        securitySchemes: {
            apiKeyAuth: {
                type: 'apiKey',
                in: 'header',
                name: 'x-auth-token',
            }
        }
    },
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/routes/api/*.ts'];

swaggerAutogen({openapi: '3.0.0'})(outputFile, endpointsFiles, doc);