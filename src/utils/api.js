const tickerHandlers = new Map();
const lsSocketKey = "crypto-socket";
const apikey = "f6598bcf8697ce565b79d42b7b8bc2bc16f2debf3757f15f50bc19d8576359ab";

const isSocketCreated = !!localStorage.getItem(lsSocketKey);
let socket = null;
if (!isSocketCreated) {
    socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${apikey}`);
    localStorage.setItem(lsSocketKey, JSON.stringify(true));

    socket.addEventListener("message", (e) => {
        const AGGREGATION_INDEX = "5";
        const data  = JSON.parse(e.data);

        if (data.TYPE === AGGREGATION_INDEX) {
            const handlers = tickerHandlers.get(data.FROMSYMBOL);

            if (Array.isArray(handlers)) {
                handlers.forEach(cb => {
                    if (data.PRICE) {
                        cb(data.PRICE);
                    }
                })
            }
        }
    });

    socket.addEventListener("close", () => {
        localStorage.removeItem(lsSocketKey);
    });

    window.addEventListener("beforeunload", () => {
        localStorage.removeItem(lsSocketKey);
    })
} else {
    console.error("ws connection already exists")
}

export const getFullCoinList = async () => {
    const data = await fetch(`https://min-api.cryptocompare.com/data/all/coinlist?summary=true&api_key=${apikey}`);
    return await data.json();
};


// export const loadTickers = () => {
//     setInterval(async () => {
//         if (tickerHandlers.length === 0) return;
//
//         const syms = [...tickerHandlers.keys()].map(ticker => ticker.toUpperCase()).join(",");
//         const data = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${syms}&tsyms=USD&api_key=${apikey}`);
//         const json = await data.json();
//
//         if (!json || json.Response === "Error") {
//             throw new Error("wrong api call");
//         }
//
//         Object.keys(json).forEach(key => {
//             const value = json[key].USD;
//             const handlers = tickerHandlers.get(key);
//
//             handlers.forEach(h => {
//                 h(value);
//             })
//         })
//     }, intervalDelayTime);
// };

const sendToWS = (action, subs) => {
    if (socket) {
        const message = JSON.stringify({
            "action": action,
            "subs": subs
        });

        if (socket.readyState === WebSocket.OPEN) {
            socket.send(message);
            return;
        }

        socket.addEventListener("open", () => {
            socket.send(message);
        }, {once: true})
    }
};

export const subscribeToTickerWS = ticker => {
    sendToWS("SubAdd", [`5~CCCAGG~${ticker}~USD`]);
};

export const unsubscribeFromTickerWS = ticker => {
    sendToWS("SubRemove", [`5~CCCAGG~${ticker}~USD`]);
};

export const subscribeToTicker = (ticker, cb) => {
    subscribeToTickerWS(ticker);
    const subscribers = tickerHandlers.get(ticker) || [];
    tickerHandlers.set(ticker, [...subscribers, cb])
};

export const unsubscribeFromTicker = (ticker) => {
    unsubscribeFromTickerWS(ticker);
    tickerHandlers.delete(ticker);
};

window.tickers = tickerHandlers;