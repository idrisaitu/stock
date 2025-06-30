import { useState, useEffect } from 'react';
import { Stock, MarketData, ChartData, Currency } from '../types/stock';

// Exchange rates for mock data
const exchangeRates = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110.0
};

// Mock data generator for demonstration
const generateMockStock = (symbol: string, name: string, currency: Currency = 'USD'): Stock => {
  const basePrice = Math.random() * 500 + 50;
  const change = (Math.random() - 0.5) * 20;
  const changePercent = (change / basePrice) * 100;
  
  const rate = exchangeRates[currency];
  
  return {
    symbol,
    name,
    price: Number((basePrice * rate).toFixed(2)),
    change: Number((change * rate).toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    volume: Math.floor(Math.random() * 10000000) + 1000000,
    marketCap: Math.floor((Math.random() * 1000000000000 + 10000000000) * rate),
    high: Number((basePrice + Math.random() * 10) * rate),
    low: Number((basePrice - Math.random() * 10) * rate),
    open: Number((basePrice + (Math.random() - 0.5) * 5) * rate),
    previousClose: Number((basePrice - change) * rate),
  };
};

const generateChartData = (days: number = 30, currency: Currency = 'USD'): ChartData[] => {
  const data: ChartData[] = [];
  let basePrice = 150 + Math.random() * 100;
  const rate = exchangeRates[currency];
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    basePrice += (Math.random() - 0.5) * 10;
    data.push({
      time: date.toISOString().split('T')[0],
      price: Number((basePrice * rate).toFixed(2)),
      volume: Math.floor(Math.random() * 5000000) + 1000000,
    });
  }
  
  return data;
};

export const useStockData = (country: string, currency: Currency = 'USD', period: number = 30) => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchStockData = async () => {
      if (!isMounted) return;
      
      try {
        // Generate mock data based on country and currency
        const stocks: Stock[] = [
          generateMockStock('AAPL', 'Apple Inc.', currency),
          generateMockStock('GOOGL', 'Alphabet Inc.', currency),
          generateMockStock('MSFT', 'Microsoft Corporation', currency),
          generateMockStock('AMZN', 'Amazon.com Inc.', currency),
          generateMockStock('TSLA', 'Tesla Inc.', currency),
          generateMockStock('META', 'Meta Platforms Inc.', currency),
          generateMockStock('NVDA', 'NVIDIA Corporation', currency),
          generateMockStock('NFLX', 'Netflix Inc.', currency),
        ];

        const currentHour = new Date().getHours();
        let marketStatus: 'open' | 'closed' | 'pre-market' | 'after-hours' = 'closed';
        
        if (currentHour >= 9 && currentHour < 16) {
          marketStatus = 'open';
        } else if (currentHour >= 4 && currentHour < 9) {
          marketStatus = 'pre-market';
        } else if (currentHour >= 16 && currentHour < 20) {
          marketStatus = 'after-hours';
        }

        if (isMounted) {
          setMarketData({
            stocks,
            lastUpdated: new Date().toISOString(),
            marketStatus,
          });
          setChartData(generateChartData(period, currency));
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stock data';
          setError(errorMessage);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    setLoading(true);
    fetchStockData();
    
    // Update data every minute instead of every 30 seconds
    const interval = setInterval(fetchStockData, 60000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [country, currency, period]);

  const retry = () => {
    setLoading(true);
    setError(null);
  };

  return { marketData, chartData, loading, error, retry };
};