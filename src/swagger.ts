
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
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
            }
        }
    },
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/server.ts'];

swaggerAutogen({openapi: '3.0.0'})(outputFile, endpointsFiles, doc);