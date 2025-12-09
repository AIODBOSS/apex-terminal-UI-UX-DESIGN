import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  AreaChart, Area, 
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
  ComposedChart 
} from 'recharts';
import { 
  Activity, 
  Wallet, 
  Zap,
  ArrowUpRight, 
  ArrowDownRight,
  Wifi,
  Settings,
  ChevronDown,
  Layers,
  Maximize2,
  Search,
  BarChart2,
  TrendingUp,
  Blocks,       
  AlignJustify,
  Cpu,
  Globe,
  Aperture,
  Terminal,
  Hexagon,
  Scan,
  Crosshair
} from 'lucide-react';

// --- Constants ---
const BINANCE_WS_URL = 'wss://stream.binance.com:9443/ws';
const PAIRS = {
  'BTC': 'btcusdt',
  'ETH': 'ethusdt',
  'SOL': 'solusdt'
};

// --- Custom Icons (The "Correct" Icons) ---

const BitcoinIcon = ({ className }) => (
  <svg viewBox="0 0 32 32" className={className} fill="currentColor">
    <path d="M23.638 14.904c1.602-1.044 2.535-2.923 2.112-5.323-.71-4.04-4.225-4.835-7.796-4.992V1.5h-2.92v3.023h-2.88V1.5h-2.92v3.082H4.81v3.527s1.614.032 1.58.032c.877.02 1.348.423 1.348.423l2.213 8.87s-.175.437-.626.697l.666 2.664L12.18 29.35c.067.17.26.432 1.02.432h.033v.033c.034 0 1.614-.033 1.614-.033v3.718h2.92v-3.665h2.88v3.633h2.92v-3.73c4.914-.24 8.232-2.07 8.526-6.195.23-2.97-1.543-4.526-4.455-5.639zm-6.13 10.36h-4.32V18.15h4.32c3.513 0 4.143 2.766 4.143 3.53 0 .796-.13 3.584-4.143 3.584zm.52-10.73h-4.84V8.47h4.84c2.81 0 3.735 1.933 3.735 2.97 0 1.05-.13 3.093-3.735 3.093z" />
  </svg>
);

const EthereumIcon = ({ className }) => (
  <svg viewBox="0 0 32 32" className={className} fill="currentColor">
    <path d="M15.925 0L15.56 1.235V22.21L15.925 22.575L26.31 16.435L15.925 0Z" fillOpacity="0.6"/>
    <path d="M15.925 0L5.53999 16.435L15.925 22.575V11.83V0Z" />
    <path d="M15.925 24.385L15.77 24.575V31.595L15.925 32L26.315 17.47L15.925 24.385Z" fillOpacity="0.6" />
    <path d="M15.925 32V24.385L5.53999 17.47L15.925 32Z" />
    <path d="M15.925 22.575L26.31 16.435L15.925 11.83V22.575Z" fillOpacity="0.2"/>
    <path d="M5.53999 16.435L15.925 22.575V11.83L5.53999 16.435Z" fillOpacity="0.6" />
  </svg>
);

const SolanaIcon = ({ className }) => (
  <svg viewBox="0 0 32 32" className={className} fill="currentColor">
    <path d="M4.96 17.845a.732.732 0 0 1-.065-1.025l.065-.08L8.6 13.11c.21-.24.515-.38.835-.38h17.6c.26 0 .515.095.71.265.42.365.465 1.005.1 1.425l-.1.11-3.64 3.63a1.1 1.1 0 0 1-.835.38H5.67c-.26 0-.515-.095-.71-.265v-.03zM27.035 7.635a.74.74 0 0 1 .065 1.025l-.065.08-3.64 3.63a1.1 1.1 0 0 1-.835.38H4.965c-.26 0-.515-.095-.71-.265-.42-.365-.465-1.005-.1-1.425l.1-.11 3.64-3.63a1.1 1.1 0 0 1 .835-.38H26.33c.26 0 .515.095.71.265v.03zm-22.075 16.73a.74.74 0 0 1-.065-1.025l.065-.08 3.64-3.63a1.1 1.1 0 0 1 .835-.38H27.04c.26 0 .515.095.71.265.42.365.465 1.005.1 1.425l-.1.11-3.64 3.63a1.1 1.1 0 0 1-.835.38H5.67c-.26 0-.515-.095-.71-.265v-.03z"/>
  </svg>
);

