import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid';

import * as DateUtils from './utilities/DateUtils';


export const START_YEAR = new Date().getFullYear()-1;
export const END_YEAR = new Date().getFullYear()+2;


export type AgendaItem = {
  id: string;
  text: string;
} & (AgendaEvent | AgendaDeadline | AgendaTask | AgendaGoal);

export type AgendaEvent = {
  type: 'event';
  startDate: string;
  endDate: string;
  importance: 'major' | 'minor';
};
export type AgendaDeadline = {
  type: 'deadline';
  dueDate: string;
  isComplete: boolean;
};
export type AgendaTask = {
  type: 'task';
  date: string;
  isComplete: boolean;
};
export type AgendaGoal = {
  type: 'goal';
  dueDate: string; // Only month and year matter
  isComplete: boolean;
};

export function isEvent(item: Partial<AgendaItem>): item is (AgendaItem & AgendaEvent) {
  return item.type === 'event';
}
export function isDeadline(item: Partial<AgendaItem>): item is (AgendaItem & AgendaDeadline) {
  return item.type === 'deadline';
}
export function isTask(item: Partial<AgendaItem>): item is (AgendaItem & AgendaTask) {
  return item.type === 'task';
}
export function isGoal(item: Partial<AgendaItem>): item is (AgendaItem & AgendaGoal) {
  return item.type === 'goal';
}

function defaultEvent(): AgendaItem {
  return {
    id: uuidv4(),
    text: '',
    type: 'event',
    startDate: DateUtils.formatYYYYMMDD(new Date()),
    endDate: DateUtils.formatYYYYMMDD(new Date()),
    importance: 'minor',
  };
}
function defaultDeadline(): AgendaItem {
  return {
    id: uuidv4(),
    text: '',
    type: 'deadline',
    dueDate: DateUtils.formatYYYYMMDD(new Date()),
    isComplete: false,
  };
}
function defaultGoal(): AgendaItem {
  return {
    id: uuidv4(),
    text: '',
    type: 'goal',
    dueDate: DateUtils.formatYYYYMMDD(new Date()),
    isComplete: false,
  };
}
function defaultTask(date?: string): AgendaItem {
  return {
    id: uuidv4(),
    text: '',
    type: 'task',
    isComplete: false,
    date: date ?? DateUtils.formatYYYYMMDD(new Date()),
  };
}

export function switchTypes(item: Partial<AgendaItem>, to: AgendaItem['type']) {
  // Start with the default values for our destination
  let newItem: any = {};
  switch (to) {
    case 'event': newItem = defaultEvent(); break;
    case 'deadline': newItem = defaultDeadline(); break;
    case 'goal': newItem = defaultGoal(); break;
    case 'task': newItem = defaultTask(); break;
  }

  // Maintain our exiting values (in case the user switches back and forth)
  newItem = { ...newItem, ...item };

  return newItem;
}

function isEmpty(str?: string) {
  return !str || str.trim() === '';
}

export function isValidItem(item: Partial<AgendaItem> | null): item is AgendaItem {
  if (!item) return false;
  if (isEmpty(item.id)) return false;
  if (isEmpty(item.text)) return false;
  switch (item.type) {
    case 'event':
      if (isEmpty(item.startDate)) return false;
      if (isEmpty(item.endDate)) return false;
      if (item.importance !== 'major' && item.importance !== 'minor') return false;
      break;
    case 'deadline':
      if (isEmpty(item.dueDate)) return false;
      if (item.isComplete == null) return false;
      break;
    case 'task':
      if (isEmpty(item.date)) return false;
      if (item.isComplete == null) return false;
      break;
    case 'goal':
      if (isEmpty(item.dueDate)) return false;
      if (item.isComplete == null) return false;
      break;
    default: return false;
  }
  return true;
}

export function removeNonessentialFields(item: AgendaItem) {
  switch (item.type) {
    case 'event':
      return (({ id, text, type, startDate, endDate, importance }) =>
        ({ id, text, type, startDate, endDate, importance }))(item);
    case 'deadline':
      return (({ id, text, type, dueDate, isComplete }) =>
        ({ id, text, type, dueDate, isComplete }))(item);
    case 'task':
      return (({ id, text, type, date, isComplete }) =>
        ({ id, text, type, date, isComplete }))(item);
    case 'goal':
      return (({ id, text, type, dueDate, isComplete }) =>
        ({ id, text, type, dueDate, isComplete }))(item);
  }
}

