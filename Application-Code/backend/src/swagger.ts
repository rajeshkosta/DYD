import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: "Cemosafe API",
        description: "Automatically generated Swagger documentation",
    },
    host: process.env.HOST || "localhost:5000",
    schemes: process.env.NODE_ENV === "production" ? ["https"] : ["http"],
    basePath: "/api",
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
        {
            name: "User",
            description: "User-related endpoints",
        },
    ],
    securityDefinitions: {
        BearerAuth: {
            type: "apiKey",
            in: "header",
            name: "Authorization",
            description: "Enter your token as 'Bearer <TOKEN>'",
        },
    },
   
    security: [{ BearerAuth: [] }],
};

const outputFile = "./src/swagger.json";
// const routes = ["./src/app.ts"];
const endpointsFiles = ["./src/routes/index.ts"];

swaggerAutogen()(outputFile, endpointsFiles,  doc).then(() => {
    // import("./app"); // Start the app after generating Swagger JSON
    console.log("Swagger JSON generated");
});
