<template>
    <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
        <div
            v-if="false" class="fixed w-100 h-100 opacity-80 bg-purple-800 inset-0 z-50 flex items-center justify-center"
        >
            <svg
                class="animate-spin -ml-1 mr-3 h-12 w-12 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                ></circle>
                <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
        </div>
        <div class="container">
            <section>
                <div class="flex">
                    <div class="max-w-xs">
                        <label
                            for="wallet"
                            class="block text-sm font-medium text-gray-700"
                            >Тикер {{ newTickerName }}</label
                        >
                        <div class="mt-1 relative rounded-md shadow-md">
                            <input
                                :value="newTickerName"
                                @input="handleInput"
                                type="text"
                                name="wallet"
                                id="wallet"
                                class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                                placeholder="Например DOGE"
                            />
                        </div>
                        <div
                            class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap"
                        >
                            <span
                                v-for="prediction in coinPredictions"
                                :key="prediction"
                                @click="add(prediction)"
                                class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
                            >
                                {{ prediction }}
                            </span>
                        </div>
                        <div v-show="showExistingTickerError" class="text-sm text-red-600">
                            Такой тикер уже добавлен
                        </div>
                    </div>
                </div>
                <button
                    @click="add()"
                    type="button"
                    class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                    <!-- Heroicon name: solid/mail -->
                    <svg
                        class="-ml-0.5 mr-2 h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        viewBox="0 0 24 24"
                        fill="#ffffff"
                    >
                        <path
                            d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                        ></path>
                    </svg>
                    Добавить
                </button>
            </section>

            <template v-if="tickers.length > 0">
                <p>
                    Filter
                    <input type="text" v-model="filter" @input="filterTickers">
                    <button
                        :disabled="!hasPreviousPage"
                        @click="goToPreviousPage"
                        type="button"
                        :class="{'disabled:opacity-25': !hasPreviousPage}"
                        class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Prev
                    </button>
                    <button
                        :disabled="!hasNextPage"
                        @click="goToNextPage"
                        type="button"
                        :class="{'disabled:opacity-25': !hasNextPage}"
                        class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Next
                    </button>
                </p>
                <hr class="w-full border-t border-gray-600 my-4" />
                <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div
                            class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
                            v-for="t in paginatedTickers"
                            :key="t.name"
                            @click="selectGraph(t)"
                            :class="{
                                'border-4': selected === t
                            }"
                    >
                        <div class="px-4 py-5 sm:p-6 text-center">
                            <dt class="text-sm font-medium text-gray-500 truncate">
                                {{ t.name }} - USD
                            </dt>
                            <dd class="mt-1 text-3xl font-semibold text-gray-900">
                                {{ t.price }}
                            </dd>
                        </div>
                        <div class="w-full border-t border-gray-200"></div>
                        <button
                                @click.stop="handleTickerDelete(t)"
                                class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
                        >
                            <svg
                                    class="h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="#718096"
                                    aria-hidden="true"
                            >
                                <path
                                        fill-rule="evenodd"
                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                        clip-rule="evenodd"
                                ></path>
                            </svg>
                            Удалить
                        </button>
                    </div>
                </dl>
                <hr class="w-full border-t border-gray-600 my-4" />
            </template>

            <graph-table :selected="selected" :graph="graph" @remove="removeGraph"></graph-table>
        </div>
    </div>
</template>

