"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "DueOrDie-goals";

export function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export function addDays(dateStr, n) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

function daysBetween(a, b) {
  return Math.floor((new Date(b) - new Date(a)) / 86400000);
}

export function totalTopicDays(topics) {
  return topics.reduce(
    (sum, t) => sum + (typeof t === "object" ? t.days || 1 : 1),
    0,
  );
}

export function buildSchedule(goal) {
  const { topics, startDate, deadlineDays, mode, dailyLogs } = goal;
  const today = todayStr();
  const endDate = addDays(startDate, deadlineDays - 1);

  const normalizedTopics = topics.map((t) =>
    typeof t === "string"
      ? { name: t, days: 1 }
      : { name: t.name || t, days: t.days || 1 },
  );

  const slots = normalizedTopics.flatMap((t) => Array(t.days).fill(t.name));
  const totalSlots = slots.length;
  const totalDays = deadlineDays;

  const dayTopicMap = Array.from({ length: totalDays }, () => []);

  if (totalSlots > 0) {
    slots.forEach((topicName, slotIdx) => {
      const dayIdx = Math.min(
        Math.floor((slotIdx * totalDays) / totalSlots),
        totalDays - 1,
      );
      if (!dayTopicMap[dayIdx].includes(topicName)) {
        dayTopicMap[dayIdx].push(topicName);
      }
    });

    for (let i = 0; i < totalDays; i++) {
      if (dayTopicMap[i].length === 0) {
        for (let back = i - 1; back >= 0; back--) {
          if (dayTopicMap[back].length > 0) {
            dayTopicMap[i] = [...dayTopicMap[back]];
            break;
          }
        }
      }
    }
  }

  let plan = Array.from({ length: totalDays }, (_, i) => ({
    date: addDays(startDate, i),
    topics: dayTopicMap[i] || [],
    extra: [],
  }));

  let pendingBacklog = [];

  plan = plan.map((day) => {
    const log = dailyLogs?.[day.date];

    if (!log) {
      const isPast = day.date < today;
      if (isPast) {
        // Push all topics from this missed day into backlog
        pendingBacklog.push(...day.topics);
        return { ...day, status: "missed", completedTopics: [] };
      }
      return {
        ...day,
        status: day.date === today ? "today" : "upcoming",
        completedTopics: [],
      };
    }

    // ── KEY FIX ──────────────────────────────────────────────────────────────
    // If this day has a log, check for skipped topics BUT exclude anything
    // already marked as clearedBacklog. This prevents cleared backlog items
    // from being re-added to pendingBacklog on every render.
    const clearedBacklog = log.clearedBacklogTopics || [];

    if (!log.completed) {
      const skipped = (log.skippedTopics || []).filter(
        (t) => !clearedBacklog.includes(t),
      );
      pendingBacklog.push(...skipped);
    }
    // ─────────────────────────────────────────────────────────────────────────

    return {
      ...day,
      status: log.completed ? "done" : "missed",
      completedTopics: log.completedTopics || [],
      skippedTopics: log.skippedTopics || [],
    };
  });

  // Redistribute backlog
  if (pendingBacklog.length > 0) {
    const futureDays = plan.filter(
      (d) => d.date >= today && d.status !== "done",
    );

    if (mode === "hard") {
      const nextDay = futureDays[0];
      if (nextDay) {
        nextDay.extra = [...pendingBacklog];
        nextDay.hasBacklog = true;
      }
    } else {
      const spreadOver = Math.min(3, futureDays.length);
      const perDay = Math.ceil(pendingBacklog.length / Math.max(spreadOver, 1));
      for (let i = 0; i < spreadOver; i++) {
        if (futureDays[i]) {
          const slice = pendingBacklog.splice(0, perDay);
          futureDays[i].extra = [...(futureDays[i].extra || []), ...slice];
          futureDays[i].hasBacklog = true;
        }
      }
    }
  }

  return { plan, endDate };
}

