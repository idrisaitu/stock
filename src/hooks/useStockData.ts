import { useState, useEffect } from 'react';
import { Stock, MarketData, ChartData } from '../types/stock';

// Mock data generator for demonstration
const generateMockStock = (symbol: string, name: string): Stock => {
  const basePrice = Math.random() * 500 + 50;
  const change = (Math.random() - 0.5) * 20;
  const changePercent = (change / basePrice) * 100;
  
  return {
    symbol,
    name,
    price: Number(basePrice.toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    volume: Math.floor(Math.random() * 10000000) + 1000000,
    marketCap: Math.floor(Math.random() * 1000000000000) + 10000000000,
    high: Number((basePrice + Math.random() * 10).toFixed(2)),
    low: Number((basePrice - Math.random() * 10).toFixed(2)),
    open: Number((basePrice + (Math.random() - 0.5) * 5).toFixed(2)),
    previousClose: Number((basePrice - change).toFixed(2)),
  };
};

const generateChartData = (days: number = 30): ChartData[] => {
  const data: ChartData[] = [];
  let basePrice = 150 + Math.random() * 100;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    basePrice += (Math.random() - 0.5) * 10;
    data.push({
      time: date.toISOString().split('T')[0],
      price: Number(basePrice.toFixed(2)),
      volume: Math.floor(Math.random() * 5000000) + 1000000,
    });
  }
  
  return data;
};

export const useStockData = (country: string) => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchStockData = async () => {
      if (!isMounted) return;
      
      try {
        // Generate mock data based on country
        const stocks: Stock[] = [
          generateMockStock('AAPL', 'Apple Inc.'),
          generateMockStock('GOOGL', 'Alphabet Inc.'),
          generateMockStock('MSFT', 'Microsoft Corporation'),
          generateMockStock('AMZN', 'Amazon.com Inc.'),
          generateMockStock('TSLA', 'Tesla Inc.'),
          generateMockStock('META', 'Meta Platforms Inc.'),
          generateMockStock('NVDA', 'NVIDIA Corporation'),
          generateMockStock('NFLX', 'Netflix Inc.'),
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
          setChartData(generateChartData());
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
  }, [country]);

  const retry = () => {
    setLoading(true);
    setError(null);
  };

  return { marketData, chartData, loading, error, retry };
};