<script>
    import GraphTable from "./components/Graph/Graph";
    import {getFullCoinList, subscribeToTicker, unsubscribeFromTicker} from "./utils/api";
    import {lsTickersKey, tickerToShowOnPage} from "./constants";

    export default {
    name: "App",
    components: {GraphTable},
    data () {
        return {
            newTickerName: "",
            allCoins: [],
            tickers: [],   //  [{name: ... , price: ...}]
            selected: null,
            graph: [],
            showExistingTickerError: false,
            page: 1,
            filter: ""
        }
    },
    mounted () {
        this.loadTickerFromLS();
        this.getAllCoins();
        this.loadUrlData();
    },
    watch: {
        tickers: {
            handler () {
                this.saveTickersToLS();
            },
            deep: true
        },
        filter () {
            this.page = 1;
            this.saveHistoryState();
        },
        page () {
            this.saveHistoryState();
        },
        paginatedTickers() {
            if (this.paginatedTickers.length === 0 && this.page > 1) {
                this.goToPreviousPage();
            }
        },
        selected () {
            this.graph = [];
        },
        newTickerName () {
            this.showExistingTickerError = false;
        }
    },
    computed: {
        coinPredictions () {
            if (this.newTickerName === "") return [];

            return this.allCoins
                .filter(coin => coin.includes(this.newTickerName.toUpperCase()))
                .sort((a, b) => a.length - b.length)
                .slice(0, 4);
        },
        startPageIndex () {
            return (this.page - 1) * tickerToShowOnPage;
        },
        endPageIndex () {
            return this.startPageIndex + tickerToShowOnPage;
        },
        filteredTickers () {
            return this.tickers.filter(t => t.name.includes(this.filter.toUpperCase()));
        },
        paginatedTickers () {
            return this.filteredTickers.slice(this.startPageIndex, this.endPageIndex);
        },
        hasPreviousPage () {
            return this.page > 1;
        },
        hasNextPage () {
            return (this.tickers.length / (this.page * tickerToShowOnPage)) > 1;
        }
    },
    methods: {
        updateTicker (tickerName, newPrice) {
            const ticker = this.tickers.find(t => t.name === tickerName);
            ticker.price = newPrice;

            if (ticker === this.selected) {
                this.graph.push(ticker.price);
            }
        },
        getAllCoins () {
            getFullCoinList().then((res) => {
                this.allCoins = Object.keys(res.Data);
            })
        },
        handleInput (event) {
            this.newTickerName = event.target.value;
        },
        async add (tickerToAdd = null) {
            try {
                this.showExistingTickerError = false;
                const tickerName = tickerToAdd ? tickerToAdd : this.newTickerName;
                const doesTickerExist = !!this.tickers.filter(t => t.name === tickerName).length;
                if (doesTickerExist) {
                    this.showExistingTickerError = true;
                    return;
                }

                const ticker = {name: tickerName.toUpperCase(), price: "-"};
                this.tickers.push(ticker);
                this.newTickerName = "";
                this.filter = "";

                subscribeToTicker(tickerName, newPrice => this.updateTicker(tickerName, newPrice));
            } catch (error) {
                alert(error.message);
            }
        },
        handleTickerDelete (tickerToRemove) {
            if (tickerToRemove === this.selected) {
                this.selected = null;
            }
            unsubscribeFromTicker(tickerToRemove.name);
            this.tickers = this.tickers.filter(t => t !== tickerToRemove);
        },
        selectGraph (t) {
            this.selected = t;
        },
        removeGraph () {
            this.selected = null;
        },
        saveTickersToLS () {
            localStorage.setItem(lsTickersKey, JSON.stringify(this.tickers));
        },
        loadTickerFromLS () {
            const list = localStorage.getItem(lsTickersKey);
            if (list) {
                this.tickers = JSON.parse(list);
            }

            if (this.tickers.length) {
                this.tickers.forEach(t => {
                    subscribeToTicker(t.name, price => this.updateTicker(t.name, price))
                })
            }
        },
        filterTickers (event) {
            this.filter = event.target.value;
        },
        goToPreviousPage () {
            if (this.hasPreviousPage) {
                this.page--;
            }
        },
        goToNextPage () {
            if (this.hasNextPage) {
                this.page++;
            }
        },
        saveHistoryState () {
            window.history.pushState(
                null,
                document.title,
                `${window.location.pathname}?filter=${this.filter}&page=${this.page}`
            )
        },
        loadUrlData () {
            const url = new URL(location.href);
            const params = Array.from(url.searchParams.entries());
            const entries = Object.fromEntries(params);
            Object.keys(entries).forEach(entryKey => {
                this[entryKey] = entries[entryKey]
            })
        },
    }
};
</script>

<style src="./app.css"></style>