export function computeStats(goal) {
  const { plan } = buildSchedule(goal);
  const today = todayStr();

  const totalTopics = goal.topics.length;
  const doneDays = plan.filter((d) => d.status === "done").length;
  const missedDays = plan.filter((d) => d.status === "missed").length;
  const completedTopics = plan
    .filter((d) => d.status === "done")
    .flatMap((d) => d.completedTopics || []).length;

  const backlogTopics = plan
    .filter((d) => d.hasBacklog)
    .reduce((acc, d) => acc + (d.extra?.length || 0), 0);

  const progress =
    totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const totalDays = goal.deadlineDays;
  const elapsed = Math.max(0, daysBetween(goal.startDate, today));
  const remaining = Math.max(0, totalDays - elapsed);

  const completionRate = elapsed > 0 ? completedTopics / elapsed : 0;
  const projectedTotal = completionRate * totalDays;
  const onTrack = projectedTotal >= totalTopics * 0.9;

  let streak = 0;
  const sortedDays = [...plan].reverse();
  for (const day of sortedDays) {
    if (day.date > today) continue;
    if (day.status === "done") streak++;
    else break;
  }

  const panicLevel = Math.min(
    100,
    missedDays * 15 + backlogTopics * 5 + (!onTrack && elapsed > 3 ? 20 : 0),
  );

  return {
    totalTopics,
    doneDays,
    missedDays,
    completedTopics,
    backlogTopics,
    progress,
    remaining,
    elapsed,
    onTrack,
    streak,
    panicLevel,
  };
}

export function useGoals() {
  const [goals, setGoals] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setGoals(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  const persist = useCallback((updated) => {
    setGoals(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const addGoal = useCallback(
    (goalData) => {
      const goal = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        startDate: todayStr(),
        dailyLogs: {},
        mode: "normal",
        ...goalData,
      };
      persist([...goals, goal]);
      return goal;
    },
    [goals, persist],
  );

  const updateGoal = useCallback(
    (id, updates) => {
      persist(goals.map((g) => (g.id === id ? { ...g, ...updates } : g)));
    },
    [goals, persist],
  );

  const deleteGoal = useCallback(
    (id) => {
      persist(goals.filter((g) => g.id !== id));
    },
    [goals, persist],
  );

  const logDay = useCallback(
    (goalId, date, { completed, completedTopics, skippedTopics }) => {
      const goal = goals.find((g) => g.id === goalId);
      if (!goal) return;
      const updatedLogs = {
        ...goal.dailyLogs,
        [date]: {
          completed,
          completedTopics,
          skippedTopics,
          loggedAt: new Date().toISOString(),
        },
      };
      updateGoal(goalId, { dailyLogs: updatedLogs });
    },
    [goals, updateGoal],
  );

  // ── NEW: persist which backlog topics were cleared so they don't reappear ──
  // Called from BacklogModal after the user marks topics as done.
  // We find the original date each topic came from and store it in that day's log.
  const clearBacklogTopics = useCallback(
    (goalId, clearedTopics) => {
      if (!clearedTopics.length) return;
      const goal = goals.find((g) => g.id === goalId);
      if (!goal) return;

      const { plan } = buildSchedule(goal);
      const today = todayStr();

      // For each cleared topic, find the past day that originally had it
      // and record it as clearedBacklog in that day's log.
      const updatedLogs = { ...goal.dailyLogs };

      clearedTopics.forEach((topic) => {
        // Find the earliest past day whose scheduled topics include this topic
        // and which doesn't already have a "done" log
        const originDay = plan.find(
          (d) =>
            d.date < today && d.topics.includes(topic) && d.status !== "done",
        );

        const dateKey = originDay ? originDay.date : today;
        const existing = updatedLogs[dateKey] || {};
        const alreadyCleared = existing.clearedBacklogTopics || [];

        if (!alreadyCleared.includes(topic)) {
          updatedLogs[dateKey] = {
            completed: existing.completed || false,
            completedTopics: existing.completedTopics || [],
            skippedTopics: existing.skippedTopics || [],
            ...existing,
            clearedBacklogTopics: [...alreadyCleared, topic],
            loggedAt: existing.loggedAt || new Date().toISOString(),
          };
        }
      });

      updateGoal(goalId, { dailyLogs: updatedLogs });
    },
    [goals, updateGoal],
  );
  // ─────────────────────────────────────────────────────────────────────────

  return {
    goals,
    loaded,
    addGoal,
    updateGoal,
    deleteGoal,
    logDay,
    clearBacklogTopics,
  };
}
