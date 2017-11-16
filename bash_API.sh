curl "https://api.hitbtc.com/api/2/public/currency" -X GET | jq '.[] | select(.transferEnabled == true) | select(.crypto == true) | {id: .id}' > data/currencies.json
curl "https://api.hitbtc.com/api/2/public/symbol" -X GET | jq '.[] | select(.quoteCurrency == "ETH") | {id: .id}' > data/symbol.json
