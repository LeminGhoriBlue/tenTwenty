import { useState, useCallback } from 'react';
import http from '@/lib/http';
import type { Week, TimesheetEntry } from '@/lib/types';

export function useTimesheets() {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeeks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await http.get('/timesheets');
      setWeeks(data as Week[]);
    } catch (err: unknown) {
      setError((err as { message: string }).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEntries = useCallback(async (weekId: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await http.get(`/timesheets/${weekId}/entries`);
      setEntries(data as TimesheetEntry[]);
    } catch (err: unknown) {
      setError((err as { message: string }).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createWeek = useCallback(async (payload: Partial<Week>) => {
    setLoading(true);
    setError('');
    try {
      const data = await http.post('/timesheets', payload);
      setWeeks((prev) => [...prev, data as Week]);
    } catch (err: unknown) {
      setError((err as { message: string }).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateWeek = useCallback(async (id: string, payload: Partial<Week>) => {
    setError('');
    try {
      const data = await http.put<Week>(`/timesheets/${id}`, payload);
      setWeeks((prev) => prev.map((w) => (w.id === id ? data : w)));
    } catch (err: unknown) {
      setError((err as { message: string }).message);
    }
  }, []);

  const deleteWeek = useCallback(async (id: string) => {
    setLoading(true);
    setError('');
    try {
      await http.delete(`/timesheets/${id}`);
      setWeeks((prev) => prev.filter((w) => w.id !== id));
    } catch (err: unknown) {
      setError((err as { message: string }).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createEntry = useCallback(
    async (weekId: string, payload: Partial<TimesheetEntry>) => {
      setLoading(true);
      setError('');
      try {
        const data = await http.post(`/timesheets/${weekId}/entries`, payload);
        setEntries((prev) => [...prev, data as TimesheetEntry]);
      } catch (err: unknown) {
        setError((err as { message: string }).message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateEntry = useCallback(
    async (
      weekId: string,
      entryId: string,
      payload: Partial<TimesheetEntry>
    ) => {
      setError('');
      try {
        const data = await http.put<TimesheetEntry>(
          `/timesheets/${weekId}/entries/${entryId}`,
          payload
        );
        setEntries((prev) => prev.map((e) => (e.id === entryId ? data : e)));
      } catch (err: unknown) {
        setError((err as { message: string }).message);
      }
    },
    []
  );

  const deleteEntry = useCallback(async (weekId: string, entryId: string) => {
    setLoading(true);
    setError('');
    try {
      await http.delete(`/timesheets/${weekId}/entries/${entryId}`);
      setEntries((prev) => prev.filter((e) => e.id !== entryId));
    } catch (err: unknown) {
      setError((err as { message: string }).message);
    } finally {
      setLoading(false);
    }
  }, []);

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
