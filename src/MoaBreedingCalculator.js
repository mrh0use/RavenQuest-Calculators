import React, { useState, useEffect } from 'react';

function MoaBreedingCalculator() {
  // State for parent Moa details
  const [parent1Tier, setParent1Tier] = useState(1);
  const [parent2Tier, setParent2Tier] = useState(1);
  const [parent1Color, setParent1Color] = useState('yellow');
  const [parent2Color, setParent2Color] = useState('yellow');
  const [breedingSkill, setBreedingSkill] = useState(1);

  // Tier unlock levels
  const tierUnlockLevels = {
    1: 0,  // Tier 1 unlocks at breeding level 0
    2: 10, // Tier 2 unlocks at breeding level 10
    3: 20, // Tier 3 unlocks at breeding level 20
    4: 30, // Tier 4 unlocks at breeding level 30
    5: 40, // Tier 5 unlocks at breeding level 40
    6: 55, // Tier 6 unlocks at breeding level 55
    7: 70, // Tier 7 unlocks at breeding level 70
  };

  // All possible tiers
  const tiers = [1, 2, 3, 4, 5, 6, 7];

  // Filter available tiers based on breeding skill
  const availableTiers = tiers.filter((tier) => breedingSkill >= tierUnlockLevels[tier]);

  // Adjust parent tiers if breeding skill changes and current tiers are not available
  useEffect(() => {
    const highestAvailableTier = availableTiers.length > 0 ? Math.max(...availableTiers) : 1;
    if (parent1Tier > highestAvailableTier) {
      setParent1Tier(highestAvailableTier);
    }
    if (parent2Tier > highestAvailableTier) {
      setParent2Tier(highestAvailableTier);
    }
  }, [breedingSkill, parent1Tier, parent2Tier, availableTiers]);

  // Options for dropdowns
  const colors = ['yellow', 'brown', 'green', 'purple', 'blue', 'violet', 'white', 'red', 'black'];

  // Stat ranges by tier
  const statRanges = {
    1: { strength: [35, 50], weight: [50, 55], height: [130, 140], speed: [310, 335], breeding: [1, 2], stamina: [50, 80] },
    2: { strength: [50, 65], weight: [55, 60], height: [140, 150], speed: [340, 365], breeding: [1, 3], stamina: [70, 100] },
    3: { strength: [65, 85], weight: [60, 65], height: [150, 160], speed: [370, 395], breeding: [2, 4], stamina: [90, 120] },
    4: { strength: [85, 105], weight: [65, 70], height: [160, 170], speed: [400, 425], breeding: [3, 5], stamina: [110, 140] },
    5: { strength: [105, 125], weight: [70, 75], height: [170, 180], speed: [430, 455], breeding: [4, 6], stamina: [130, 170] },
    6: { strength: [125, 150], weight: [75, 80], height: [180, 190], speed: [460, 485], breeding: [5, 7], stamina: [150, 200] },
    7: { strength: [150, 180], weight: [80, 85], height: [190, 200], speed: [490, 515], breeding: [6, 8], stamina: [170, 230] },
  };

  // Calculate probabilities and offspring stats
  const calculateOutcomes = () => {
    const maxTier = Math.max(parent1Tier, parent2Tier);

    // Offspring tier is always the same as the maximum parent tier
    const offspringTier = maxTier;

    // Color probabilities (no inheritance, full distribution across rarities)
    const colorRarities = {
      yellow: 45, // Common
      brown: 45,  // Common
      green: 5,   // Uncommon
      purple: 2,  // Rare
      blue: 2,    // Rare
      violet: 0.5, // Very Rare
      white: 0.5,  // Very Rare
      red: 0.1,    // Ultra Rare
      black: 0.01, // Mythic Rare
    };
    const rareColorBoost = breedingSkill * 0.05;
    const colorProbabilities = {};
    let totalBaseChance = 0;
    Object.keys(colorRarities).forEach((color) => {
      totalBaseChance += colorRarities[color];
    });

    // Adjust probabilities based on breeding skill
    let totalAdjustedChance = 0;
    Object.keys(colorRarities).forEach((color) => {
      if (color === 'yellow' || color === 'brown') {
        colorProbabilities[color] = colorRarities[color] - (rareColorBoost * (colorRarities[color] / 90));
      } else {
        colorProbabilities[color] = colorRarities[color] + (rareColorBoost * (colorRarities[color] / 10));
      }
      totalAdjustedChance += colorProbabilities[color];
    });

    // Normalize probabilities to sum to 100%
    Object.keys(colorProbabilities).forEach((color) => {
      colorProbabilities[color] = (colorProbabilities[color] / totalAdjustedChance) * 100;
    });

    // Simulate offspring color
    const randomColor = Math.random() * 100;
    let offspringColor;
    let cumulative = 0;
    for (const color in colorProbabilities) {
      cumulative += colorProbabilities[color];
      if (randomColor <= cumulative) {
        offspringColor = color;
        break;
      }
    }

    // Calculate offspring stats
    const tierStats = statRanges[offspringTier];
    const offspringStats = {
      strength: Math.floor(Math.random() * (tierStats.strength[1] - tierStats.strength[0] + 1)) + tierStats.strength[0],
      weight: Math.floor(Math.random() * (tierStats.weight[1] - tierStats.weight[0] + 1)) + tierStats.weight[0],
      height: Math.floor(Math.random() * (tierStats.height[1] - tierStats.height[0] + 1)) + tierStats.height[0],
      speed: Math.floor(Math.random() * (tierStats.speed[1] - tierStats.speed[0] + 1)) + tierStats.speed[0],
      breeding: Math.floor(Math.random() * (tierStats.breeding[1] - tierStats.breeding[0] + 1)) + tierStats.breeding[0],
      stamina: Math.floor(Math.random() * (tierStats.stamina[1] - tierStats.stamina[0] + 1)) + tierStats.stamina[0],
    };

    return { colorProbabilities, offspring: { tier: offspringTier, color: offspringColor, stats: offspringStats } };
  };

  const { colorProbabilities, offspring } = calculateOutcomes();

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
        <h2 className="text-xl font-medium text-yellow-500">Moa Breeding Outcome Calculator</h2>
        <div className="mt-4">
          <img
            src="https://cdn.ravenquest.io/assets/character-register2-BKITUobB.webp"
            alt="Moa Image"
            className="h-24 rounded-lg shadow-md"
          />
        </div>
      </div>

      {/* Breeding Skill Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300">Breeding Skill Level (0-100)</label>
        <input
          type="number"
          value={breedingSkill}
          onChange={(e) => setBreedingSkill(Math.max(0, Math.min(100, Number(e.target.value))))}
          className="mt-1 p-2 w-full bg-gray-800 border border-gray-700 rounded text-white focus:border-teal-400 focus:ring focus:ring-teal-400 focus:ring-opacity-50"
          min="0"
          max="100"
        />
      </div>

      {/* Available Tiers Information */}
      <div className="mb-4 text-sm text-gray-400">
        <p>Available Tiers based on Breeding Skill Level {breedingSkill}:</p>
        <ul className="list-disc list-inside">
          {tiers.map((tier) => (
            <li key={tier} className={breedingSkill >= tierUnlockLevels[tier] ? 'text-teal-300' : 'text-gray-600'}>
              Tier {tier} (Unlocks at level {tierUnlockLevels[tier]})
            </li>
          ))}
        </ul>
      </div>

      {/* Parent Moa Inputs */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-teal-300 mb-2">Parent Moa 1</h3>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-300">Tier</label>
          <select
            value={parent1Tier}
            onChange={(e) => setParent1Tier(Number(e.target.value))}
            className="mt-1 p-2 w-full bg-gray-800 border border-gray-700 rounded text-white focus:border-teal-400 focus:ring focus:ring-teal-400 focus:ring-opacity-50"
          >
            {tiers.map((tier) => (
              <option key={tier} value={tier} disabled={breedingSkill < tierUnlockLevels[tier]}>
                Tier {tier}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-300">Color</label>
          <select
            value={parent1Color}
            onChange={(e) => setParent1Color(e.target.value)}
            className="mt-1 p-2 w-full bg-gray-800 border border-gray-700 rounded text-white focus:border-teal-400 focus:ring focus:ring-teal-400 focus:ring-opacity-50"
          >
            {colors.map((color) => (
              <option key={color} value={color}>
                {color.charAt(0).toUpperCase() + color.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-teal-300 mb-2">Parent Moa 2</h3>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-300">Tier</label>
          <select
            value={parent2Tier}
            onChange={(e) => setParent2Tier(Number(e.target.value))}
            className="mt-1 p-2 w-full bg-gray-800 border border-gray-700 rounded text-white focus:border-teal-400 focus:ring focus:ring-teal-400 focus:ring-opacity-50"
          >
            {tiers.map((tier) => (
              <option key={tier} value={tier} disabled={breedingSkill < tierUnlockLevels[tier]}>
                Tier {tier}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-300">Color</label>
          <select
            value={parent2Color}
            onChange={(e) => setParent2Color(e.target.value)}
            className="mt-1 p-2 w-full bg-gray-800 border border-gray-700 rounded text-white focus:border-teal-400 focus:ring focus:ring-teal-400 focus:ring-opacity-50"
          >
            {colors.map((color) => (
              <option key={color} value={color}>
                {color.charAt(0).toUpperCase() + color.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Display Results */}
      <div className="bg-gray-800 p-4 rounded border border-teal-900">
        <h2 className="text-lg font-semibold mb-2 text-teal-300">Breeding Outcomes</h2>

        <div className="mb-4">
          <h3 className="text-md font-medium text-gray-300">Color Probabilities</h3>
          <p className="text-sm text-gray-400 mb-2">
            Note: Color percentages are our best estimates and may vary in-game, but the stats below are spot-on for your planning needs!
          </p>
          <ul>
            {colors.map((color) => (
              <li key={color} className="text-gray-300">
                {color.charAt(0).toUpperCase() + color.slice(1)}: <span className="font-bold text-yellow-400">{colorProbabilities[color].toFixed(2)}%</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="text-md font-medium text-gray-300">Sample Offspring</h3>
          <p className="text-gray-300">Tier: <span className="font-bold text-yellow-400">{offspring.tier}</span></p>
          <p className="text-gray-300">Color: <span className="font-bold text-yellow-400">{offspring.color.charAt(0).toUpperCase() + offspring.color.slice(1)}</span></p>
          <p className="text-gray-300">Strength: <span className="font-bold text-yellow-400">{offspring.stats.strength}</span> (Affects Tradepack speed)</p>
          <p className="text-gray-300">Weight: <span className="font-bold text-yellow-400">{offspring.stats.weight} kg</span> (Affects size, cosmetic)</p>
          <p className="text-gray-300">Height: <span className="font-bold text-yellow-400">{offspring.stats.height} cm</span> (Affects size, cosmetic)</p>
          <p className="text-gray-300">Speed: <span className="font-bold text-yellow-400">{offspring.stats.speed}</span> (Affects normal riding speed)</p>
          <p className="text-gray-300">Breeding: <span className="font-bold text-yellow-400">{offspring.stats.breeding}</span> (Number of times it can breed)</p>
          <p className="text-gray-300">Stamina: <span className="font-bold text-yellow-400">{offspring.stats.stamina}</span> (Distance for Tradepack delivery in 24h)</p>
        </div>
      </div>

      <div className="text-sm text-gray-400 mt-4 text-center">
        Note: These stats are based on known RavenQuest mechanics, but actual outcomes may vary slightly due to in-game factors.
      </div>
    </div>
  );
}

export default MoaBreedingCalculator;