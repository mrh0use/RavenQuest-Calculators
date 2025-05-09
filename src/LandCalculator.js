import React, { useState, useEffect } from 'react';

function LandCalculator() {
  // Land types with their base properties
  const landTypes = {
    small: { 
      name: 'Small Estate',
      basePrice: 108,
      resourceCapacity: 1.0,
      maxRooms: 1
    },
    medium: { 
      name: 'Medium Estate',
      basePrice: 510, 
      resourceCapacity: 1.5,
      maxRooms: 2
    },
    large: { 
      name: 'Large Estate',
      basePrice: 2460, 
      resourceCapacity: 2.0,
      maxRooms: 3
    },
    stronghold: { 
      name: 'Stronghold',
      basePrice: 12300, 
      resourceCapacity: 3.0,
      maxRooms: 5
    },
    fort: { 
      name: 'Fort',
      basePrice: 49200, 
      resourceCapacity: 5.0,
      maxRooms: 8
    }
  };
  
  // Perk rarity options
  const perkRarities = [
    { id: 'common', name: 'Common', multiplier: 1.0, supply: 945 },
    { id: 'uncommon', name: 'Uncommon', multiplier: 1.2, supply: 1010 },
    { id: 'grand', name: 'Grand', multiplier: 1.5, supply: 975 },
    { id: 'rare', name: 'Rare', multiplier: 1.8, supply: 627 },
    { id: 'arcane', name: 'Arcane', multiplier: 2.0, supply: 306 },
    { id: 'mythic', name: 'Mythic', multiplier: 2.5, supply: 117 },
    { id: 'legendary', name: 'Legendary', multiplier: 3.0, supply: 20 }
  ];
  
  // State for basic inputs
  const [landType, setLandType] = useState('small');
  const [landPrice, setLandPrice] = useState(108);
  const [perkRarity, setPerkRarity] = useState('common');
  const [questPrice, setQuestPrice] = useState(0.0827);
  const [silverEarnedPerHarvest, setSilverEarnedPerHarvest] = useState(500);
  const [costPerHarvest, setCostPerHarvest] = useState(100);
  const [harvestsPerDay, setHarvestsPerDay] = useState(4);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [silverConversionRate, setSilverConversionRate] = useState(8400);
  
  // State for UI controls
  const [expandedSections, setExpandedSections] = useState({
    landDetails: true,
    farming: true,
    financials: true
  });
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  // State for results
  const [results, setResults] = useState({
    dailySilver: 0,
    weeklyIncome: 0,
    monthlyIncome: 0,
    annualIncome: 0,
    roi: 0,
    breakEvenDays: 0,
    breakEvenWeeks: 0
  });
  
  // Update land price when land type changes
  useEffect(() => {
    setLandPrice(landTypes[landType].basePrice);
  }, [landType]);
  
  // Calculate results when inputs change
  useEffect(() => {
    calculateResults();
  }, [
    landType, 
    landPrice, 
    questPrice, 
    daysPerWeek, 
    silverEarnedPerHarvest,
    costPerHarvest,
    harvestsPerDay,
    silverConversionRate,
    perkRarity
  ]);
  
  // Function to calculate investment results
  const calculateResults = () => {
    // Base values
    const selectedLand = landTypes[landType];
    const selectedPerk = perkRarities.find(perk => perk.id === perkRarity);
    
    // Calculate net income from resources (revenue minus costs, affected by land type and perk rarity)
    const netSilverPerHarvest = (silverEarnedPerHarvest - costPerHarvest) * selectedLand.resourceCapacity * selectedPerk.multiplier;
    const dailySilver = netSilverPerHarvest * harvestsPerDay;
    
    // Weekly and monthly silver (adjusted for days played per week)
    const weeklySilver = dailySilver * daysPerWeek;
    
    // Total weekly income
    const weeklyIncome = weeklySilver / silverConversionRate * questPrice;
    
    // Monthly and annual income
    const monthlyIncome = weeklyIncome * 4.33; // Average weeks per month
    const annualIncome = weeklyIncome * 52;
    
    // Initial investment
    const initialInvestment = landPrice;
    
    // ROI (Return on Investment) - Annual return percentage
    const roi = (annualIncome / initialInvestment) * 100;
    
    // Break-even calculations
    const breakEvenDays = initialInvestment / (weeklyIncome / 7);
    const breakEvenWeeks = initialInvestment / weeklyIncome;
    
    // Update results
    setResults({
      dailySilver: parseFloat(dailySilver.toFixed(0)),
      weeklyIncome: parseFloat(weeklyIncome.toFixed(2)),
      monthlyIncome: parseFloat(monthlyIncome.toFixed(2)),
      annualIncome: parseFloat(annualIncome.toFixed(2)),
      roi: parseFloat(roi.toFixed(2)),
      breakEvenDays: parseFloat(breakEvenDays.toFixed(0)),
      breakEvenWeeks: parseFloat(breakEvenWeeks.toFixed(1))
    });
  };
  
  return (
    <div className="p-2 sm:p-4 bg-gray-900 rounded-lg shadow-lg border border-teal-400 text-white">
      <div className="flex flex-col items-center justify-center mb-4 sm:mb-6">
        <div className="mb-2 sm:mb-4">
          <img
            src="https://pbs.twimg.com/media/GnjKTsvaAAA7kiu.png"
            alt="RavenQuest Logo"
            className="h-12 sm:h-16"
          />
        </div>
        <div className="flex items-center justify-center">
          <h2 className="text-lg sm:text-xl font-medium text-yellow-500">
            Land Investment Calculator
          </h2>
        </div>
      </div>
      
      {/* Main Content - Made responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Section */}
        <div className="bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-teal-300">Investment Parameters</h3>
          
          {/* Land Details Section */}
          <div className="mb-3 sm:mb-4 border border-gray-700 rounded-lg overflow-hidden">
            <div 
              className="bg-gray-700 p-2 flex justify-between items-center cursor-pointer"
              onClick={() => setExpandedSections({...expandedSections, landDetails: !expandedSections.landDetails})}
            >
              <h4 className="font-medium text-teal-300">Land Details</h4>
              <span>{expandedSections.landDetails ? '▼' : '▶'}</span>
            </div>
            
            {expandedSections.landDetails && (
              <div className="p-3">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Land Type</label>
                  <select
                    value={landType}
                    onChange={(e) => setLandType(e.target.value)}
                    className="p-2 w-full bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-400"
                  >
                    {Object.keys(landTypes).map(type => (
                      <option key={type} value={type}>
                        {landTypes[type].name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Land Price (USDC)</label>
                  <input
                    type="number"
                    value={landPrice}
                    onChange={(e) => setLandPrice(Number(e.target.value))}
                    className="p-2 w-full bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">Current marketplace price (NFTs are purchased with USDC on secondary markets)</p>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Land Perk Rarity</label>
                  <select
                    value={perkRarity}
                    onChange={(e) => setPerkRarity(e.target.value)}
                    className="p-2 w-full bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-400"
                  >
                    {perkRarities.map(perk => (
                      <option key={perk.id} value={perk.id}>
                        {perk.name} (×{perk.multiplier} multiplier, {perk.supply} exist)
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Land perks give various bonuses. Rarity determines perk strength.
                  </p>
                </div>
                
                <div className="mt-2">
                  <a 
                    href="https://tokentrove.com/collection/RavenQuestLand" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-teal-400 hover:text-teal-300 underline"
                  >
                    View current marketplace prices on TokenTrove
                  </a>
                </div>
              </div>
            )}
          </div>
          
          {/* Farming Section */}
          <div className="mb-3 sm:mb-4 border border-gray-700 rounded-lg overflow-hidden">
            <div 
              className="bg-gray-700 p-2 flex justify-between items-center cursor-pointer"
              onClick={() => setExpandedSections({...expandedSections, farming: !expandedSections.farming})}
            >
              <h4 className="font-medium text-teal-300">Farming</h4>
              <span>{expandedSections.farming ? '▼' : '▶'}</span>
            </div>
            
            {expandedSections.farming && (
              <div className="p-3">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Cost Per Harvest (Silver)</label>
                  <input
                    type="number"
                    value={costPerHarvest}
                    onChange={(e) => setCostPerHarvest(Number(e.target.value))}
                    className="p-2 w-full bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">Costs involved in each harvest (seeds, materials, etc.)</p>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Silver Earned Per Harvest</label>
                  <input
                    type="number"
                    value={silverEarnedPerHarvest}
                    onChange={(e) => setSilverEarnedPerHarvest(Number(e.target.value))}
                    className="p-2 w-full bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">Total silver earned from a single harvest</p>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Harvests Per Day</label>
                  <input
                    type="number"
                    value={harvestsPerDay}
                    onChange={(e) => setHarvestsPerDay(Number(e.target.value))}
                    className="p-2 w-full bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">How many times you harvest resources per day</p>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Days Per Week Played</label>
                  <input
                    type="number"
                    value={daysPerWeek}
                    onChange={(e) => setDaysPerWeek(Math.max(1, Math.min(7, Number(e.target.value))))}
                    className="p-2 w-full bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-400"
                    min="1"
                    max="7"
                  />
                  <p className="text-xs text-gray-500 mt-1">How many days per week you play and harvest resources</p>
                </div>
                
                {/* Wiki link was removed from here */}
                
              </div>
            )}
          </div>
          
          {/* Financials Section */}
          <div className="mb-3 sm:mb-4 border border-gray-700 rounded-lg overflow-hidden">
            <div 
              className="bg-gray-700 p-2 flex justify-between items-center cursor-pointer"
              onClick={() => setExpandedSections({...expandedSections, financials: !expandedSections.financials})}
            >
              <h4 className="font-medium text-teal-300">Financials</h4>
              <span>{expandedSections.financials ? '▼' : '▶'}</span>
            </div>
            
            {expandedSections.financials && (
              <div className="p-3">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-300 mb-1">$QUEST Token Price (USD)</label>
                  <input
                    type="number"
                    value={questPrice}
                    step="0.001"
                    onChange={(e) => setQuestPrice(Number(e.target.value))}
                    className="p-2 w-full bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">Current price: ~$0.08 USD</p>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Silver to $QUEST Conversion Rate</label>
                  <input
                    type="number"
                    value={silverConversionRate}
                    onChange={(e) => setSilverConversionRate(Number(e.target.value))}
                    className="p-2 w-full bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">Silver required to get 1 $QUEST token</p>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setShowAnalysis(true)}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 mt-3"
          >
            Generate Analysis
          </button>
        </div>
        
        {/* Results Section */}
        <div className="bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-teal-300">Investment Analysis</h3>
          
          {!showAnalysis ? (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-gray-400 mb-4 text-center">Enter your investment parameters and click "Generate Analysis" to see your results.</p>
              <button
                onClick={() => setShowAnalysis(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
              >
                Generate Analysis Now
              </button>
            </div>
          ) : (
            <>
              {/* Basic Results Panel */}
              <div className="bg-gray-700 p-3 rounded mb-3 sm:mb-4">
                <h4 className="font-medium text-yellow-400 mb-2">Investment Summary</h4>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <p className="text-sm text-gray-400">Initial Investment</p>
                    <p className="text-base sm:text-lg text-white font-semibold">
                      ${landPrice} USDC
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Annual Return</p>
                    <p className="text-base sm:text-lg text-yellow-400 font-semibold">
                      ${results.annualIncome.toLocaleString()}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400">
                      ({(results.annualIncome / questPrice).toFixed(2)} $QUEST)
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-400">ROI (Annual)</p>
                    <p className={`text-base sm:text-lg font-semibold ${results.roi < 50 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {results.roi}%
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Break-even Time</p>
                    <p className={`text-base sm:text-lg font-semibold ${results.breakEvenWeeks > 20 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {results.breakEvenWeeks <= 4 ? `${results.breakEvenDays} days` : `${results.breakEvenWeeks} weeks`}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Income Breakdown */}
              <div className="bg-gray-700 p-3 rounded mb-3 sm:mb-4">
                <h4 className="font-medium text-yellow-400 mb-2">Income Breakdown</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm sm:text-base text-gray-300">Net Silver Per Day:</span>
                    <span className="text-sm sm:text-base text-white font-medium">{results.dailySilver?.toLocaleString() || 0} Silver</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm sm:text-base text-gray-300">Weekly Income:</span>
                    <span className="text-sm sm:text-base text-white font-medium">${results.weeklyIncome}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm sm:text-base text-gray-300">Monthly Income:</span>
                    <span className="text-sm sm:text-base text-white font-medium">${results.monthlyIncome}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm sm:text-base text-gray-300">Annual Income:</span>
                    <span className="text-sm sm:text-base text-white font-medium">${results.annualIncome}</span>
                  </div>
                </div>
              </div>
              
              {/* Land Details Panel */}
              <div className="bg-gray-700 p-3 rounded">
                <h4 className="font-medium text-yellow-400 mb-2">Land Details</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm sm:text-base text-gray-300">Type:</span>
                    <span className="text-sm sm:text-base text-white font-medium">{landTypes[landType].name}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm sm:text-base text-gray-300">Original Sale Price:</span>
                    <span className="text-sm sm:text-base text-white font-medium">${landTypes[landType].basePrice} USDC</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm sm:text-base text-gray-300">Resource Capacity:</span>
                    <span className="text-sm sm:text-base text-white font-medium">{landTypes[landType].resourceCapacity}x</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm sm:text-base text-gray-300">Max Rooms:</span>
                    <span className="text-sm sm:text-base text-white font-medium">{landTypes[landType].maxRooms}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm sm:text-base text-gray-300">Perk Multiplier:</span>
                    <span className="text-sm sm:text-base text-white font-medium">
                      {perkRarities.find(perk => perk.id === perkRarity).multiplier}x
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="text-xs sm:text-sm text-gray-400 mt-3 sm:mt-4 text-center">
        Note: This calculator provides estimates based on your inputs. Actual in-game values may vary.
        Nothing on this site is intended as legal or financial advice.
      </div>
    </div>
  );
}

export default LandCalculator;