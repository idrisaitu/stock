import { useState, useEffect } from 'react';
import { Stock, ChartData, TimeRange } from '../types/stock';

const generateDetailedChartData = (timeRange: TimeRange): ChartData[] => {
  const data: ChartData[] = [];
  let basePrice = 150 + Math.random() * 100;
  let dataPoints: number;
  
  switch (timeRange) {
    case '1D':
      dataPoints = 24; // Hourly data for 1 day
      break;
    case '1M':
      dataPoints = 30; // Daily data for 1 month
      break;
    case '3M':
      dataPoints = 90; // Daily data for 3 months
      break;
    case '1Y':
      dataPoints = 365; // Daily data for 1 year
      break;
    default:
      dataPoints = 30;
  }
  
  for (let i = dataPoints; i >= 0; i--) {
    const date = new Date();
    
    if (timeRange === '1D') {
      date.setHours(date.getHours() - i);
    } else {
      date.setDate(date.getDate() - i);
    }
    
    basePrice += (Math.random() - 0.5) * (timeRange === '1Y' ? 20 : 10);
    data.push({
      time: date.toISOString().split('T')[0],
      price: Number(basePrice.toFixed(2)),
      volume: Math.floor(Math.random() * 5000000) + 1000000,
    });
  }
  
  return data;
};

const generateMockStockDetail = (symbol: string): Stock => {
  const basePrice = Math.random() * 500 + 50;
  const change = (Math.random() - 0.5) * 20;
  const changePercent = (change / basePrice) * 100;
  
  const stockNames: { [key: string]: string } = {
    'AAPL': 'Apple Inc.',
    'GOOGL': 'Alphabet Inc.',
    'MSFT': 'Microsoft Corporation',
    'AMZN': 'Amazon.com Inc.',
    'TSLA': 'Tesla Inc.',
    'META': 'Meta Platforms Inc.',
    'NVDA': 'NVIDIA Corporation',
    'NFLX': 'Netflix Inc.',
  };

  const sectors: { [key: string]: string } = {
    'AAPL': 'Technology',
    'GOOGL': 'Communication Services',
    'MSFT': 'Technology',
    'AMZN': 'Consumer Cyclical',
    'TSLA': 'Consumer Cyclical',
    'META': 'Communication Services',
    'NVDA': 'Technology',
    'NFLX': 'Communication Services',
  };

  const descriptions: { [key: string]: string } = {
    'AAPL': 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company serves consumers, and small and mid-sized businesses; and the education, enterprise, and government markets.',
    'GOOGL': 'Alphabet Inc. provides various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America. It operates through Google Services, Google Cloud, and Other Bets segments.',
    'MSFT': 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide. The company operates in three segments: Productivity and Business Processes, Intelligent Cloud, and More Personal Computing.',
    'AMZN': 'Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions in North America and internationally. The company operates through three segments: North America, International, and Amazon Web Services (AWS).',
    'TSLA': 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems in the United States, China, and internationally.',
    'META': 'Meta Platforms, Inc. develops products that enable people to connect and share with friends and family through mobile devices, personal computers, virtual reality headsets, wearables, and in-home devices worldwide.',
    'NVDA': 'NVIDIA Corporation provides graphics, and compute and networking solutions in the United States, Taiwan, China, and internationally. The company operates in two segments, Graphics and Compute & Networking.',
    'NFLX': 'Netflix, Inc. provides entertainment services. It offers TV series, documentaries, feature films, and mobile games across a wide variety of genres and languages to members in over 190 countries.',
  };
  
  return {
    symbol,
    name: stockNames[symbol] || `${symbol} Corporation`,
    price: Number(basePrice.toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    volume: Math.floor(Math.random() * 10000000) + 1000000,
    marketCap: Math.floor(Math.random() * 1000000000000) + 10000000000,
    high: Number((basePrice + Math.random() * 10).toFixed(2)),
    low: Number((basePrice - Math.random() * 10).toFixed(2)),
    open: Number((basePrice + (Math.random() - 0.5) * 5).toFixed(2)),
    previousClose: Number((basePrice - change).toFixed(2)),
    country: 'United States',
    sector: sectors[symbol] || 'Technology',
    description: descriptions[symbol] || `${stockNames[symbol] || symbol} is a leading company in its sector with a strong market presence and innovative products and services.`,
  };
};

export const useStockDetail = (symbol: string, timeRange: TimeRange) => {
  const [stock, setStock] = useState<Stock | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockDetail = async () => {
      if (!symbol) return;
      
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const stockDetail = generateMockStockDetail(symbol);
        const chartDataForRange = generateDetailedChartData(timeRange);
        
        setStock(stockDetail);
        setChartData(chartDataForRange);
        setError(null);
      } catch (err) {
        setError('Failed to fetch stock details');
      } finally {
        setLoading(false);
      }
    };

    fetchStockDetail();
  }, [symbol, timeRange]);

  return { stock, chartData, loading, error };
};