const COIN_ICONS = {
  'BTC': BitcoinIcon,
  'ETH': EthereumIcon,
  'SOL': SolanaIcon
};

// --- Custom Shapes ---

const Candlestick = (props) => {
  const { x, y, width, height, payload } = props;
  if (!payload) return null;
  
  const { low, high, open, close } = payload;
  const isUp = close >= open;
  const color = isUp ? '#00f0ff' : '#ff0055'; 
  
  const bodyRange = Math.abs(open - close) || 0.0001;
  const pixelRatio = height / bodyRange;
  
  const bodyTop = y;
  const bodyBottom = y + height;
  
  const highDist = (high - Math.max(open, close)) * pixelRatio;
  const lowDist = (Math.min(open, close) - low) * pixelRatio;

  const wickTop = bodyTop - highDist;
  const wickBottom = bodyBottom + lowDist;
  const centerX = x + width / 2;

  return (
    <g>
      <line x1={centerX} y1={wickTop} x2={centerX} y2={wickBottom} stroke={color} strokeWidth="1" opacity={0.6} />
      <rect 
        x={x} 
        y={y} 
        width={width} 
        height={height < 2 ? 2 : height} 
        fill={color} 
        fillOpacity={isUp ? 0.1 : 0.9} 
        stroke={color} 
        strokeWidth="1" 
        rx={1}
      />
    </g>
  );
};

const RenkoBrick = (props) => {
  const { x, y, width, height, payload } = props;
  if (!payload) return null;
  
  const { open, close } = payload;
  const isUp = close >= open;
  const color = isUp ? '#00f0ff' : '#ff0055';
  
  return (
    <rect 
      x={x} 
      y={y} 
      width={width} 
      height={height} 
      fill={color} 
      stroke={color}
      strokeWidth={1}
      fillOpacity={0.15}
      filter="url(#glow)"
      rx={2}
    />
  );
};

// --- Components ---

