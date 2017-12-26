curl -X GET https://api.hitbtc.com/api/2/public/currency  | jq '.[] | select(.transferEnabled == true) | select(.crypto == true) | {id: .id}' > data/currencies.json
curl -X GET https://api.hitbtc.com/api/2/public/symbol  | jq '.[] | select(.quoteCurrency == "ETH") | {id: .id}' > data/symbol.json
