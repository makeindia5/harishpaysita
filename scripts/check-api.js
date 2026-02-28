const axios = require("axios");

// The CI pipeline will pass this environment variable
const API_URL = process.env.API_URL || "http://195.35.7.25:5000";

async function check() {
    console.log(`Checking API health at: ${API_URL}/health`);
    try {
        const res = await axios.get(`${API_URL}/health`, { timeout: 10000 });

        if (res.status === 200) {
            console.log("✅ API is healthy and reachable.");
            process.exit(0);
        }
    } catch (err) {
        console.error("❌ API check failed! The backend may be down or unreachable.");
        if (err.response) {
            console.error(`Status code: ${err.response.status}`);
        } else {
            console.error(`Error message: ${err.message}`);
        }
        process.exit(1);
    }
}

check();
