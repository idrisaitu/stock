import { useState, useEffect } from 'react';
import { Stock } from '../types/stock';

const generateSearchResults = (query: string, country: string, sector: string): Stock[] => {
  const allStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Communication Services' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Cyclical' },
    { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Cyclical' },
    { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Communication Services' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology' },
    { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Communication Services' },
    { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
    { symbol: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financial Services' },
    { symbol: 'BAC', name: 'Bank of America Corp.', sector: 'Financial Services' },
    { symbol: 'XOM', name: 'Exxon Mobil Corporation', sector: 'Energy' },
    { symbol: 'CVX', name: 'Chevron Corporation', sector: 'Energy' },
    { symbol: 'WMT', name: 'Walmart Inc.', sector: 'Consumer Defensive' },
    { symbol: 'PG', name: 'Procter & Gamble Co.', sector: 'Consumer Defensive' },
  ];

  let filteredStocks = allStocks;

  // Filter by search query
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    filteredStocks = filteredStocks.filter(stock =>
      stock.symbol.toLowerCase().includes(searchTerm) ||
      stock.name.toLowerCase().includes(searchTerm)
    );
  }

  // Filter by sector
  if (sector && sector !== 'All Sectors') {
    filteredStocks = filteredStocks.filter(stock => stock.sector === sector);
  }

  // Generate full stock data
  return filteredStocks.map(stock => {
    const basePrice = Math.random() * 500 + 50;
    const change = (Math.random() - 0.5) * 20;
    const changePercent = (change / basePrice) * 100;

    return {
      symbol: stock.symbol,
      name: stock.name,
      price: Number(basePrice.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      marketCap: Math.floor(Math.random() * 1000000000000) + 10000000000,
      high: Number((basePrice + Math.random() * 10).toFixed(2)),
      low: Number((basePrice - Math.random() * 10).toFixed(2)),
      open: Number((basePrice + (Math.random() - 0.5) * 5).toFixed(2)),
      previousClose: Number((basePrice - change).toFixed(2)),
      country,
      sector: stock.sector,
    };
  });
};

export const useStockSearch = (query: string, country: string, sector: string) => {
  const [results, setResults] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchStocks = async () => {
      if (!query.trim() && !sector) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const searchResults = generateSearchResults(query, country, sector);
        setResults(searchResults);
      } catch (err) {
        setError('Failed to search stocks');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchStocks, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, country, sector]);

  return { results, loading, error };
};