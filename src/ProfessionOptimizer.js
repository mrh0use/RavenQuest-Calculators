import React, { useState, useEffect } from 'react';
import { professions } from './data/professions'; // Adjust path as needed

function ProfessionOptimizer() {
  const [selectedProfession, setSelectedProfession] = useState('');
  const [userLevel, setUserLevel] = useState(1); // Default to level 1
  const [ingredientPrices, setIngredientPrices] = useState({});
  const [craftAmounts, setCraftAmounts] = useState({}); // Track craft amounts for each recipe
  const [tab, setTab] = useState('xp'); // 'xp' for XP Projections, 'inventory' for Current Inventory
  const [inventory, setInventory] = useState({}); // Track selected items and quantities for Current Inventory
  const [selectedIngredient, setSelectedIngredient] = useState(''); // For dropdown in Current Inventory

  // Collect unique materials for the user's level
  const availableMaterials = new Set();
  let availableOptions = [];
  if (selectedProfession && professions[selectedProfession]) {
    // Use level 1 if userLevel is 0 or empty
    const effectiveLevel = userLevel === '' || userLevel <= 0 ? 1 : parseInt(userLevel, 10);

    // Filter options by user level
    availableOptions = professions[selectedProfession].options
      .filter((option) => option.level <= effectiveLevel)
      .map((option) => {
        // Normalize quantities for display (e.g., "Lesser Health Potion × 10" -> "Lesser Health Potion")
        const match = option.item.match(/(.*) × (\d+)/);
        let itemName = option.item;
        let quantity = 1;
        if (match) {
          itemName = match[1];
          quantity = parseInt(match[2], 10);
        }

        const totalCost = calculateCost(option.materials);
        const totalXp = option.xp; // Total XP for one craft action
        const costPerCraft = totalCost; // Total cost for one craft action
        const roi = costPerCraft > 0 ? (totalXp / costPerCraft) : Infinity; // ROI based on total XP per craft

        // Calculate max crafts for Current Inventory tab
        const maxCrafts = tab === 'inventory' ? calculateMaxCrafts(option.materials) : null;

        return {
          ...option,
          displayItem: itemName,
          craftQuantity: quantity,
          totalXp, // Total XP for one craft action
          costPerCraft,
          totalCost,
          roi,
          maxCrafts,
        };
      });

    // Sort by ROI for recommendations
    availableOptions.sort((a, b) => b.roi - a.roi);

    // Collect materials only from available options
    availableOptions.forEach((option) => {
      option.materials.forEach((mat) => availableMaterials.add(mat.name));
    });
  }
  const materialList = Array.from(availableMaterials).sort();

  // Calculate total cost for a recipe
  function calculateCost(materials) {
    return materials.reduce((total, mat) => {
      const price = ingredientPrices[mat.name] || 0;
      return total + mat.quantity * price;
    }, 0);
  }

  // Calculate max crafts based on inventory (for Current Inventory tab)
  function calculateMaxCrafts(materials) {
    if (!materials || materials.length === 0) return Infinity;
    let maxCrafts = Infinity;
    materials.forEach((mat) => {
      const inv = inventory[mat.name] || { selected: false, quantity: 0 };
      if (inv.selected) {
        const available = inv.quantity || 0;
        const required = mat.quantity;
        const possibleCrafts = Math.floor(available / required);
        maxCrafts = Math.min(maxCrafts, possibleCrafts);
      } else {
        maxCrafts = 0; // If material is not selected, can't craft
      }
    });
    return maxCrafts === Infinity ? 0 : maxCrafts;
  }

  // Handle profession selection
  const handleProfessionChange = (e) => {
    setSelectedProfession(e.target.value);
    setIngredientPrices({}); // Reset prices when profession changes
    setCraftAmounts({}); // Reset craft amounts
    setInventory({}); // Reset inventory
    setSelectedIngredient(''); // Reset dropdown
  };

  // Handle level input
  const handleLevelChange = (e) => {
    const value = e.target.value;
    if (value === '' || (value >= 0 && value <= 82)) {
      setUserLevel(value);
    }
  };

  // Handle craft amount input
  const handleCraftAmountChange = (item, value) => {
    const amount = value === '' ? 0 : Math.max(0, parseInt(value, 10));
    setCraftAmounts((prev) => ({
      ...prev,
      [item]: amount,
    }));
  };

  // Handle price input for ingredients
  const handlePriceChange = (material, price) => {
    setIngredientPrices((prev) => ({
      ...prev,
      [material]: Number(price) || 0,
    }));
  };

  // Handle inventory selection and quantity (for Current Inventory tab)
  const handleInventoryChange = (material, field, value) => {
    setInventory((prev) => ({
      ...prev,
      [material]: {
        ...prev[material],
        [field]: field === 'selected' ? value : Number(value) || 0,
      },
    }));
  };

  // Handle adding an ingredient from the dropdown
  const handleAddIngredient = (material) => {
    if (material && !inventory[material]) {
      setInventory((prev) => ({
        ...prev,
        [material]: { selected: true, quantity: 0 },
      }));
      setSelectedIngredient(''); // Reset dropdown after adding
    }
  };

  // Handle removing an ingredient by clicking on it
  const handleRemoveIngredient = (material) => {
    setInventory((prev) => {
      const updated = { ...prev };
      delete updated[material];
      return updated;
    });
  };

  // Get top 5 recommended options by ROI
  const topRecommended = availableOptions.slice(0, 5);

  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow-lg border border-teal-400 text-white">
      <h2 className="text-2xl font-bold text-yellow-500 mb-6">Profession Optimizer</h2>

      {/* Profession and Level Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-2 text-gray-300 font-medium">Select Profession:</label>
          <select
            value={selectedProfession}
            onChange={handleProfessionChange}
            className="p-3 w-full bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-teal-400"
          >
            <option value="">-- Choose --</option>
            {Object.keys(professions).map((key) => (
              <option key={key} value={key}>
                {professions[key].name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2 text-gray-300 font-medium">Your Level (0-82):</label>
          <input
            type="number"
            value={userLevel}
            onChange={handleLevelChange}
            min="0"
            max="82"
            className="p-3 w-full bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-teal-400"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <button
          onClick={() => setTab('xp')}
          className={`px-4 py-2 rounded-t-lg ${tab === 'xp' ? 'bg-teal-400 text-gray-900' : 'bg-gray-700 text-white'}`}
        >
          XP Projections
        </button>
        <button
          onClick={() => setTab('inventory')}
          className={`px-4 py-2 rounded-t-lg ${tab === 'inventory' ? 'bg-teal-400 text-gray-900' : 'bg-gray-700 text-white'}`}
        >
          Current Inventory
        </button>
      </div>

      {/* XP Projections Tab: Ingredient Price Inputs */}
      {tab === 'xp' && selectedProfession && materialList.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-medium text-teal-400 mb-4">Input Ingredient Prices (Silver)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {materialList.map((material) => (
              <div
                key={material}
                className="flex items-center bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-sm group"
                onMouseEnter={() => console.log(`Hovered over: ${material}`)} // Debugging
              >
                <div className="flex-1 pr-3 relative min-w-0">
                  <label className="text-gray-300 font-medium truncate block">{material}:</label>
                  <span className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded-lg p-2 shadow-lg z-10">
                    {material}
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  value={ingredientPrices[material] || ''}
                  onChange={(e) => handlePriceChange(material, e.target.value)}
                  className="p-2 w-20 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-400 flex-shrink-0"
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Inventory Tab: Inventory Selection with Dropdown */}
      {tab === 'inventory' && selectedProfession && materialList.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-medium text-teal-400 mb-4">Select Inventory Items</h3>
          <div className="mb-4">
            <select
              value={selectedIngredient}
              onChange={(e) => handleAddIngredient(e.target.value)}
              className="p-3 w-full sm:w-1/2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-teal-400"
            >
              <option value="">-- Select Ingredient --</option>
              {materialList
                .filter((material) => !inventory[material]) // Only show unselected ingredients
                .map((material) => (
                  <option key={material} value={material}>
                    {material}
                  </option>
                ))}
            </select>
          </div>
          {Object.keys(inventory).length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(inventory).map((material) => {
                const inv = inventory[material] || { selected: true, quantity: 0 };
                return (
                  <div
                    key={material}
                    className="flex items-center bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-sm group cursor-pointer"
                    onClick={() => handleRemoveIngredient(material)}
                  >
                    <div className="flex-1 pr-3 relative min-w-0">
                      <span className="text-gray-300 font-medium truncate block">{material}</span>
                      <span className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded-lg p-2 shadow-lg z-10">
                        {material}
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={inv.quantity}
                      onChange={(e) => handleInventoryChange(material, 'quantity', e.target.value)}
                      onClick={(e) => e.stopPropagation()} // Prevent removing when clicking the input
                      className="p-2 w-20 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-400 flex-shrink-0"
                      placeholder="0"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Top Recommended by ROI */}
      {selectedProfession && topRecommended.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-medium text-teal-400 mb-4">
            {tab === 'xp' ? 'Top Recommended (by ROI)' : 'Recommended Crafts (by ROI)'}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-3 text-left border border-gray-700 min-w-[200px]">Item</th>
                  <th className="p-3 text-left border border-gray-700 min-w-[80px]">Level</th>
                  <th className="p-3 text-left border border-gray-700 min-w-[80px]">XP</th>
                  {tab === 'xp' && (
                    <th className="p-3 text-left border border-gray-700 min-w-[120px]">
                      Cost (Silver)
                    </th>
                  )}
                  <th className="p-3 text-left border border-gray-700 min-w-[200px]">Materials</th>
                  {tab === 'xp' && (
                    <th className="p-3 text-left border border-gray-700 min-w-[100px]">
                      ROI (XP/Silver)
                    </th>
                  )}
                  {tab === 'xp' && (
                    <th className="p-3 text-left border border-gray-700 min-w-[120px]">
                      Craft X Times
                    </th>
                  )}
                  {tab === 'xp' && (
                    <th className="p-3 text-left border border-gray-700 min-w-[100px]">Total XP</th>
                  )}
                  {tab === 'xp' && (
                    <th className="p-3 text-left border border-gray-700 min-w-[120px]">
                      Total Cost
                    </th>
                  )}
                  {tab === 'inventory' && (
                    <th className="p-3 text-left border border-gray-700 min-w-[100px]">Max Crafts</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {topRecommended.map((option, index) => {
                  const craftAmount = craftAmounts[option.item] || 0;
                  const totalXpForCrafts = option.totalXp * craftAmount;
                  const totalCostForCrafts = option.costPerCraft * craftAmount;

                  // In Current Inventory tab, only show recipes that can be crafted
                  if (tab === 'inventory' && option.maxCrafts === 0) return null;

                  return (
                    <tr key={index} className="odd:bg-gray-700 hover:bg-gray-600">
                      <td className="p-3 border border-gray-700 whitespace-normal">
                        {option.displayItem}
                        {option.craftQuantity > 1 && (
                          <span className="text-gray-400"> (×{option.craftQuantity})</span>
                        )}
                      </td>
                      <td className="p-3 border border-gray-700">{option.level}</td>
                      <td className="p-3 border border-gray-700">{option.totalXp.toFixed(2)}</td>
                      {tab === 'xp' && (
                        <td className="p-3 border border-gray-700">
                          {option.costPerCraft.toFixed(2)}
                        </td>
                      )}
                      <td className="p-3 border border-gray-700 whitespace-normal">
                        {option.materials.map((mat, i) => (
                          <div key={i}>
                            {mat.name} × {mat.quantity}
                          </div>
                        ))}
                      </td>
                      {tab === 'xp' && (
                        <td className="p-3 border border-gray-700">
                          {isFinite(option.roi) ? option.roi.toFixed(2) : '∞'}
                        </td>
                      )}
                      {tab === 'xp' && (
                        <td className="p-3 border border-gray-700">
                          <input
                            type="number"
                            min="0"
                            value={craftAmount}
                            onChange={(e) => handleCraftAmountChange(option.item, e.target.value)}
                            className="p-2 w-20 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-400"
                            placeholder="0"
                          />
                        </td>
                      )}
                      {tab === 'xp' && (
                        <td className="p-3 border border-gray-700">
                          {totalXpForCrafts.toFixed(2)}
                        </td>
                      )}
                      {tab === 'xp' && (
                        <td className="p-3 border border-gray-700">
                          {totalCostForCrafts.toFixed(2)}
                        </td>
                      )}
                      {tab === 'inventory' && (
                        <td className="p-3 border border-gray-700">
                          {isFinite(option.maxCrafts) ? option.maxCrafts : '∞'}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* All Available Options */}
      {selectedProfession && availableOptions.length > 0 && (
        <div>
          <h3 className="text-xl font-medium text-teal-400 mb-4">
            {tab === 'xp' ? 'All Available Options' : 'All Craftable Options'}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-3 text-left border border-gray-700 min-w-[200px]">Item</th>
                  <th className="p-3 text-left border border-gray-700 min-w-[80px]">Level</th>
                  <th className="p-3 text-left border border-gray-700 min-w-[80px]">XP</th>
                  {tab === 'xp' && (
                    <th className="p-3 text-left border border-gray-700 min-w-[120px]">
                      Cost (Silver)
                    </th>
                  )}
                  <th className="p-3 text-left border border-gray-700 min-w-[200px]">Materials</th>
                  {tab === 'xp' && (
                    <th className="p-3 text-left border border-gray-700 min-w-[100px]">
                      ROI (XP/Silver)
                    </th>
                  )}
                  {tab === 'xp' && (
                    <th className="p-3 text-left border border-gray-700 min-w-[120px]">
                      Craft X Times
                    </th>
                  )}
                  {tab === 'xp' && (
                    <th className="p-3 text-left border border-gray-700 min-w-[100px]">Total XP</th>
                  )}
                  {tab === 'xp' && (
                    <th className="p-3 text-left border border-gray-700 min-w-[120px]">
                      Total Cost
                    </th>
                  )}
                  {tab === 'inventory' && (
                    <th className="p-3 text-left border border-gray-700 min-w-[100px]">Max Crafts</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {availableOptions.map((option, index) => {
                  const craftAmount = craftAmounts[option.item] || 0;
                  const totalXpForCrafts = option.totalXp * craftAmount;
                  const totalCostForCrafts = option.costPerCraft * craftAmount;

                  // In Current Inventory tab, only show recipes that can be crafted
                  if (tab === 'inventory' && option.maxCrafts === 0) return null;

                  return (
                    <tr key={index} className="odd:bg-gray-700 hover:bg-gray-600">
                      <td className="p-3 border border-gray-700 whitespace-normal">
                        {option.displayItem}
                        {option.craftQuantity > 1 && (
                          <span className="text-gray-400"> (×{option.craftQuantity})</span>
                        )}
                      </td>
                      <td className="p-3 border border-gray-700">{option.level}</td>
                      <td className="p-3 border border-gray-700">{option.totalXp.toFixed(2)}</td>
                      {tab === 'xp' && (
                        <td className="p-3 border border-gray-700">
                          {option.costPerCraft.toFixed(2)}
                        </td>
                      )}
                      <td className="p-3 border border-gray-700 whitespace-normal">
                        {option.materials.map((mat, i) => (
                          <div key={i}>
                            {mat.name} × {mat.quantity}
                          </div>
                        ))}
                      </td>
                      {tab === 'xp' && (
                        <td className="p-3 border border-gray-700">
                          {isFinite(option.roi) ? option.roi.toFixed(2) : '∞'}
                        </td>
                      )}
                      {tab === 'xp' && (
                        <td className="p-3 border border-gray-700">
                          <input
                            type="number"
                            min="0"
                            value={craftAmount}
                            onChange={(e) => handleCraftAmountChange(option.item, e.target.value)}
                            className="p-2 w-20 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-400"
                            placeholder="0"
                          />
                        </td>
                      )}
                      {tab === 'xp' && (
                        <td className="p-3 border border-gray-700">
                          {totalXpForCrafts.toFixed(2)}
                        </td>
                      )}
                      {tab === 'xp' && (
                        <td className="p-3 border border-gray-700">
                          {totalCostForCrafts.toFixed(2)}
                        </td>
                      )}
                      {tab === 'inventory' && (
                        <td className="p-3 border border-gray-700">
                          {isFinite(option.maxCrafts) ? option.maxCrafts : '∞'}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Options Available */}
      {selectedProfession && availableOptions.length === 0 && (
        <p className="text-gray-300">No crafting options available for your level.</p>
      )}
    </div>
  );
}

export default ProfessionOptimizer;