export type AgendaState = {
  isLoggedIn: boolean | null; // "null" indicates we haven't checked if we're logged in yet.
  majorEvents: (AgendaItem & AgendaEvent)[];
  minorEvents: (AgendaItem & AgendaEvent)[];
  deadlines: (AgendaItem & AgendaDeadline)[];
  tasks: (AgendaItem & AgendaTask)[];
  goals: (AgendaItem & AgendaGoal)[];
  itemBeingEdited: Partial<AgendaItem> | null;
  chosenDate: string;

  actions: {
    logIn: (data: AgendaItem[]) => void;
    logOut: () => void;
    updateEditedItem: (data: Partial<AgendaItem>) => void;
    clearEditedItem: () => void;
    beginItemCreation: (date?: string) => void;
    removeItem: (item: null | Partial<AgendaItem>) => void;
    addItem: (item: AgendaItem) => void;
    chooseDate: (newDate: string) => void;
  };
};

export const useAgendaStore = create<AgendaState>((set) => {
  return {
    isLoggedIn: null,
    majorEvents: [],
    minorEvents: [],
    deadlines: [],
    tasks: [],
    goals: [],
    itemBeingEdited: null,
    chosenDate: DateUtils.formatYYYYMMDD(new Date()),

    actions: {
      logIn: (items: AgendaItem[]) => set(state => ({
        isLoggedIn: true,
        majorEvents: items.filter(i => i.type === 'event' && i.importance === 'major') as (AgendaItem & AgendaEvent)[],
        minorEvents: items.filter(i => i.type === 'event' && i.importance === 'minor') as (AgendaItem & AgendaEvent)[],
        deadlines: items.filter(i => i.type === 'deadline'),
        tasks: items.filter(i => i.type === 'task'),
        goals: items.filter(i => i.type === 'goal'),
        itemBeingEdited: null,
        chosenDate: DateUtils.formatYYYYMMDD(new Date()),
        actions: state.actions,
      })),
      logOut: () => set(state => ({
        isLoggedIn: false,
        majorEvents: [],
        minorEvents: [],
        deadlines: [],
        tasks: [],
        goals: [],
        itemBeingEdited: null,
        actions: state.actions,
      })),
      updateEditedItem: (data: Partial<AgendaItem>) => {
        set(state => ({ ...state, itemBeingEdited: data }));
      },
      beginItemCreation: (date?: string) => {
        set(state => ({ ...state, itemBeingEdited: defaultTask(date) }));
      },
      clearEditedItem: () => {
        set(state => ({ ...state, itemBeingEdited: null }));
      },
      removeItem: (item: null | Partial<AgendaItem>) => {
        set(state => {
          if (item == null) return state;
          switch (item.type) {
            case 'event': return (item.importance === 'major')
              ? { ...state, majorEvents: [...state.majorEvents.filter(e => e.id !== item.id)] }
              : { ...state, minorEvents: [...state.minorEvents.filter(e => e.id !== item.id)] };
            case 'deadline': return { ...state, deadlines: [...state.deadlines.filter(d => d.id !== item.id)] };
            case 'task':     return { ...state, tasks: [...state.tasks.filter(t => t.id !== item.id)] };
            case 'goal':     return { ...state, goals: [...state.goals.filter(g => g.id !== item.id)] };
          }
          return state;
        });
      },
      addItem: (item: AgendaItem) => {
        set(state => {
          switch (item.type) {
            case 'event': return (item.importance === 'major')
              ? { ...state, majorEvents: [...state.majorEvents, item] }
              : { ...state, minorEvents: [...state.minorEvents, item] };
            case 'deadline': return { ...state, deadlines: [...state.deadlines, item] };
            case 'task':     return { ...state, tasks: [...state.tasks, item] };
            case 'goal':     return { ...state, goals: [...state.goals, item] };
          }
        });
      },
      chooseDate: (yyyymmdd: string) => {
        set(state => ({ ...state, chosenDate: yyyymmdd }))
      },
    }
  };
});