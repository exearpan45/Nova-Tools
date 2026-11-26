export type ElementCategory =
  | 'nonmetal'
  | 'noble-gas'
  | 'alkali-metal'
  | 'alkaline-earth'
  | 'metalloid'
  | 'halogen'
  | 'transition-metal'
  | 'post-transition'
  | 'lanthanide'
  | 'actinide';

export interface ChemicalElement {
  number: number;
  symbol: string;
  name: string;
  mass: string;
  category: ElementCategory;
  group: number; // 1..18 (lanthanides & actinides placed at grid col 3..17 visually in extra rows)
  period: number; // 1..7 (display rows 9 & 10 for lanthanides/actinides)
  col: number; // 1..18 CSS grid column
  row: number; // 1..10 CSS grid row
  phase: 'Gas' | 'Liquid' | 'Solid';
  electronConfig: string;
  electronegativity: string;
  discovered: string;
  summary: string;
}

export const CATEGORY_META: Record<
  ElementCategory,
  { label: string; badgeClass: string; cellClass: string; hex: string }
> = {
  'alkali-metal': {
    label: 'Alkali Metals',
    badgeClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
    cellClass: 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-700 dark:text-rose-300',
    hex: '#f43f5e',
  },
  'alkaline-earth': {
    label: 'Alkaline Earth',
    badgeClass: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30',
    cellClass: 'bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/30 text-orange-700 dark:text-orange-300',
    hex: '#f97316',
  },
  'transition-metal': {
    label: 'Transition Metals',
    badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    cellClass: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-700 dark:text-amber-300',
    hex: '#f59e0b',
  },
  'post-transition': {
    label: 'Post-Transition',
    badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    cellClass: 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-700 dark:text-emerald-300',
    hex: '#10b981',
  },
  metalloid: {
    label: 'Metalloids',
    badgeClass: 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30',
    cellClass: 'bg-teal-500/10 hover:bg-teal-500/20 border-teal-500/30 text-teal-700 dark:text-teal-300',
    hex: '#14b8a6',
  },
  nonmetal: {
    label: 'Reactive Nonmetals',
    badgeClass: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
    cellClass: 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-700 dark:text-cyan-300',
    hex: '#06b6d4',
  },
  halogen: {
    label: 'Halogens',
    badgeClass: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
    cellClass: 'bg-sky-500/10 hover:bg-sky-500/20 border-sky-500/30 text-sky-700 dark:text-sky-300',
    hex: '#0ea5e9',
  },
  'noble-gas': {
    label: 'Noble Gases',
    badgeClass: 'bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30',
    cellClass: 'bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/30 text-violet-700 dark:text-violet-300',
    hex: '#8b5cf6',
  },
  lanthanide: {
    label: 'Lanthanides',
    badgeClass: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    cellClass: 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30 text-indigo-700 dark:text-indigo-300',
    hex: '#6366f1',
  },
  actinide: {
    label: 'Actinides',
    badgeClass: 'bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/30',
    cellClass: 'bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/30 text-pink-700 dark:text-pink-300',
    hex: '#ec4899',
  },
};

type CompactElement = [
  number, // atomic number
  string, // symbol
  string, // name
  string, // atomic mass
  ElementCategory,
  number, // group
  number, // period
  number, // col
  number, // row
  'Gas' | 'Liquid' | 'Solid',
  string, // electron configuration
  string, // electronegativity
  string, // discovered
  string  // short summary
];

