export interface CatchReport {
  id: string;
  source: 'seed' | 'user-import' | 'public-report';
  region: string;
  waterbodyType: 'pond' | 'lake' | 'river' | 'reservoir' | 'creek';
  season: 'winter' | 'pre-spawn' | 'spawn' | 'post-spawn' | 'summer' | 'fall' | 'cold front' | 'bluebird';
  baitId: string;
  baitName: string;
  clarity: 'clear' | 'slightly stained' | 'stained' | 'muddy';
  wind: 'calm' | 'some' | 'windy';
  cloud: 'sun' | 'cloud' | 'any';
  waterTempF?: number;
  notes: string;
}

export const SEED_CATCH_REPORTS: CatchReport[] = [
  { id: 'pond-chatterbait-prespawn-1', source: 'seed', region: 'Midwest', waterbodyType: 'pond', season: 'pre-spawn', baitId: 'chatterbait', baitName: 'Chatterbait', clarity: 'stained', wind: 'some', cloud: 'cloud', waterTempF: 55, notes: 'Stained pond, grass edge, wind helped moving bait bite.' },
  { id: 'pond-swimjig-spawn-1', source: 'seed', region: 'Midwest', waterbodyType: 'pond', season: 'spawn', baitId: 'swim-jig', baitName: 'Swim Jig', clarity: 'stained', wind: 'some', cloud: 'any', waterTempF: 62, notes: 'Swim jig around shallow grass and bluegill cover.' },
  { id: 'pond-wacky-bluebird-1', source: 'seed', region: 'Midwest', waterbodyType: 'pond', season: 'bluebird', baitId: 'wacky-rig', baitName: 'Wacky Rig', clarity: 'slightly stained', wind: 'calm', cloud: 'sun', waterTempF: 67, notes: 'Slower finesse bite near shade after high pressure.' },
  { id: 'pond-frog-summer-1', source: 'seed', region: 'Midwest', waterbodyType: 'pond', season: 'summer', baitId: 'frog', baitName: 'Frog', clarity: 'stained', wind: 'calm', cloud: 'cloud', waterTempF: 75, notes: 'Topwater around mats, pads, and heavy shallow vegetation.' },
  { id: 'lake-jerkbait-prespawn-1', source: 'seed', region: 'Great Lakes', waterbodyType: 'lake', season: 'pre-spawn', baitId: 'jerkbait', baitName: 'Jerkbait', clarity: 'clear', wind: 'some', cloud: 'sun', waterTempF: 48, notes: 'Clear lake points and breaks during cold pre-spawn.' },
  { id: 'lake-drop-shot-summer-1', source: 'seed', region: 'Great Lakes', waterbodyType: 'lake', season: 'summer', baitId: 'drop-shot', baitName: 'Drop Shot', clarity: 'clear', wind: 'calm', cloud: 'sun', waterTempF: 72, notes: 'Offshore weed edges and deeper clear-water fish.' },
  { id: 'lake-squarebill-fall-1', source: 'seed', region: 'Midwest', waterbodyType: 'lake', season: 'fall', baitId: 'squarebill', baitName: 'Squarebill', clarity: 'stained', wind: 'some', cloud: 'cloud', waterTempF: 60, notes: 'Shallow hard cover and baitfish movement in fall.' },
  { id: 'river-tube-summer-1', source: 'seed', region: 'Midwest', waterbodyType: 'river', season: 'summer', baitId: 'tube', baitName: 'Tube', clarity: 'stained', wind: 'any', cloud: 'any', waterTempF: 70, notes: 'Smallmouth around current seams and rock.' },
  { id: 'river-spinnerbait-rain-1', source: 'seed', region: 'Midwest', waterbodyType: 'river', season: 'pre-spawn', baitId: 'spinnerbait', baitName: 'Spinnerbait', clarity: 'muddy', wind: 'some', cloud: 'cloud', waterTempF: 56, notes: 'Dirty rising water around laydowns and current breaks.' },
  { id: 'river-ned-clear-1', source: 'seed', region: 'Midwest', waterbodyType: 'river', season: 'summer', baitId: 'ned-rig', baitName: 'Ned Rig', clarity: 'clear', wind: 'calm', cloud: 'sun', waterTempF: 72, notes: 'Clear shallow current and pressured smallmouth.' },
  { id: 'reservoir-football-summer-1', source: 'seed', region: 'Midwest', waterbodyType: 'reservoir', season: 'summer', baitId: 'football-jig', baitName: 'Football Jig', clarity: 'slightly stained', wind: 'some', cloud: 'sun', waterTempF: 76, notes: 'Offshore points, ledges, and rock.' },
  { id: 'reservoir-crankbait-fall-1', source: 'seed', region: 'Midwest', waterbodyType: 'reservoir', season: 'fall', baitId: 'medium-crankbait', baitName: 'Medium Diving Crankbait', clarity: 'stained', wind: 'windy', cloud: 'cloud', waterTempF: 62, notes: 'Windy points and creek arms during shad movement.' }
];
