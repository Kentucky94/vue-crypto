const apikey = "f6598bcf8697ce565b79d42b7b8bc2bc16f2debf3757f15f50bc19d8576359ab";

export const getTickerData = async (sym) => {
    const data = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${sym}&tsyms=USD&api_key=${apikey}`);
    const json = await data.json();

    if (!json || json.Response === "Error") {
        throw new Error("wrong api call");
    }

    return json;
};

export const getTickersData = async (tickerArray) => {
    const syms = tickerArray.map(ticker => ticker.name.toUpperCase()).join(",");
    const data = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${syms}&tsyms=USD&api_key=${apikey}`);
    const json = await data.json();

    if (!json || json.Response === "Error") {
        throw new Error("wrong api call");
    }

    return json;
};

export const getFullCoinList = async () => {
    const data = await fetch(`https://min-api.cryptocompare.com/data/all/coinlist?summary=true&api_key=${apikey}`)
    const json = await data.json();

    return json
};