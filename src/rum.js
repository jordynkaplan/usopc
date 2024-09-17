import { init as initApm } from "@elastic/apm-rum";

const getClientIP = async () => {
    try {
        const response = await fetch("/ipify");
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error("Error fetching IP:", error);
        return "Unknown";
    }
};

const initializeAPM = async () => {
    const clientIP = await getClientIP();

    const apm = initApm({
        // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
        serviceName: "usopc-frontend",

        // Set custom APM Server URL (default: http://localhost:8200)
        serverUrl: "https://kaplan-project.com/elastic",

        // Set service version (required for sourcemap feature)
        serviceVersion: "1.0.0",
        apmRequest: ({ xhr }) => {
            console.log("clientIP", clientIP);
            xhr.setRequestHeader("X-Forwarded-For", clientIP);
            return true;
        },
    });

    // Set user context with IP
    apm.setUserContext({
        id: clientIP,
        ip: clientIP,
    });

    console.log("INIT");
};

initializeAPM();
