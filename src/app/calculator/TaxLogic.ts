export const calculateTaxData = (salary: number, investments: number) => {
  const STD_DEDUCTION = 75000;

  // --- NEW REGIME (Budget 2025-26) ---
  let taxableNew = Math.max(0, salary - STD_DEDUCTION);
  let newTax = 0;

  if (taxableNew > 1200000) {
    // Slabs for New Regime
    if (taxableNew > 400000) newTax += Math.min(taxableNew - 400000, 400000) * 0.05;
    if (taxableNew > 800000) newTax += Math.min(taxableNew - 800000, 400000) * 0.10;
    if (taxableNew > 1200000) newTax += Math.min(taxableNew - 1200000, 400000) * 0.15;
    if (taxableNew > 1600000) newTax += Math.min(taxableNew - 1600000, 400000) * 0.20;
    if (taxableNew > 2000000) newTax += Math.min(taxableNew - 2000000, 400000) * 0.25;
    if (taxableNew > 2400000) newTax += (taxableNew - 2400000) * 0.30;
  }

  // --- OLD REGIME ---
  let taxableOld = Math.max(0, salary - investments - STD_DEDUCTION);
  let oldTax = 0;
  if (taxableOld > 500000) {
    if (taxableOld > 250000) oldTax += Math.min(taxableOld - 250000, 250000) * 0.05;
    if (taxableOld > 500000) oldTax += Math.min(taxableOld - 500000, 500000) * 0.20;
    if (taxableOld > 1000000) oldTax += (taxableOld - 1000000) * 0.30;
  }

  return {
    newTax: Math.round(newTax * 1.04), // 4% Health & Education Cess
    oldTax: Math.round(oldTax * 1.04),
    recommended: newTax <= oldTax ? "New Regime" : "Old Regime"
  };
};