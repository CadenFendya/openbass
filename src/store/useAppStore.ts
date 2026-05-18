import { create } from 'zustand';
import { get, set } from 'idb-keyval';
import { DEFAULT_GEAR } from '../data/gear';
import type { CatchLog, GearSetup, LocationProfile, WaterbodyProfile } from '../types';

const defaultLocation: LocationProfile = {
  id: 'grand-rapids-pond',
  name: 'Grand Rapids Pond',
  latitude: 42.9634,
  longitude: -85.6681,
  state: 'Michigan',
  country: 'US',
  timezone: 'America/Detroit',
  waterbodyType: 'pond',
  favorite: true
};

const defaultWaterbody: WaterbodyProfile = {
  locationId: defaultLocation.id,
  averageDepthFt: 6,
  maxDepthFt: 12,
  clarity: 'stained',
  vegetation: true,
  grass: true,
  pads: false,
  wood: true,
  rock: false,
  shoreType: 'suburban pond bank',
  current: 'none',
  waterColor: 'green stained'
};

interface AppState {
  locations: LocationProfile[];
  activeLocationId: string;
  waterbodies: Record<string, WaterbodyProfile>;
  gear: GearSetup[];
  logs: CatchLog[];
  hydrate: () => Promise<void>;
  setActiveLocation: (id: string) => void;
  addLog: (log: CatchLog) => void;
  updateWaterbody: (profile: WaterbodyProfile) => void;
  addLocation: (location: LocationProfile, profile: WaterbodyProfile) => void;
}

export const useAppStore = create<AppState>((storeSet, getState) => ({
  locations: [defaultLocation],
  activeLocationId: defaultLocation.id,
  waterbodies: { [defaultLocation.id]: defaultWaterbody },
  gear: DEFAULT_GEAR,
  logs: [],
  hydrate: async () => {
    const saved = await get('open-bass-dashboard-state');
    if (saved) storeSet(saved as Partial<AppState>);
  },
  setActiveLocation: id => { storeSet({ activeLocationId: id }); persist(getState()); },
  addLog: log => { storeSet({ logs: [log, ...getState().logs] }); persist(getState()); },
  updateWaterbody: profile => { storeSet({ waterbodies: { ...getState().waterbodies, [profile.locationId]: profile } }); persist(getState()); },
  addLocation: (location, profile) => {
    storeSet({ locations: [...getState().locations, location], waterbodies: { ...getState().waterbodies, [location.id]: profile }, activeLocationId: location.id });
    persist(getState());
  }
}));

function persist(state: AppState) {
  set('open-bass-dashboard-state', {
    locations: state.locations,
    activeLocationId: state.activeLocationId,
    waterbodies: state.waterbodies,
    gear: state.gear,
    logs: state.logs
  });
}
