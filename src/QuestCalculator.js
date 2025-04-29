import React, { useState } from 'react';

function QuestCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState('present-value');
  
  // Earnings calculator state
  const [silver, setSilver] = useState(100000);
  const [questPrice, setQuestPrice] = useState(0.084);
  const [conversionRate, setConversionRate] = useState(3100);
  const [timeUnit, setTimeUnit] = useState('day');
  const [hoursPerTimeUnit, setHoursPerTimeUnit] = useState(4);
  
  // Present value calculator state
  const [currentSilver, setCurrentSilver] = useState(1000000);
  const [currentQuestPrice, setCurrentQuestPrice] = useState(0.084);
  const [silverConversionRate, setSilverConversionRate] = useState(3100);
  
  // Predefined scenarios for earnings calc
  const scenarios = [
    { name: "Current Price", price: questPrice },
    { name: "Launch Price", price: 0.06 }
  ];
  
  // Conversion rates for earnings calc
  const conversionRates = [
    { name: "Current Rate", rate: conversionRate }
  ];
  
  // Present value conversion rates
  const pvConversionRates = [
    { name: "Current Rate", rate: silverConversionRate }
  ];
  
  // Price scenarios for present value
  const priceScenarios = [
    { name: "Current Price", price: currentQuestPrice },
    { name: "All-Time High ($0.45)", price: 0.45 },
    { name: "Launch Price ($0.06)", price: 0.06 }
  ];
  
  // Time unit options
  const timeUnits = [
    { value: 'hour', label: 'Hour' },
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' }
  ];
  
  // Calculate hourly rate for better comparison
  const hoursInTimeUnit = timeUnit === 'hour' ? 1 : hoursPerTimeUnit;
  const silverPerHour = silver / hoursInTimeUnit;
  
  return (
    <div className="p-4 max-w-xl mx-auto bg-gray-900 rounded-lg shadow-lg border border-teal-400">
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="mb-4">
          <img 
            src="https://pbs.twimg.com/media/GnjKTsvaAAA7kiu.png" 
            alt="RavenQuest Logo" 
            className="h-16" 
          />
        </div>
        <div className="flex items-center justify-center mt-2">
          <img 
            src="https://coin-images.coingecko.com/coins/images/55071/large/token_200x200.png?1743598440" 
            alt="$QUEST Token Logo" 
            className="h-10 mr-2" 
          />
          <h2 className="text-xl font-medium text-yellow-500">
            Earnings Calculator
          </h2>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-teal-800 mb-4">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'present-value' ? 'text-teal-300 border-b-2 border-teal-400' : 'text-gray-400 hover:text-gray-300'}`}
          onClick={() => setActiveTab('present-value')}
        >
          Present Value Calculator
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'earnings' ? 'text-teal-300 border-b-2 border-teal-400' : 'text-gray-400 hover:text-gray-300'}`}
          onClick={() => setActiveTab('earnings')}
        >
          Earnings Calculator
        </button>
      </div>
      
      {/* Present Value Calculator Tab */}
      {activeTab === 'present-value' && (
        <>
          <div className="mb-4">
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-300">Amount of Silver Held</label>
              <input
                type="number"
                value={currentSilver}
                onChange={(e) => setCurrentSilver(Number(e.target.value))}
                className="mt-1 p-2 w-full bg-gray-800 border border-gray-700 rounded text-white focus:border-teal-400 focus:ring focus:ring-teal-400 focus:ring-opacity-50"
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-300">Current $QUEST Token Price (USD)</label>
              <input
                type="number"
                value={currentQuestPrice}
                onChange={(e) => setCurrentQuestPrice(Number(e.target.value))}
                className="mt-1 p-2 w-full bg-gray-800 border border-gray-700 rounded text-white focus:border-teal-400 focus:ring focus:ring-teal-400 focus:ring-opacity-50"
                step="0.001"
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-300">Silver to $QUEST Conversion Rate</label>
              <input
                type="number"
                value={silverConversionRate}
                onChange={(e) => setSilverConversionRate(Number(e.target.value))}
                className="mt-1 p-2 w-full bg-gray-800 border border-gray-700 rounded text-white focus:border-teal-400 focus:ring focus:ring-teal-400 focus:ring-opacity-50"
              />
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded mb-4 border border-teal-900">
            <h2 className="text-lg font-semibold mb-2 text-teal-300">Current Value</h2>
            <p className="mb-1 text-gray-300">$QUEST Tokens: <span className="font-bold text-yellow-400">{(currentSilver / silverConversionRate).toFixed(2)}</span></p>
            <p className="text-gray-300">USD Value: <span className="font-bold text-yellow-400">${((currentSilver / silverConversionRate) * currentQuestPrice).toFixed(2)}</span></p>
          </div>
          
          <div className="bg-gray-800 p-4 rounded border border-teal-900">
            <h2 className="text-lg font-semibold mb-2 text-teal-300">Value Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="p-2 text-left text-gray-300">Scenario</th>
                    <th className="p-2 text-right text-gray-300">$QUEST Tokens</th>
                    <th className="p-2 text-right text-gray-300">USD Value</th>
                  </tr>
                </thead>
                <tbody>
                  {priceScenarios.map((scenario, index) => (
                    <tr key={`pv-current-${scenario.name}`} className={index !== priceScenarios.length - 1 ? 'border-b border-gray-700' : ''}>
                      <td className="p-2 text-gray-300">Current Rate @ {scenario.name}</td>
                      <td className="p-2 text-right text-yellow-400">{(currentSilver / silverConversionRate).toFixed(2)}</td>
                      <td className="p-2 text-right text-yellow-400">${((currentSilver / silverConversionRate) * scenario.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
      {/* Earnings Calculator Tab */}
      {activeTab === 'earnings' && (
        <>
          <div className="mb-4">
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-300">Silver Earned</label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={silver}
                  onChange={(e) => setSilver(Number(e.target.value))}
                  className="mt-1 p-2 flex-grow bg-gray-800 border border-gray-700 rounded text-white focus:border-teal-400 focus:ring focus:ring-teal-400 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-400">per</span>
                <select 
                  value={timeUnit}
                  onChange={(e) => setTimeUnit(e.target.value)}
                  className="ml-1 p-2 bg-gray-800 border border-gray-700 rounded text-white focus:border-teal-400 focus:ring focus:ring-teal-400 focus:ring-opacity-50"
                >
                  {timeUnits.map(unit => (
                    <option key={unit.value} value={unit.value}>{unit.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {timeUnit !== 'hour' && (
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-300">Active Hours per {timeUnit.charAt(0).toUpperCase() + timeUnit.slice(1)}</label>
                <input
                  type="number"
                  value={hoursPerTimeUnit}
                  onChange={(e) => setHoursPerTimeUnit(Number(e.target.value))}
                  className="mt-1 p-2 w-full bg-gray-800 border border-gray-700 rounded text-white focus:border-teal-400 focus:ring focus:ring-teal-400 focus:ring-opacity-50"
                />
              </div>
            )}
            
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-300">Current $QUEST Token Price (USD)</label>
              <input
                type="number"
                value={questPrice}
                onChange={(e) => setQuestPrice(Number(e.target.value))}
                className="mt-1 p-2 w-full bg-gray-800 border border-gray-700 rounded text-white focus:border-teal-400 focus:ring focus:ring-teal-400 focus:ring-opacity-50"
                step="0.001"
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-300">Current Conversion Rate (Silver to 1 $QUEST)</label>
              <input
                type="number"
                value={conversionRate}
                onChange={(e) => setConversionRate(Number(e.target.value))}
                className="mt-1 p-2 w-full bg-gray-800 border border-gray-700 rounded text-white focus:border-teal-400 focus:ring focus:ring-teal-400 focus:ring-opacity-50"
              />
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded mb-4 border border-teal-900">
            <h2 className="text-lg font-semibold mb-2 text-teal-300">Current Results</h2>
            <p className="mb-1 text-gray-300">$QUEST Tokens per {timeUnit}: <span className="font-bold text-yellow-400">{(silver / conversionRate).toFixed(2)}</span></p>
            <p className="mb-1 text-gray-300">USD Value per {timeUnit}: <span className="font-bold text-yellow-400">${((silver / conversionRate) * questPrice).toFixed(2)}</span></p>
            <p className="text-gray-300">Equivalent per hour: <span className="font-bold text-yellow-400">${((silverPerHour / conversionRate) * questPrice).toFixed(2)}</span></p>
          </div>
          
          <div className="bg-gray-800 p-4 rounded border border-teal-900">
            <h2 className="text-lg font-semibold mb-2 text-teal-300">Earnings Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="p-2 text-left text-gray-300">Scenario</th>
                    <th className="p-2 text-right text-gray-300">Tokens</th>
                    <th className="p-2 text-right text-gray-300">USD Value</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarios.map((scenario, index) => (
                    <tr key={`curr-rate-${scenario.name}`} className={index !== scenarios.length - 1 ? 'border-b border-gray-700' : ''}>
                      <td className="p-2 text-gray-300">Current Rate @ {scenario.name}</td>
                      <td className="p-2 text-right text-yellow-400">{(silver / conversionRate).toFixed(2)}</td>
                      <td className="p-2 text-right text-yellow-400">${((silver / conversionRate) * scenario.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
      <div className="text-sm text-gray-400 mt-4 text-center">
        Note: This calculator is for estimation purposes. Actual values may vary based on game mechanics and market conditions. Nothing on this site is intended as legal or financial advice.
      </div>
    </div>
  );
}

export default QuestCalculator;