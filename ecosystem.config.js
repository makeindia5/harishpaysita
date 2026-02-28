module.exports = {
    apps: [
        {
            name: "paysita-backend",
            script: "./my-backend/index.js",
            watch: false,
            env: {
                NODE_ENV: "production",
                PORT: 6000
            }
        }
    ]
};
