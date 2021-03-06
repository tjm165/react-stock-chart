import {GET_FINANCIAL_ITEM} from "./types";

export const getFinancialItem = (symbol) => async dispatch => {
    const API_KEY = '9SEJV46K465GDV17';
    let finItemSymbols = {"TSLA" : {"shares": 1}, "SPY": {"shares": 1}}

    let financialChartXValuesFunction = [];
    let financialChartCloseValuesFunction = [];
    let financialChartOpenValuesFunction = [];
    let financialChartHighValuesFunction = [];
    let financialChartLowValuesFunction = [];

    let timeSeries = {};
    

    try{
        for (let key in finItemSymbols){
            const finItemSymbol = key
            const numShares = finItemSymbols[key]["shares"]

         await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${finItemSymbol}&outputsize=compact&apikey=${API_KEY}`)
            .then(
                function(response) {
                    return response.json();
                }
            )
            .then(
                function(data) {

                    for (let key in data['Time Series (Daily)']) {
                        if (key in timeSeries){
                            timeSeries[key]['4. close'] =  parseFloat(timeSeries[key]['4. close']) + parseFloat(data['Time Series (Daily)'][key]['4. close']);
                            timeSeries[key]['1. open'] =  parseFloat(timeSeries[key]['1. open']) + parseFloat(data['Time Series (Daily)'][key]['1. open']);
                            timeSeries[key]['2. high'] =  parseFloat(timeSeries[key]['2. high']) + parseFloat(data['Time Series (Daily)'][key]['2. high']);
                            timeSeries[key]['3. low'] =  parseFloat(timeSeries[key]['3. low']) + parseFloat(data['Time Series (Daily)'][key]['3. low']);
                        }
                        else{
                            timeSeries[key] = {'4. close': 0, '1. open':0, '2. high': 0, '3. low': 0}
                            timeSeries[key]['4. close'] =  data['Time Series (Daily)'][key]['4. close'];
                            timeSeries[key]['1. open'] =   data['Time Series (Daily)'][key]['1. open'];
                            timeSeries[key]['2. high'] =   data['Time Series (Daily)'][key]['2. high'];
                            timeSeries[key]['3. low'] =   data['Time Series (Daily)'][key]['3. low'];    
                        }

                    }

                })
        }

        for (let key in timeSeries) {
            financialChartXValuesFunction.push(key);
            financialChartCloseValuesFunction.push(timeSeries[key]['4. close']);
            financialChartOpenValuesFunction.push(timeSeries[key]['1. open']);
            financialChartHighValuesFunction.push(timeSeries[key]['2. high']);
            financialChartLowValuesFunction.push(timeSeries[key]['3. low']);
        }

        const financialItem = {
            symbol: "finItemSymbol",
            financialChartXValues: financialChartXValuesFunction,
            financialChartCloseValues: financialChartCloseValuesFunction,
            financialChartOpenValues: financialChartOpenValuesFunction,
            financialChartHighValues: financialChartHighValuesFunction,
            financialChartLowValues: financialChartLowValuesFunction,
        };

        dispatch({
            type: GET_FINANCIAL_ITEM,
            payload: financialItem
        })
    }catch (e) {
        console.log(e)
    }
}