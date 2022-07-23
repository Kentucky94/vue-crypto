import {intervalDelayTime} from "@/constants";

const apikey = "f6598bcf8697ce565b79d42b7b8bc2bc16f2debf3757f15f50bc19d8576359ab";

export const getFullCoinList = async () => {
    const data = await fetch(`https://min-api.cryptocompare.com/data/all/coinlist?summary=true&api_key=${apikey}`)
    const json = await data.json();

    return json
};

const tickerHandlers = new Map();

export const loadTickers = () => {
    setInterval(async () => {
        if (tickerHandlers.length === 0) return;

        const syms = [...tickerHandlers.keys()].map(ticker => ticker.toUpperCase()).join(",");
        const data = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${syms}&tsyms=USD&api_key=${apikey}`);
        const json = await data.json();

        if (!json || json.Response === "Error") {
            throw new Error("wrong api call");
        }

        Object.keys(json).forEach(key => {
            const value = json[key].USD;
            const handlers = tickerHandlers.get(key);

            handlers.forEach(h => {
                h(value);
            })
        })
    }, intervalDelayTime);
};

export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickerHandlers.get(ticker) || [];
    tickerHandlers.set(ticker, [...subscribers, cb])
};

export const unsubscribeFromTicker = (ticker) => {
    tickerHandlers.delete(ticker);
};

window.tickers = tickerHandlers;