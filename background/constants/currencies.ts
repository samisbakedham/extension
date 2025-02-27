import { FiatCurrency, FungibleAsset, CoinGeckoAsset } from "../assets"
import { NetworkBaseAsset } from "../networks"
import { coinTypesByAssetSymbol } from "./coin-types"
import { SUPPORT_POLYGON } from "../features"

export const USD: FiatCurrency = {
  name: "United States Dollar",
  symbol: "USD",
  decimals: 10,
}

export const EUR: FiatCurrency = {
  name: "euro",
  symbol: "EUR",
  decimals: 10,
}

export const CNY: FiatCurrency = {
  name: "renminbi",
  symbol: "CNY",
  decimals: 10,
}

export const FIAT_CURRENCIES = [USD, EUR, CNY]

export const CNDL: FungibleAsset & CoinGeckoAsset & NetworkBaseAsset = {
  name: "Candle",
  symbol: "CNDL",
  decimals: 18,
  coinType: coinTypesByAssetSymbol.CNDL,
  metadata: {
    coinGeckoID: "candle",
    tokenLists: [],
    websiteURL: "https://cndlchain.com",
  },
}

export const ETH: FungibleAsset & CoinGeckoAsset & NetworkBaseAsset = {
  name: "Ether",
  symbol: "ETH",
  decimals: 18,
  coinType: coinTypesByAssetSymbol.ETH,
  metadata: {
    coinGeckoID: "ethereum",
    tokenLists: [],
    websiteURL: "https://ethereum.org",
  },
}

export const MATIC: FungibleAsset & CoinGeckoAsset & NetworkBaseAsset = {
  name: "Matic",
  symbol: "MATIC",
  decimals: 18,
  coinType: coinTypesByAssetSymbol.MATIC,
  metadata: {
    coinGeckoID: "matic-network",
    tokenLists: [],
    websiteURL: "https://polygon.technology/",
  },
}

export const BTC: FungibleAsset & CoinGeckoAsset & NetworkBaseAsset = {
  name: "Bitcoin",
  symbol: "BTC",
  decimals: 8,
  coinType: coinTypesByAssetSymbol.BTC,
  metadata: {
    coinGeckoID: "bitcoin",
    tokenLists: [],
    websiteURL: "https://bitcoin.org",
  },
}

export const BASE_ASSETS = [ETH, BTC, ...(SUPPORT_POLYGON ? [MATIC] : []),  ...(SUPPORT_CANDLE ? [CNDL] : [])]

export const BASE_ASSETS_BY_SYMBOL = BASE_ASSETS.reduce<{
  [assetSymbol: string]: FungibleAsset & CoinGeckoAsset & NetworkBaseAsset
}>((acc, asset) => {
  const newAcc = {
    ...acc,
  }
  newAcc[asset.symbol] = asset
  return newAcc
}, {})