const RAW_ELEMENTS: CompactElement[] = [
  [1, 'H', 'Hydrogen', '1.008', 'nonmetal', 1, 1, 1, 1, 'Gas', '1s¹', '2.20', '1766', 'Lightest and most abundant chemical element in the universe.'],
  [2, 'He', 'Helium', '4.0026', 'noble-gas', 18, 1, 18, 1, 'Gas', '1s²', '—', '1868', 'Colorless, inert monatomic gas used in cryogenics and balloons.'],
  [3, 'Li', 'Lithium', '6.94', 'alkali-metal', 1, 2, 1, 2, 'Solid', '[He] 2s¹', '0.98', '1817', 'Lightest metal; key component in rechargeable lithium-ion batteries.'],
  [4, 'Be', 'Beryllium', '9.0122', 'alkaline-earth', 2, 2, 2, 2, 'Solid', '[He] 2s²', '1.57', '1798', 'Lightweight, rigid metal used in aerospace alloys and X-ray windows.'],
  [5, 'B', 'Boron', '10.81', 'metalloid', 13, 2, 13, 2, 'Solid', '[He] 2s² 2p¹', '2.04', '1808', 'Metalloid essential for borosilicate glass, ceramics, and semiconductors.'],
  [6, 'C', 'Carbon', '12.011', 'nonmetal', 14, 2, 14, 2, 'Solid', '[He] 2s² 2p²', '2.55', 'Ancient', 'Tetravalent backbone of organic chemistry, diamond, and graphene.'],
  [7, 'N', 'Nitrogen', '14.007', 'nonmetal', 15, 2, 15, 2, 'Gas', '[He] 2s² 2p³', '3.04', '1772', 'Makes up 78% of Earth’s atmosphere and is vital to amino acids.'],
  [8, 'O', 'Oxygen', '15.999', 'nonmetal', 16, 2, 16, 2, 'Gas', '[He] 2s² 2p⁴', '3.44', '1774', 'Highly reactive nonmetal essential for respiration and combustion.'],
  [9, 'F', 'Fluorine', '18.998', 'halogen', 17, 2, 17, 2, 'Gas', '[He] 2s² 2p⁵', '3.98', '1886', 'Most electronegative and chemically reactive of all elements.'],
  [10, 'Ne', 'Neon', '20.180', 'noble-gas', 18, 2, 18, 2, 'Gas', '[He] 2s² 2p⁶', '—', '1898', 'Noble gas famous for bright reddish-orange glow in high-voltage signs.'],
  [11, 'Na', 'Sodium', '22.990', 'alkali-metal', 1, 3, 1, 3, 'Solid', '[Ne] 3s¹', '0.93', '1807', 'Soft reactive alkali metal essential for nerve signaling and table salt.'],
  [12, 'Mg', 'Magnesium', '24.305', 'alkaline-earth', 2, 3, 2, 3, 'Solid', '[Ne] 3s²', '1.31', '1755', 'Structural light metal and the central atom in chlorophyll molecules.'],
  [13, 'Al', 'Aluminum', '26.982', 'post-transition', 13, 3, 13, 3, 'Solid', '[Ne] 3s² 3p¹', '1.61', '1825', 'Most abundant metal in Earth’s crust; corrosion-resistant and lightweight.'],
  [14, 'Si', 'Silicon', '28.085', 'metalloid', 14, 3, 14, 3, 'Solid', '[Ne] 3s² 3p²', '1.90', '1824', 'Fundamental semiconductor material powering modern microchips.'],
  [15, 'P', 'Phosphorus', '30.974', 'nonmetal', 15, 3, 15, 3, 'Solid', '[Ne] 3s² 3p³', '2.19', '1669', 'Essential for DNA, ATP energy transfer, and fertilizers.'],
  [16, 'S', 'Sulfur', '32.06', 'nonmetal', 16, 3, 16, 3, 'Solid', '[Ne] 3s² 3p⁴', '2.58', 'Ancient', 'Bright yellow nonmetal used in sulfuric acid production and vulcanization.'],
  [17, 'Cl', 'Chlorine', '35.45', 'halogen', 17, 3, 17, 3, 'Gas', '[Ne] 3s² 3p⁵', '3.16', '1774', 'Yellow-green halogen widely used for water purification and PVC.'],
  [18, 'Ar', 'Argon', '39.948', 'noble-gas', 18, 3, 18, 3, 'Gas', '[Ne] 3s² 3p⁶', '—', '1894', 'Third most abundant gas in Earth’s atmosphere; used as shielding gas.'],
  [19, 'K', 'Potassium', '39.098', 'alkali-metal', 1, 4, 1, 4, 'Solid', '[Ar] 4s¹', '0.82', '1807', 'Vital electrolyte in biology; reacts vigorously with water.'],
  [20, 'Ca', 'Calcium', '40.078', 'alkaline-earth', 2, 4, 2, 4, 'Solid', '[Ar] 4s²', '1.00', '1808', 'Essential mineral for bones, teeth, cement, and cellular signaling.'],
  [21, 'Sc', 'Scandium', '44.956', 'transition-metal', 3, 4, 3, 4, 'Solid', '[Ar] 3d¹ 4s²', '1.36', '1879', 'Silvery-white metal alloyed with aluminum for high-strength frames.'],
  [22, 'Ti', 'Titanium', '47.867', 'transition-metal', 4, 4, 4, 4, 'Solid', '[Ar] 3d² 4s²', '1.54', '1791', 'High strength-to-weight metal prized in medical implants and aerospace.'],
  [23, 'V', 'Vanadium', '50.942', 'transition-metal', 5, 4, 5, 4, 'Solid', '[Ar] 3d³ 4s²', '1.63', '1801', 'Hard silvery transition metal used to strengthen specialty steels.'],
  [24, 'Cr', 'Chromium', '51.996', 'transition-metal', 6, 4, 6, 4, 'Solid', '[Ar] 3d⁵ 4s¹', '1.66', '1797', 'Lustrous, hard metal used in stainless steel and chrome plating.'],
  [25, 'Mn', 'Manganese', '54.938', 'transition-metal', 7, 4, 7, 4, 'Solid', '[Ar] 3d⁵ 4s²', '1.55', '1774', 'Essential for steelmaking desulfurization and battery cathodes.'],
  [26, 'Fe', 'Iron', '55.845', 'transition-metal', 8, 4, 8, 4, 'Solid', '[Ar] 3d⁶ 4s²', '1.83', 'Ancient', 'Core industrial metal and oxygen-binding center of hemoglobin.'],
  [27, 'Co', 'Cobalt', '58.933', 'transition-metal', 9, 4, 9, 4, 'Solid', '[Ar] 3d⁷ 4s²', '1.88', '1735', 'Ferromagnetic metal used in superalloys, batteries, and blue pigments.'],
  [28, 'Ni', 'Nickel', '58.693', 'transition-metal', 10, 4, 10, 4, 'Solid', '[Ar] 3d⁸ 4s²', '1.91', '1751', 'Corrosion-resistant metal used in coins, stainless steel, and catalysts.'],
  [29, 'Cu', 'Copper', '63.546', 'transition-metal', 11, 4, 11, 4, 'Solid', '[Ar] 3d¹⁰ 4s¹', '1.90', 'Ancient', 'Ductile reddish metal with exceptional electrical and thermal conductivity.'],
  [30, 'Zn', 'Zinc', '65.38', 'transition-metal', 12, 4, 12, 4, 'Solid', '[Ar] 3d¹⁰ 4s²', '1.65', '1746', 'Essential trace nutrient and protective galvanizing coating for steel.'],
  [31, 'Ga', 'Gallium', '69.723', 'post-transition', 13, 4, 13, 4, 'Solid', '[Ar] 3d¹⁰ 4s² 4p¹', '1.81', '1875', 'Melts near human body temperature (29.8 °C); vital in LEDs and GaN chips.'],
  [32, 'Ge', 'Germanium', '72.630', 'metalloid', 14, 4, 14, 4, 'Solid', '[Ar] 3d¹⁰ 4s² 4p²', '2.01', '1886', 'Semiconductor metalloid used in fiber optics and infrared lenses.'],
  [33, 'As', 'Arsenic', '74.922', 'metalloid', 15, 4, 15, 4, 'Solid', '[Ar] 3d¹⁰ 4s² 4p³', '2.18', 'Ancient', 'Metalloid used in GaAs high-frequency semiconductors and wood preservatives.'],
  [34, 'Se', 'Selenium', '78.971', 'nonmetal', 16, 4, 16, 4, 'Solid', '[Ar] 3d¹⁰ 4s² 4p⁴', '2.55', '1817', 'Photoconductive nonmetal used in solar cells, glass tinting, and biology.'],
  [35, 'Br', 'Bromine', '79.904', 'halogen', 17, 4, 17, 4, 'Liquid', '[Ar] 3d¹⁰ 4s² 4p⁵', '2.96', '1826', 'Only nonmetallic element that is liquid at standard room temperature.'],
  [36, 'Kr', 'Krypton', '83.798', 'noble-gas', 18, 4, 18, 4, 'Gas', '[Ar] 3d¹⁰ 4s² 4p⁶', '3.00', '1898', 'Heavy noble gas used in high-speed photographic flashes and lasers.'],
  [37, 'Rb', 'Rubidium', '85.468', 'alkali-metal', 1, 5, 1, 5, 'Solid', '[Kr] 5s¹', '0.82', '1861', 'Very soft alkali metal used in atomic clocks and vacuum tube getters.'],
  [38, 'Sr', 'Strontium', '87.62', 'alkaline-earth', 2, 5, 2, 5, 'Solid', '[Kr] 5s²', '0.95', '1790', 'Alkaline-earth metal producing brilliant crimson flames in fireworks.'],
  [39, 'Y', 'Yttrium', '88.906', 'transition-metal', 3, 5, 3, 5, 'Solid', '[Kr] 4d¹ 5s²', '1.22', '1794', 'Transition metal used in YAG lasers, LED phosphors, and superconductors.'],
  [40, 'Zr', 'Zirconium', '91.224', 'transition-metal', 4, 5, 4, 5, 'Solid', '[Kr] 4d² 5s²', '1.33', '1789', 'Heat- and corrosion-resistant metal used in nuclear cladding and ceramics.'],
  [41, 'Nb', 'Niobium', '92.906', 'transition-metal', 5, 5, 5, 5, 'Solid', '[Kr] 4d⁴ 5s¹', '1.60', '1801', 'Superconducting metal used in MRI magnets and particle accelerators.'],
  [42, 'Mo', 'Molybdenum', '95.95', 'transition-metal', 6, 5, 6, 5, 'Solid', '[Kr] 4d⁵ 5s¹', '2.16', '1778', 'High-melting transition metal vital for high-strength steel and enzymes.'],
  [43, 'Tc', 'Technetium', '(98)', 'transition-metal', 7, 5, 7, 5, 'Solid', '[Kr] 4d⁵ 5s²', '1.90', '1937', 'Lightest element with no stable isotopes; widely used in medical imaging.'],
  [44, 'Ru', 'Ruthenium', '101.07', 'transition-metal', 8, 5, 8, 5, 'Solid', '[Kr] 4d⁷ 5s¹', '2.20', '1844', 'Rare platinum-group metal used in wear-resistant electrical contacts.'],
  [45, 'Rh', 'Rhodium', '102.91', 'transition-metal', 9, 5, 9, 5, 'Solid', '[Kr] 4d⁸ 5s¹', '2.28', '1803', 'Highly reflective precious metal essential for catalytic converters.'],
  [46, 'Pd', 'Palladium', '106.42', 'transition-metal', 10, 5, 10, 5, 'Solid', '[Kr] 4d¹⁰', '2.20', '1803', 'Absorbs large volumes of hydrogen; key catalyst in organic synthesis.'],
  [47, 'Ag', 'Silver', '107.87', 'transition-metal', 11, 5, 11, 5, 'Solid', '[Kr] 4d¹⁰ 5s¹', '1.93', 'Ancient', 'Precious metal with the highest electrical and thermal conductivity.'],
  [48, 'Cd', 'Cadmium', '112.41', 'transition-metal', 12, 5, 12, 5, 'Solid', '[Kr] 4d¹⁰ 5s²', '1.69', '1817', 'Soft bluish metal formerly used in NiCd batteries and quantum dots.'],
  [49, 'In', 'Indium', '114.82', 'post-transition', 13, 5, 13, 5, 'Solid', '[Kr] 4d¹⁰ 5s² 5p¹', '1.78', '1863', 'Soft metal used to make transparent ITO electrodes in touchscreens.'],
  [50, 'Sn', 'Tin', '118.71', 'post-transition', 14, 5, 14, 5, 'Solid', '[Kr] 4d¹⁰ 5s² 5p²', '1.96', 'Ancient', 'Malleable metal alloyed with copper to make bronze and lead-free solder.'],
  [51, 'Sb', 'Antimony', '121.76', 'metalloid', 15, 5, 15, 5, 'Solid', '[Kr] 4d¹⁰ 5s² 5p³', '2.05', 'Ancient', 'Lustrous metalloid used in flame retardants and lead-acid battery alloys.'],
  [52, 'Te', 'Tellurium', '127.60', 'metalloid', 16, 5, 16, 5, 'Solid', '[Kr] 4d¹⁰ 5s² 5p⁴', '2.10', '1782', 'Rare metalloid used in CdTe solar panels and thermoelectric coolers.'],
  [53, 'I', 'Iodine', '126.90', 'halogen', 17, 5, 17, 5, 'Solid', '[Kr] 4d¹⁰ 5s² 5p⁵', '2.66', '1811', 'Violet-black halogen vital for thyroid hormone production and antiseptics.'],
  [54, 'Xe', 'Xenon', '131.29', 'noble-gas', 18, 5, 18, 5, 'Gas', '[Kr] 4d¹⁰ 5s² 5p⁶', '2.60', '1898', 'Dense noble gas used in spacecraft ion thrusters and surgical anesthetics.'],
  [55, 'Cs', 'Cesium', '132.91', 'alkali-metal', 1, 6, 1, 6, 'Solid', '[Xe] 6s¹', '0.79', '1860', 'Golden alkali metal whose hyperfine transition defines the SI second.'],
  [56, 'Ba', 'Barium', '137.33', 'alkaline-earth', 2, 6, 2, 6, 'Solid', '[Xe] 6s²', '0.89', '1808', 'Heavy alkaline-earth metal used in X-ray medical contrast meals.'],
  [57, 'La', 'Lanthanum', '138.91', 'lanthanide', 3, 6, 3, 9, 'Solid', '[Xe] 5d¹ 6s²', '1.10', '1839', 'First lanthanide; used in camera lenses with high refractive index.'],
  [58, 'Ce', 'Cerium', '140.12', 'lanthanide', 3, 6, 4, 9, 'Solid', '[Xe] 4f¹ 5d¹ 6s²', '1.12', '1803', 'Most abundant rare-earth element; used in lighter flints and glass polish.'],
  [59, 'Pr', 'Praseodymium', '140.91', 'lanthanide', 3, 6, 5, 9, 'Solid', '[Xe] 4f³ 6s²', '1.13', '1885', 'Rare-earth metal used in high-strength aircraft magnets and welders’ goggles.'],
  [60, 'Nd', 'Neodymium', '144.24', 'lanthanide', 3, 6, 6, 9, 'Solid', '[Xe] 4f⁴ 6s²', '1.14', '1885', 'Forms the world’s strongest permanent magnets (NdFeB) for motors and audio.'],
  [61, 'Pm', 'Promethium', '(145)', 'lanthanide', 3, 6, 7, 9, 'Solid', '[Xe] 4f⁵ 6s²', '1.13', '1945', 'Radioactive lanthanide used in miniature nuclear batteries for probes.'],
  [62, 'Sm', 'Samarium', '150.36', 'lanthanide', 3, 6, 8, 9, 'Solid', '[Xe] 4f⁶ 6s²', '1.17', '1879', 'Used in high-temperature samarium-cobalt magnets and neutron absorbers.'],
  [63, 'Eu', 'Europium', '151.96', 'lanthanide', 3, 6, 9, 9, 'Solid', '[Xe] 4f⁷ 6s²', '1.20', '1901', 'Phosphorescent rare earth producing red/blue light in displays and anti-counterfeit ink.'],
  [64, 'Gd', 'Gadolinium', '157.25', 'lanthanide', 3, 6, 10, 9, 'Solid', '[Xe] 4f⁷ 5d¹ 6s²', '1.20', '1880', 'Paramagnetic lanthanide widely used in MRI contrast agents.'],
  [65, 'Tb', 'Terbium', '158.93', 'lanthanide', 3, 6, 11, 9, 'Solid', '[Xe] 4f⁹ 6s²', '1.20', '1843', 'Silvery rare earth used in green solid-state phosphors and sonar alloys.'],
  [66, 'Dy', 'Dysprosium', '162.50', 'lanthanide', 3, 6, 12, 9, 'Solid', '[Xe] 4f¹⁰ 6s²', '1.22', '1886', 'High magnetic-susceptibility element stabilizing EV motor magnets.'],
  [67, 'Ho', 'Holmium', '164.93', 'lanthanide', 3, 6, 13, 9, 'Solid', '[Xe] 4f¹¹ 6s²', '1.23', '1878', 'Possesses the highest magnetic moment of any naturally occurring element.'],
  [68, 'Er', 'Erbium', '167.26', 'lanthanide', 3, 6, 14, 9, 'Solid', '[Xe] 4f¹² 6s²', '1.24', '1843', 'Essential dopant for optical fiber amplifiers spanning global internet cables.'],
  [69, 'Tm', 'Thulium', '168.93', 'lanthanide', 3, 6, 15, 9, 'Solid', '[Xe] 4f¹³ 6s²', '1.25', '1879', 'Rarest non-radioactive lanthanide; used in portable surgical X-ray sources.'],
  [70, 'Yb', 'Ytterbium', '173.05', 'lanthanide', 3, 6, 16, 9, 'Solid', '[Xe] 4f¹⁴ 6s²', '1.10', '1878', 'Used in ultra-precise optical lattice atomic clocks and fiber lasers.'],
  [71, 'Lu', 'Lutetium', '174.97', 'lanthanide', 3, 6, 17, 9, 'Solid', '[Xe] 4f¹⁴ 5d¹ 6s²', '1.27', '1907', 'Densest and hardest lanthanide; used in PET scan scintillator crystals.'],
  [72, 'Hf', 'Hafnium', '178.49', 'transition-metal', 4, 6, 4, 6, 'Solid', '[Xe] 4f¹⁴ 5d² 6s²', '1.30', '1923', 'High-k dielectric insulator in modern CPUs and nuclear control rods.'],
  [73, 'Ta', 'Tantalum', '180.95', 'transition-metal', 5, 6, 5, 6, 'Solid', '[Xe] 4f¹⁴ 5d³ 6s²', '1.50', '1802', 'Corrosion-proof refractory metal widely used in compact capacitors.'],
  [74, 'W', 'Tungsten', '183.84', 'transition-metal', 6, 6, 6, 6, 'Solid', '[Xe] 4f¹⁴ 5d⁴ 6s²', '2.36', '1783', 'Highest melting point (3,422 °C) of all metallic elements.'],
  [75, 'Re', 'Rhenium', '186.21', 'transition-metal', 7, 6, 7, 6, 'Solid', '[Xe] 4f¹⁴ 5d⁵ 6s²', '1.90', '1925', 'Ultra-rare refractory metal strengthening single-crystal jet turbine blades.'],
  [76, 'Os', 'Osmium', '190.23', 'transition-metal', 8, 6, 8, 6, 'Solid', '[Xe] 4f¹⁴ 5d⁶ 6s²', '2.20', '1803', 'Densest naturally occurring element (22.59 g/cm³).'],
  [77, 'Ir', 'Iridium', '192.22', 'transition-metal', 9, 6, 9, 6, 'Solid', '[Xe] 4f¹⁴ 5d⁷ 6s²', '2.20', '1803', 'Most corrosion-resistant metal; marks the K-Pg asteroid impact layer.'],
  [78, 'Pt', 'Platinum', '195.08', 'transition-metal', 10, 6, 10, 6, 'Solid', '[Xe] 4f¹⁴ 5d⁹ 6s¹', '2.28', '1735', 'Unreactive precious metal essential for fuel cells and laboratory electrodes.'],
  [79, 'Au', 'Gold', '196.97', 'transition-metal', 11, 6, 11, 6, 'Solid', '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', '2.54', 'Ancient', 'Most malleable metal; resists tarnishing and bonds microelectronics cleanly.'],
  [80, 'Hg', 'Mercury', '200.59', 'transition-metal', 12, 6, 12, 6, 'Liquid', '[Xe] 4f¹⁴ 5d¹⁰ 6s²', '2.00', 'Ancient', 'Only metallic element that is liquid at standard room temperature.'],
  [81, 'Tl', 'Thallium', '204.38', 'post-transition', 13, 6, 13, 6, 'Solid', '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹', '1.62', '1861', 'Soft gray metal used in specialized infrared optical crystals.'],
  [82, 'Pb', 'Lead', '207.2', 'post-transition', 14, 6, 14, 6, 'Solid', '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²', '2.33', 'Ancient', 'Dense, malleable metal effective for radiation shielding.'],
  [83, 'Bi', 'Bismuth', '208.98', 'post-transition', 15, 6, 15, 6, 'Solid', '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³', '2.02', '1753', 'Diamagnetic heavy metal famous for iridescent stepped hopper crystals.'],
  [84, 'Po', 'Polonium', '(209)', 'metalloid', 16, 6, 16, 6, 'Solid', '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴', '2.00', '1898', 'Intensely radioactive element discovered by Marie and Pierre Curie.'],
  [85, 'At', 'Astatine', '(210)', 'halogen', 17, 6, 17, 6, 'Solid', '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵', '2.20', '1940', 'Rarest naturally occurring element in Earth’s crust; studied for alpha therapy.'],
  [86, 'Rn', 'Radon', '(222)', 'noble-gas', 18, 6, 18, 6, 'Gas', '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶', '2.20', '1900', 'Dense, colorless radioactive noble gas formed from radium decay.'],
  [87, 'Fr', 'Francium', '(223)', 'alkali-metal', 1, 7, 1, 7, 'Solid', '[Rn] 7s¹', '0.70', '1939', 'Extremely unstable radioactive alkali metal with a 22-minute half-life.'],
  [88, 'Ra', 'Radium', '(226)', 'alkaline-earth', 2, 7, 2, 7, 'Solid', '[Rn] 7s²', '0.90', '1898', 'Luminescent radioactive alkaline-earth metal isolated from pitchblende.'],
  [89, 'Ac', 'Actinium', '(227)', 'actinide', 3, 7, 3, 10, 'Solid', '[Rn] 6d¹ 7s²', '1.10', '1899', 'Glows pale blue in darkness due to intense Cherenkov/air ionization.'],
  [90, 'Th', 'Thorium', '232.04', 'actinide', 3, 7, 4, 10, 'Solid', '[Rn] 6d² 7s²', '1.30', '1828', 'Weakly radioactive actinide explored as a fertile nuclear fuel cycle.'],
  [91, 'Pa', 'Protactinium', '231.04', 'actinide', 3, 7, 5, 10, 'Solid', '[Rn] 5f² 6d¹ 7s²', '1.50', '1913', 'Dense, silvery-gray actinide occurring in trace quantities in uranium ores.'],
  [92, 'U', 'Uranium', '238.03', 'actinide', 3, 7, 6, 10, 'Solid', '[Rn] 5f³ 6d¹ 7s²', '1.38', '1789', 'Primary heavy fuel used in nuclear power reactors worldwide.'],
  [93, 'Np', 'Neptunium', '(237)', 'actinide', 3, 7, 7, 10, 'Solid', '[Rn] 5f⁴ 6d¹ 7s²', '1.36', '1940', 'First synthetic transuranic element discovered; precursor to plutonium-238.'],
  [94, 'Pu', 'Plutonium', '(244)', 'actinide', 3, 7, 8, 10, 'Solid', '[Rn] 5f⁶ 7s²', '1.28', '1940', 'Powers deep-space RTGs like Voyager, Curiosity, and Perseverance.'],
  [95, 'Am', 'Americium', '(243)', 'actinide', 3, 7, 9, 10, 'Solid', '[Rn] 5f⁷ 7s²', '1.30', '1944', 'Used in tiny amounts inside household ionization smoke detectors.'],
  [96, 'Cm', 'Curium', '(247)', 'actinide', 3, 7, 10, 10, 'Solid', '[Rn] 5f⁷ 6d¹ 7s²', '1.30', '1944', 'Alpha-emitting actinide used in Mars rover X-ray spectrometers.'],
  [97, 'Bk', 'Berkelium', '(247)', 'actinide', 3, 7, 11, 10, 'Solid', '[Rn] 5f⁹ 7s²', '1.30', '1949', 'Synthetic transuranic metal used as target material for superheavy synthesis.'],
  [98, 'Cf', 'Californium', '(251)', 'actinide', 3, 7, 12, 10, 'Solid', '[Rn] 5f¹⁰ 7s²', '1.30', '1950', 'Intense neutron emitter used in reactor startups and mineral analysis.'],
  [99, 'Es', 'Einsteinium', '(252)', 'actinide', 3, 7, 13, 10, 'Solid', '[Rn] 5f¹¹ 7s²', '1.30', '1952', 'Soft silvery synthetic element discovered in 1952 thermonuclear debris.'],
  [100, 'Fm', 'Fermium', '(257)', 'actinide', 3, 7, 14, 10, 'Solid', '[Rn] 5f¹² 7s²', '1.30', '1952', 'Heaviest element producible by neutron bombardment of lighter elements.'],
  [101, 'Md', 'Mendelevium', '(258)', 'actinide', 3, 7, 15, 10, 'Solid', '[Rn] 5f¹³ 7s²', '1.30', '1955', 'Named after Dmitri Mendeleev, creator of the periodic table.'],
  [102, 'No', 'Nobelium', '(259)', 'actinide', 3, 7, 16, 10, 'Solid', '[Rn] 5f¹⁴ 7s²', '1.30', '1958', 'Synthetic actinide preferring the +2 oxidation state in solution.'],
  [103, 'Lr', 'Lawrencium', '(266)', 'actinide', 3, 7, 17, 10, 'Solid', '[Rn] 5f¹⁴ 7s² 7p¹', '1.30', '1961', 'Final actinide series member named for cyclotron inventor Ernest Lawrence.'],
  [104, 'Rf', 'Rutherfordium', '(267)', 'transition-metal', 4, 7, 4, 7, 'Solid', '[Rn] 5f¹⁴ 6d² 7s²', '—', '1964', 'First transactinide superheavy element; named after Ernest Rutherford.'],
  [105, 'Db', 'Dubnium', '(268)', 'transition-metal', 5, 7, 5, 7, 'Solid', '[Rn] 5f¹⁴ 6d³ 7s²', '—', '1967', 'Synthetic group-5 superheavy element named after Dubna, Russia.'],
  [106, 'Sg', 'Seaborgium', '(269)', 'transition-metal', 6, 7, 6, 7, 'Solid', '[Rn] 5f¹⁴ 6d⁴ 7s²', '—', '1974', 'Superheavy element honoring nuclear chemist Glenn T. Seaborg.'],
  [107, 'Bh', 'Bohrium', '(270)', 'transition-metal', 7, 7, 7, 7, 'Solid', '[Rn] 5f¹⁴ 6d⁵ 7s²', '—', '1981', 'Synthetic group-7 element named after quantum pioneer Niels Bohr.'],
  [108, 'Hs', 'Hassium', '(277)', 'transition-metal', 8, 7, 8, 7, 'Solid', '[Rn] 5f¹⁴ 6d⁶ 7s²', '—', '1984', 'Synthetic element chemically similar to osmium, predicted to be ultra-dense.'],
  [109, 'Mt', 'Meitnerium', '(278)', 'transition-metal', 9, 7, 9, 7, 'Solid', '[Rn] 5f¹⁴ 6d⁷ 7s²', '—', '1982', 'Honors physicist Lise Meitner, co-discoverer of nuclear fission.'],
  [110, 'Ds', 'Darmstadtium', '(281)', 'transition-metal', 10, 7, 10, 7, 'Solid', '[Rn] 5f¹⁴ 6d⁸ 7s²', '—', '1994', 'Superheavy element synthesized at GSI in Darmstadt, Germany.'],
  [111, 'Rg', 'Roentgenium', '(282)', 'transition-metal', 11, 7, 11, 7, 'Solid', '[Rn] 5f¹⁴ 6d⁹ 7s²', '—', '1994', 'Group-11 superheavy element named for X-ray discoverer Wilhelm Röntgen.'],
  [112, 'Cn', 'Copernicium', '(285)', 'transition-metal', 12, 7, 12, 7, 'Liquid', '[Rn] 5f¹⁴ 6d¹⁰ 7s²', '—', '1996', 'Volatile superheavy element honoring astronomer Nicolaus Copernicus.'],
  [113, 'Nh', 'Nihonium', '(286)', 'post-transition', 13, 7, 13, 7, 'Solid', '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹', '—', '2003', 'First element discovered in Asia; synthesized at RIKEN in Japan.'],
  [114, 'Fl', 'Flerovium', '(289)', 'post-transition', 14, 7, 14, 7, 'Solid', '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²', '—', '1998', 'Superheavy group-14 element exhibiting quasi-noble-gas relativistic traits.'],
  [115, 'Mc', 'Moscovium', '(290)', 'post-transition', 15, 7, 15, 7, 'Solid', '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³', '—', '2003', 'Synthetic pnictogen synthesized by JINR and LLNL collaboration.'],
  [116, 'Lv', 'Livermorium', '(293)', 'post-transition', 16, 7, 16, 7, 'Solid', '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴', '—', '2000', 'Synthetic chalcogen named for Lawrence Livermore National Laboratory.'],
  [117, 'Ts', 'Tennessine', '(294)', 'halogen', 17, 7, 17, 7, 'Solid', '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵', '—', '2010', 'Second-heaviest element known; exhibits strong spin-orbit coupling.'],
  [118, 'Og', 'Oganesson', '(294)', 'noble-gas', 18, 7, 18, 7, 'Solid', '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶', '—', '2002', 'Heaviest known element (Z=118); named after nuclear physicist Yuri Oganessian.'],
];

export const PERIODIC_ELEMENTS: ChemicalElement[] = RAW_ELEMENTS.map((item) => ({
  number: item[0],
  symbol: item[1],
  name: item[2],
  mass: item[3],
  category: item[4],
  group: item[5],
  period: item[6],
  col: item[7],
  row: item[8],
  phase: item[9],
  electronConfig: item[10],
  electronegativity: item[11],
  discovered: item[12],
  summary: item[13],
}));