// TechPanel: A HUD-like container with corner markers
const TechPanel = ({ children, className = '' }) => (
  <div className={`bg-[#050505]/80 backdrop-blur-md border border-white/5 relative overflow-hidden group ${className}`}>
    {/* Decorative Corners */}
    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/50" />
    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500/50" />
    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500/50" />
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/50" />
    
    {/* Scanline Gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.03] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
    
    {children}
  </div>
);

const StatusBadge = ({ connected, latency, mode }) => (
  <div className="flex items-center gap-3 px-3 py-1 bg-black/40 border border-white/10 rounded-sm">
    <div className="relative flex items-center justify-center">
      <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-cyan-400' : 'bg-red-500'} shadow-[0_0_10px_currentColor]`} />
      {connected && <div className="absolute inset-0 bg-cyan-400/50 rounded-full animate-ping" />}
    </div>
    <span className="text-[9px] font-mono text-cyan-400 tracking-widest uppercase">
      {connected ? (mode === 'LIVE' ? `${latency}MS` : 'SIM') : 'OFF'}
    </span>
  </div>
);

const SidebarItem = ({ icon: Icon, label, price, change, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`group w-full flex items-center justify-between px-4 py-4 mb-2 transition-all duration-300 relative border-l-2
      ${active 
        ? 'bg-gradient-to-r from-cyan-900/20 to-transparent border-cyan-400' 
        : 'border-transparent hover:bg-white/[0.02]'
      }`}
  >
    <div className="flex items-center gap-3">
      <Icon className={`w-5 h-5 transition-transform duration-300 ${active ? 'text-cyan-400 scale-110 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]' : 'text-zinc-600 grayscale group-hover:grayscale-0'}`} />
      <div className="text-left flex flex-col">
        <span className={`text-sm font-black tracking-widest leading-none mb-1 ${active ? 'text-white' : 'text-zinc-500'}`}>{label}</span>
        <span className="text-[9px] font-mono opacity-50 leading-none">PERP</span>
      </div>
    </div>
    <div className="text-right">
      <span className={`block text-xs font-mono font-bold opacity-90 mb-0.5 ${active ? 'text-cyan-100' : 'text-zinc-400'}`}>
        {price ? `$${Number(price).toLocaleString()}` : '---'}
      </span>
      <span className={`text-[9px] font-mono tracking-tight ${change >= 0 ? 'text-cyan-400' : 'text-rose-500'}`}>
        {change > 0 ? '+' : ''}{change}%
      </span>
    </div>
  </button>
);

const OrderBookRow = ({ price, size, total, type, maxTotal }) => {
  const safePrice = price || 0;
  const safeSize = size || 0;
  const safeTotal = total || 0;
  const widthPercentage = maxTotal > 0 ? (safeTotal / maxTotal) * 100 : 0;
  
  return (
    <div className="flex justify-between text-[10px] font-mono py-0.5 relative group cursor-pointer hover:bg-white/5 px-3">
      <div 
        className={`absolute top-0 bottom-0 opacity-10 transition-all duration-500 ${type === 'buy' ? 'right-0 bg-cyan-400' : 'right-0 bg-rose-500'}`} 
        style={{ width: `${widthPercentage}%` }} 
      />
      <span className={`relative z-10 ${type === 'buy' ? 'text-cyan-400' : 'text-rose-400'}`}>
        {safePrice.toFixed(2)}
      </span>
      <span className="relative z-10 text-zinc-600 group-hover:text-zinc-300">{safeSize.toFixed(3)}</span>
      <span className="relative z-10 text-zinc-700 group-hover:text-zinc-400">{safeTotal.toFixed(3)}</span>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('BTC');
  const [timeframe, setTimeframe] = useState('1H'); // New State for Timeframe
  
  const [prices, setPrices] = useState({
    BTC: 64230.50,
    ETH: 3450.12,
    SOL: 148.50
  });
  
  const [price, setPrice] = useState(prices['BTC']);
  const [prevPrice, setPrevPrice] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [connected, setConnected] = useState(false);
  const [flash, setFlash] = useState(null); 
  const [mode, setMode] = useState('CONNECTING');
  const [chartType, setChartType] = useState('CANDLE'); 

  useEffect(() => {
    setChartData([]);
    setPrice(prices[activeTab]);
    setConnected(false);
    setMode('CONNECTING');

    let ws = null;
    let simulationInterval = null;
    let fallbackTimeout = null;

    const createDataPoint = (price, time) => {
      const volatility = price * 0.0002;
      return {
        time: time,
        value: price,
        open: price - (Math.random() - 0.5) * volatility,
        close: price + (Math.random() - 0.5) * volatility,
        high: price + volatility * 1.5,
        low: price - volatility * 1.5,
      };
    };

    const startSimulation = (initialPrice) => {
      setMode('SIMULATED');
      setConnected(true);
      let currentSimPrice = initialPrice || (activeTab === 'BTC' ? 45000 : activeTab === 'ETH' ? 2200 : 98);
      
      simulationInterval = setInterval(() => {
        const volatility = currentSimPrice * 0.0005; 
        const change = (Math.random() - 0.5) * volatility;
        currentSimPrice += change;
        
        setPrice(prev => {
          setPrevPrice(prev);
          setFlash(currentSimPrice > prev ? 'up' : currentSimPrice < prev ? 'down' : null);
          return currentSimPrice;
        });
        
        setPrices(prev => ({ ...prev, [activeTab]: currentSimPrice }));

        setChartData(prev => {
          const newDataPoint = createDataPoint(currentSimPrice, new Date().toLocaleTimeString());
          newDataPoint.body = [Math.min(newDataPoint.open, newDataPoint.close), Math.max(newDataPoint.open, newDataPoint.close)];
          
          const newData = [...prev, newDataPoint];
          if (newData.length > 50) newData.shift();
          return newData;
        });
        
        setTimeout(() => setFlash(null), 200);
      }, 1000);
    };

    try {
      ws = new WebSocket(`${BINANCE_WS_URL}/${PAIRS[activeTab]}@trade`);

      ws.onopen = () => {
        setConnected(true);
        fallbackTimeout = setTimeout(() => {
           if (mode === 'CONNECTING') {
             ws.close();
             startSimulation(prices[activeTab]);
           }
        }, 3000);
      };

      ws.onerror = (e) => {
        console.log('WS Error, switching to sim', e);
        startSimulation(prices[activeTab]);
      };
      
      ws.onmessage = (event) => {
        if (fallbackTimeout) clearTimeout(fallbackTimeout);
        setMode('LIVE');
        
        try {
          const data = JSON.parse(event.data);
          const newPrice = parseFloat(data.p);
          
          if (!isNaN(newPrice)) {
            setPrice(prev => {
              setPrevPrice(prev);
              setFlash(newPrice > prev ? 'up' : newPrice < prev ? 'down' : null);
              return newPrice;
            });
            
            setPrices(prev => ({ ...prev, [activeTab]: newPrice }));

            setChartData(prev => {
              const newDataPoint = createDataPoint(newPrice, new Date(data.T).toLocaleTimeString());
              newDataPoint.body = [Math.min(newDataPoint.open, newDataPoint.close), Math.max(newDataPoint.open, newDataPoint.close)];
              
              const newData = [...prev, newDataPoint];
              if (newData.length > 50) newData.shift(); 
              return newData;
            });
            
            setTimeout(() => setFlash(null), 200);
          }
        } catch (err) {
          console.error("Data Parse Error", err);
        }
      };
    } catch (err) {
      console.error("Connection Error", err);
      startSimulation(prices[activeTab]);
    }

    return () => {
      if (ws) ws.close();
      if (simulationInterval) clearInterval(simulationInterval);
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
    };
  }, [activeTab, timeframe]); // Reloads when timeframe changes

  const priceColor = flash === 'up' ? 'text-cyan-400' : flash === 'down' ? 'text-rose-500' : 'text-white';
  const glowClass = flash === 'up' ? 'drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]' : flash === 'down' ? 'drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]' : '';

  const commonChartProps = {
    data: chartData,
    margin: { top: 10, right: 10, left: 0, bottom: 0 }
  };

  return (
    <div className="fixed inset-0 bg-black text-zinc-400 font-sans selection:bg-cyan-500/20 overflow-hidden flex flex-col relative">
      
      {/* Styles for custom animations */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        .animate-float { animation: float 10s ease-in-out infinite; }
        .bg-breathe { animation: breathe 8s ease-in-out infinite; }
      `}</style>

      {/* Cinematic Background - Alive */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[100%] bg-blue-900/20 blur-[150px] rounded-full animate-float" />
         <div className="absolute bottom-[-50%] right-[-20%] w-[80%] h-[80%] bg-cyan-900/10 blur-[150px] rounded-full animate-float" style={{ animationDelay: '2s' }} />
         
         {/* Tech Grid */}
         <div 
           className="absolute inset-0 opacity-[0.05]" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)', 
             backgroundSize: '60px 60px',
             maskImage: 'radial-gradient(circle at center, black, transparent 90%)'
           }} 
         />
      </div>
      
      {/* Header */}
      <nav className="h-16 flex items-center justify-between px-6 z-50 shrink-0 border-b border-white/5 bg-black/60 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-9 h-9 rounded-none bg-cyan-500/10 border border-cyan-500/50 flex items-center justify-center text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all duration-300">
              <Crosshair size={20} className="text-cyan-400 animate-[spin_10s_linear_infinite]" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter text-white leading-none italic">APEX</span>
              <span className="text-[8px] font-bold text-cyan-500 tracking-[0.4em] uppercase">Protocol</span>
            </div>
          </div>
          
          <div className="h-6 w-[1px] bg-white/10 skew-x-12" />
          
          <div className="hidden md:flex gap-4">
            {['TERMINAL', 'DEFI', 'NFT'].map(item => (
              <button key={item} className="text-[10px] font-bold text-zinc-500 hover:text-cyan-400 transition-colors tracking-widest relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-cyan-400 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <StatusBadge connected={connected} latency={32} mode={mode} />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-900/20 border border-cyan-500/30 rounded-sm cursor-pointer hover:bg-cyan-900/30 transition-all group">
            <Wallet size={12} className="text-cyan-400" /> 
            <span className="text-[10px] font-bold text-cyan-100 tracking-wider group-hover:text-white">CONNECT</span>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex gap-4 p-4 overflow-hidden relative z-10">
        
        {/* Left Rail */}
        <TechPanel className="w-[280px] hidden md:flex flex-col p-2">
          <div className="p-3 mb-2 flex items-center justify-between border-b border-white/5">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Globe size={12} className="text-cyan-500" /> Assets
            </span>
            <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pt-2">
            {Object.keys(PAIRS).map((symbol) => (
              <SidebarItem 
                key={symbol}
                icon={COIN_ICONS[symbol]} 
                label={symbol} 
                price={prices[symbol]} 
                change={symbol === activeTab ? 2.4 : -1.2} 
                active={activeTab === symbol} 
                onClick={() => setActiveTab(symbol)} 
              />
            ))}
          </div>
        </TechPanel>

        {/* Center Stage */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          
          {/* Ticker & Controls */}
          <TechPanel className="h-20 flex items-center justify-between px-8 shrink-0">
            <div className="flex items-center gap-8">
               <div className="flex flex-col">
                 <h1 className="text-3xl font-black tracking-tighter text-white flex items-center gap-2 italic">
                   {activeTab}<span className="text-zinc-700 not-italic">/</span>USD 
                 </h1>
               </div>
               
               <div className={`transition-all duration-200 ${priceColor}`}>
                 <div className={`text-4xl font-mono font-bold tracking-tighter flex items-center gap-4 ${glowClass}`}>
                   ${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                   {flash && (flash === 'up' ? <ArrowUpRight size={32} /> : <ArrowDownRight size={32} />)}
                 </div>
               </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex bg-black/40 p-1 border border-white/5 rounded-sm">
                {[
                  { id: 'AREA', icon: Activity },
                  { id: 'LINE', icon: TrendingUp },
                  { id: 'CANDLE', icon: AlignJustify, rotate: true },
                  { id: 'RENKO', icon: Blocks }
                ].map((type) => (
                  <button 
                    key={type.id}
                    onClick={() => setChartType(type.id)}
                    className={`p-2 transition-all rounded-sm ${chartType === type.id ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'text-zinc-600 hover:text-white'}`}
                  >
                    <type.icon size={16} className={type.rotate ? 'rotate-90' : ''} />
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                {['15m', '1H', '4H', '1D'].map((tf) => (
                  <button 
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 text-[10px] font-bold border rounded-sm transition-all ${timeframe === tf ? 'text-cyan-400 border-cyan-500/50 bg-cyan-950/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'text-zinc-600 border-transparent hover:text-zinc-300'}`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
          </TechPanel>

          {/* Main Chart */}
          <TechPanel className="flex-1 min-h-0">
            <div className="absolute inset-0">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'AREA' ? (
                    <AreaChart {...commonChartProps}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="time" hide />
                      <YAxis domain={['auto', 'auto']} orientation="right" stroke="#333" tick={{fill: '#555', fontSize: 10, fontFamily: 'monospace'}} tickFormatter={(val) => val.toFixed(1)} axisLine={false} tickLine={false} width={60} />
                      <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#333', color: '#fff', fontSize: '12px' }} itemStyle={{ color: '#06b6d4', fontFamily: 'monospace' }} cursor={{ stroke: '#ffffff20', strokeDasharray: '4 4' }} isAnimationActive={false} />
                      <ReferenceLine y={price} stroke="#06b6d4" strokeDasharray="3 3" opacity={0.5} />
                      <Area type="step" dataKey="value" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" isAnimationActive={false} />
                    </AreaChart>
                  ) : chartType === 'LINE' ? (
                    <LineChart {...commonChartProps}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="time" hide />
                      <YAxis domain={['auto', 'auto']} orientation="right" stroke="#333" tick={{fill: '#555', fontSize: 10, fontFamily: 'monospace'}} tickFormatter={(val) => val.toFixed(1)} axisLine={false} tickLine={false} width={60} />
                      <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#333', color: '#fff', fontSize: '12px' }} itemStyle={{ color: '#06b6d4', fontFamily: 'monospace' }} cursor={{ stroke: '#ffffff20', strokeDasharray: '4 4' }} isAnimationActive={false} />
                      <ReferenceLine y={price} stroke="#06b6d4" strokeDasharray="3 3" opacity={0.5} />
                      <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={false} isAnimationActive={false} />
                    </LineChart>
                  ) : chartType === 'CANDLE' ? (
                    <BarChart {...commonChartProps}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="time" hide />
                      <YAxis domain={['auto', 'auto']} orientation="right" stroke="#333" tick={{fill: '#555', fontSize: 10, fontFamily: 'monospace'}} tickFormatter={(val) => val.toFixed(1)} axisLine={false} tickLine={false} width={60} />
                      <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#333', color: '#fff', fontSize: '12px' }} itemStyle={{ color: '#06b6d4', fontFamily: 'monospace' }} cursor={{ fill: 'rgba(255,255,255,0.03)' }} isAnimationActive={false} />
                      <ReferenceLine y={price} stroke="#06b6d4" strokeDasharray="3 3" opacity={0.5} />
                      <Bar dataKey="body" shape={<Candlestick />} isAnimationActive={false} />
                    </BarChart>
                  ) : (
                    <BarChart {...commonChartProps}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="time" hide />
                      <YAxis domain={['auto', 'auto']} orientation="right" stroke="#333" tick={{fill: '#555', fontSize: 10, fontFamily: 'monospace'}} tickFormatter={(val) => val.toFixed(1)} axisLine={false} tickLine={false} width={60} />
                      <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#333', color: '#fff', fontSize: '12px' }} itemStyle={{ color: '#06b6d4', fontFamily: 'monospace' }} cursor={{ fill: 'rgba(255,255,255,0.03)' }} isAnimationActive={false} />
                      <ReferenceLine y={price} stroke="#06b6d4" strokeDasharray="3 3" opacity={0.5} />
                      <Bar dataKey="body" shape={<RenkoBrick />} isAnimationActive={false} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <Scan size={32} className="text-cyan-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-cyan-500/50 animate-pulse tracking-widest uppercase">ESTABLISHING UPLINK...</span>
                </div>
              )}
            </div>
            
            {/* Subtle Watermark */}
            <div className="absolute bottom-6 left-6 text-[120px] font-black text-white/[0.02] pointer-events-none select-none tracking-tighter leading-none italic">
              APEX
            </div>
          </TechPanel>

          {/* Action Deck */}
          <TechPanel className="h-24 flex items-center px-8 gap-8 shrink-0">
             <div className="flex-1 grid grid-cols-2 gap-8">
               <div className="relative group">
                 <span className="absolute -top-2 left-0 text-[9px] font-bold text-cyan-600 uppercase tracking-widest bg-[#050505] px-1">Size (USD)</span>
                 <div className="flex items-center border-b-2 border-white/10 py-2 focus-within:border-cyan-500 transition-colors">
                   <span className="text-zinc-500 text-lg mr-2">$</span>
                   <input type="text" defaultValue="10,000" className="bg-transparent text-xl font-mono text-white w-full outline-none font-bold" />
                 </div>
               </div>
               <div className="relative">
                 <span className="absolute -top-2 left-0 text-[9px] font-bold text-cyan-600 uppercase tracking-widest bg-[#050505] px-1">Leverage</span>
                 <div className="flex items-center justify-between border-b-2 border-white/10 py-2 cursor-pointer hover:border-white/30 transition-colors">
                   <span className="text-xl font-mono text-white font-bold">20x</span>
                   <div className="flex gap-1">
                     {[1,2,3,4,5].map(i => <div key={i} className={`w-1 h-4 skew-x-12 ${i <= 3 ? 'bg-cyan-500' : 'bg-zinc-800'}`} />)}
                   </div>
                 </div>
               </div>
             </div>
             
             <div className="flex gap-4">
               <button className="h-12 px-8 bg-cyan-400 text-black font-black rounded-sm hover:bg-cyan-300 hover:shadow-[0_0_30px_-5px_#22d3ee] transition-all uppercase tracking-widest text-xs relative overflow-hidden group">
                 <span className="relative z-10 flex items-center gap-2">Buy / Long <ArrowUpRight size={14} /></span>
                 <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 skew-x-12" />
               </button>
               <button className="h-12 px-8 bg-transparent border border-rose-500 text-rose-500 font-black rounded-sm hover:bg-rose-500 hover:text-white hover:shadow-[0_0_30px_-5px_#f43f5e] transition-all uppercase tracking-widest text-xs relative overflow-hidden group">
                 <span className="relative z-10 flex items-center gap-2">Sell / Short <ArrowDownRight size={14} /></span>
               </button>
             </div>
          </TechPanel>

        </div>

        {/* Right Rail */}
        <TechPanel className="w-[280px] hidden xl:flex flex-col p-4 gap-4">
          <div className="flex justify-between items-center mb-1 border-b border-white/5 pb-2">
             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
               <Cpu size={12} className="text-cyan-500" /> Order Book
             </span>
             <div className="flex gap-1">
               <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse" />
               <div className="w-1 h-1 rounded-full bg-rose-500 animate-pulse delay-75" />
             </div>
          </div>
          
          <div className="flex-1 overflow-hidden flex flex-col justify-center gap-1 relative">
             {/* Gradient Mask for focus */}
             <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] pointer-events-none z-20 opacity-80" />
             
             <div className="flex flex-col-reverse gap-0.5">
               {[...Array(12)].map((_, i) => (
                 <OrderBookRow 
                   key={i} 
                   type="sell" 
                   price={price + (i * 0.5) + 0.1} 
                   size={Math.random()} 
                   total={Math.random() * 5}
                   maxTotal={5}
                 />
               ))}
             </div>

             <div className="py-4 flex items-center justify-center relative z-30 border-y border-white/5 my-2 bg-white/[0.02]">
                <div className={`text-2xl font-mono font-bold tracking-tighter ${priceColor} drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]`}>
                  {price ? price.toFixed(1) : '---'}
                </div>
             </div>

             <div className="flex flex-col gap-0.5">
               {[...Array(12)].map((_, i) => (
                 <OrderBookRow 
                   key={i} 
                   type="buy" 
                   price={price - (i * 0.5) - 0.1} 
                   size={Math.random()} 
                   total={Math.random() * 5}
                   maxTotal={5}
                 />
               ))}
             </div>
          </div>
        </TechPanel>

      </div>
    </div>
  );
}