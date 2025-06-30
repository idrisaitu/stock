import React, { useState } from 'react';
import { MarketOverview } from '../components/MarketOverview';
import { StockCard } from '../components/StockCard';
import { StockChart } from '../components/StockChart';
import { StockModal } from '../components/StockModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { NetworkError } from '../components/NetworkError';
import { CurrencySelector } from '../components/CurrencySelector';
import { CountrySelector } from '../components/CountrySelector';
import { TimeRangeSelector } from '../components/TimeRangeSelector';
import { MarketOverviewSkeleton, ChartSkeleton, StockCardSkeleton } from '../components/SkeletonLoader';
import { useGeolocation } from '../hooks/useGeolocation';
import { useStockData } from '../hooks/useStockData';
import { useAppContext } from '../context/AppContext';
import { Stock } from '../types/stock';
import { AlertCircle, Globe, Clock, Wifi, TrendingUp, Activity } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [period, setPeriod] = useState(30); // Default to 30 days
  
  const { currency, selectedCountry } = useAppContext();
  const { country, city, loading: locationLoading, error: locationError } = useGeolocation();
  const { marketData, chartData, loading: stockLoading, error: stockError, retry } = useStockData(selectedCountry, currency, period);

  const handleStockClick = (stock: Stock) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStock(null);
  };

  // Show loading spinner only on initial load
  if (locationLoading && stockLoading) {
    return <LoadingSpinner />;
  }

  if (stockError) {
    return (
      <NetworkError 
        error={stockError}
        onRetry={retry}
        title="Unable to Load Market Data"
      />
    );
  }

  const getStatusColor = () => {
    switch (marketData?.marketStatus) {
      case 'open': return 'text-green-600';
      case 'pre-market': return 'text-yellow-600';
      case 'after-hours': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = () => {
    switch (marketData?.marketStatus) {
      case 'open': return 'Market Open';
      case 'pre-market': return 'Pre-Market';
      case 'after-hours': return 'After Hours';
      default: return 'Market Closed';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with controls */}
      <div className="glass-effect border-b border-gray-200/50 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Globe className="h-4 w-4" />
                <span>{city}, {country}</span>
              </div>
              
              <div className={`flex items-center space-x-2 text-sm font-medium ${getStatusColor()}`}>
                <Wifi className="h-4 w-4" />
                <span>{getStatusText()}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Updated {marketData ? new Date(marketData.lastUpdated).toLocaleTimeString() : '--:--'}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <CountrySelector />
              <CurrencySelector />
              <TimeRangeSelector value={period} onChange={setPeriod} />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {locationError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 animate-fade-in">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <p className="text-yellow-800">{locationError}</p>
            </div>
          </div>
        )}

        {/* Market Overview Section */}
        {stockLoading ? (
          <MarketOverviewSkeleton />
        ) : marketData ? (
          <div className="animate-fade-in">
            <MarketOverview stocks={marketData.stocks} />
          </div>
        ) : null}
        
        {/* Chart and Status Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            {stockLoading ? (
              <ChartSkeleton />
            ) : chartData.length > 0 ? (
              <div className="animate-fade-in">
                <StockChart data={chartData} symbol="Market Overview" />
              </div>
            ) : null}
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm card-hover">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span>Market Status</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Current Time</span>
                <span className="font-medium">{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Location</span>
                <span className="font-medium">{city}, {selectedCountry}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Currency</span>
                <span className="font-medium">{currency}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`font-medium ${getStatusColor()}`}>
                  {getStatusText()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Stocks Tracked</span>
                <span className="font-medium">{marketData?.stocks.length || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Cards Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <span>Stock Prices</span>
          </h2>
          
          {stockLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                  <StockCardSkeleton />
                </div>
              ))}
            </div>
          ) : marketData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {marketData.stocks.map((stock, index) => (
                <div
                  key={stock.symbol}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className="animate-fade-in"
                >
                  <StockCard 
                    stock={stock} 
                    onClick={() => handleStockClick(stock)}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </main>

      <StockModal 
        stock={selectedStock}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};