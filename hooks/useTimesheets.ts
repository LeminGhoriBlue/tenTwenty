import { useState, useCallback } from 'react';
import http from '@/lib/http';
import type { Week, TimesheetEntry } from '@/lib/types';

const TIMESHEETS_STORAGE_KEY = 'ticktock.timesheets.db';

interface TimesheetStorage {
  weeks: Week[];
  entries: TimesheetEntry[];
}

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function getWeekStatus(totalHours: number) {
  if (totalHours === 0) return 'Missing';
  if (totalHours < 40) return 'Incomplete';
  if (totalHours > 40) return 'Overtime';
  return 'Completed';
}

function syncWeekStatuses(weeks: Week[], entries: TimesheetEntry[]) {
  return weeks.map((week) => {
    const total = entries
      .filter((entry) => entry.weekId === week.id)
      .reduce((sum, entry) => sum + Number(entry.hours), 0);

    return {
      ...week,
      status: getWeekStatus(total),
    };
  });
}

export function useTimesheets() {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const readStorage = useCallback((): TimesheetStorage | null => {
    if (!canUseLocalStorage()) return null;

    try {
      const raw = window.localStorage.getItem(TIMESHEETS_STORAGE_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw) as Partial<TimesheetStorage>;
      return {
        weeks: Array.isArray(parsed.weeks) ? (parsed.weeks as Week[]) : [],
        entries: Array.isArray(parsed.entries) ? (parsed.entries as TimesheetEntry[]) : [],
      };
    } catch {
      return null;
    }
  }, []);

  const writeStorage = useCallback((next: TimesheetStorage) => {
    if (!canUseLocalStorage()) return;
    window.localStorage.setItem(TIMESHEETS_STORAGE_KEY, JSON.stringify(next));
  }, []);

  const fetchWeeks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const local = readStorage();
      if (local && local.weeks.length > 0) {
        setWeeks(syncWeekStatuses(local.weeks, local.entries));
        return;
      }

      const data = await http.get<Week[]>('/timesheets');
      const normalized = syncWeekStatuses(data, local?.entries ?? []);
      setWeeks(normalized);
      writeStorage({
        weeks: normalized,
        entries: local?.entries ?? [],
      });
    } catch (err: unknown) {
      setError((err as { message: string }).message);
    } finally {
      setLoading(false);
    }
  }, [readStorage, writeStorage]);

  const fetchEntries = useCallback(async (weekId: string) => {
    setLoading(true);
    setError('');
    try {
      const local = readStorage();
      if (local) {
        const localEntries = local.entries.filter((entry) => entry.weekId === weekId);
        if (local.weeks.length > 0) {
          setEntries(localEntries);
          return;
        }
      }

      const data = await http.get<TimesheetEntry[]>(`/timesheets/${weekId}/entries`);
      const nextEntries = [...(local?.entries ?? []), ...data];
      const dedupedEntries = Array.from(
        new Map(nextEntries.map((entry) => [entry.id, entry])).values()
      );

      setEntries(data);
      if (dedupedEntries.length > 0 || (local?.weeks?.length ?? 0) > 0) {
        setWeeks((prev) => {
          const sourceWeeks = (local?.weeks?.length ?? 0) > 0 ? local!.weeks : prev;
          return syncWeekStatuses(sourceWeeks, dedupedEntries);
        });
        writeStorage({
          weeks: syncWeekStatuses(local?.weeks ?? [], dedupedEntries),
          entries: dedupedEntries,
        });
      }
    } catch (err: unknown) {
      setError((err as { message: string }).message);
    } finally {
      setLoading(false);
    }
  }, [readStorage, writeStorage]);

  const createWeek = useCallback(async (payload: Partial<Week>) => {
    setLoading(true);
    setError('');
    try {
      const local = readStorage();
      const currentWeeks = local?.weeks ?? weeks;
      const currentEntries = local?.entries ?? [];
      const created: Week = {
        id: `w${Date.now()}`,
        weekNumber: Number(payload.weekNumber ?? 0),
        startDate: String(payload.startDate ?? ''),
        endDate: String(payload.endDate ?? ''),
        status: String(payload.status ?? 'Missing'),
      };
      const nextWeeks = [...currentWeeks, created];
      const syncedWeeks = syncWeekStatuses(nextWeeks, currentEntries);

      setWeeks(syncedWeeks);
      writeStorage({
        weeks: syncedWeeks,
        entries: currentEntries,
      });
    } catch (err: unknown) {
      setError((err as { message: string }).message);
    } finally {
      setLoading(false);
    }
  }, [readStorage, weeks, writeStorage]);

  const updateWeek = useCallback(async (id: string, payload: Partial<Week>) => {
    setError('');
    try {
      const local = readStorage();
      const currentWeeks = local?.weeks ?? weeks;
      const currentEntries = local?.entries ?? [];
      const nextWeeks = currentWeeks.map((week) =>
        week.id === id ? { ...week, ...payload } : week
      );
      const syncedWeeks = syncWeekStatuses(nextWeeks, currentEntries);

      setWeeks(syncedWeeks);
      writeStorage({
        weeks: syncedWeeks,
        entries: currentEntries,
      });
    } catch (err: unknown) {
      setError((err as { message: string }).message);
    }
  }, [readStorage, weeks, writeStorage]);

  const deleteWeek = useCallback(async (id: string) => {
    setLoading(true);
    setError('');
    try {
      const local = readStorage();
      const currentWeeks = local?.weeks ?? weeks;
      const currentEntries = local?.entries ?? [];
      const nextWeeks = currentWeeks.filter((week) => week.id !== id);
      const nextEntries = currentEntries.filter((entry) => entry.weekId !== id);
      const syncedWeeks = syncWeekStatuses(nextWeeks, nextEntries);

      setWeeks(syncedWeeks);
      setEntries((prev) => prev.filter((entry) => entry.weekId !== id));
      writeStorage({
        weeks: syncedWeeks,
        entries: nextEntries,
      });
    } catch (err: unknown) {
      setError((err as { message: string }).message);
    } finally {
      setLoading(false);
    }
  }, [readStorage, weeks, writeStorage]);

  const createEntry = useCallback(
    async (weekId: string, payload: Partial<TimesheetEntry>) => {
      setLoading(true);
      setError('');
      try {
        const local = readStorage();
        const currentWeeks = local?.weeks ?? weeks;
        const currentEntries = local?.entries ?? [];
        const created: TimesheetEntry = {
          id: `e${Date.now()}`,
          weekId,
          date: String(payload.date ?? ''),
          hours: Number(payload.hours ?? 0),
          description: String(payload.description ?? ''),
          project: String(payload.project ?? ''),
          workType: String(payload.workType ?? ''),
        };
        const nextEntries = [...currentEntries, created];
        const nextWeeks = syncWeekStatuses(currentWeeks, nextEntries);

        setEntries(nextEntries.filter((entry) => entry.weekId === weekId));
        setWeeks(nextWeeks);
        writeStorage({
          weeks: nextWeeks,
          entries: nextEntries,
        });
      } catch (err: unknown) {
        setError((err as { message: string }).message);
      } finally {
        setLoading(false);
      }
    },
    [readStorage, weeks, writeStorage]
  );

  const updateEntry = useCallback(
    async (
      weekId: string,
      entryId: string,
      payload: Partial<TimesheetEntry>
    ) => {
      setError('');
      try {
        const local = readStorage();
        const currentWeeks = local?.weeks ?? weeks;
        const currentEntries = local?.entries ?? [];
        const nextEntries = currentEntries.map((entry) =>
          entry.id === entryId && entry.weekId === weekId
            ? { ...entry, ...payload, hours: Number(payload.hours ?? entry.hours) }
            : entry
        );
        const nextWeeks = syncWeekStatuses(currentWeeks, nextEntries);

        setEntries(nextEntries.filter((entry) => entry.weekId === weekId));
        setWeeks(nextWeeks);
        writeStorage({
          weeks: nextWeeks,
          entries: nextEntries,
        });
      } catch (err: unknown) {
        setError((err as { message: string }).message);
      }
    },
    [readStorage, weeks, writeStorage]
  );

  const deleteEntry = useCallback(async (weekId: string, entryId: string) => {
    setLoading(true);
    setError('');
    try {
      const local = readStorage();
      const currentWeeks = local?.weeks ?? weeks;
      const currentEntries = local?.entries ?? [];
      const nextEntries = currentEntries.filter(
        (entry) => !(entry.id === entryId && entry.weekId === weekId)
      );
      const nextWeeks = syncWeekStatuses(currentWeeks, nextEntries);

      setEntries(nextEntries.filter((entry) => entry.weekId === weekId));
      setWeeks(nextWeeks);
      writeStorage({
        weeks: nextWeeks,
        entries: nextEntries,
      });
    } catch (err: unknown) {
      setError((err as { message: string }).message);
    } finally {
      setLoading(false);
    }
  }, [readStorage, weeks, writeStorage]);

  return {
    weeks,
    entries,
    loading,
    error,
    fetchWeeks,
    fetchEntries,
    createWeek,
    updateWeek,
    deleteWeek,
    createEntry,
    updateEntry,
    deleteEntry,
  };
}
