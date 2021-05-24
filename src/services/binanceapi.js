import Binance from "binance-api-node";

// import {toRefs, reactive} from '@vue/composition-api';

const client = Binance({
    apiKey:
        "BSpLm3K05L16PP5izu4za69rLxTa17OzJ2euAWyNt3L7wMLyKOY1ZrSx4DK1puEM",
    apiSecret:
        "ENjWO3Npw0NxTDTADvgBViZcmSOu7J2p00Pkk8uzm5eArG4Ntpsy9Yp65IuxRyMO",
    // getTime: Date.now(),
});
export const env = {
    local: true
}
export function BinanceAPI() {
    const API = {
        client,
        get: async (endpoint) => {
            return await (env.local ? require(`../services/${endpoint}.json`) : (client[endpoint])())
        },
        socket: async (stream) => {
            // stream !ticker@arr
            return new WebSocket(
                `wss://stream.binance.com:9443/ws/${stream}`
            );
        }
    }


    return { API }
}

