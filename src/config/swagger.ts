import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Mini E-Commerce API",
            version: "1.0.0",
            description: "REST API using Express dan TypeScript",
        },
    },
    servers: [
        {
            url: "http://localhost:4000",
            description: "Development Server",
        },
    ],
    apis: ["./src/modules/**/*.ts", "./src/app.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
