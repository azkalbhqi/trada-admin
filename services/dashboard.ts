import { getSignals, Signal } from "./signal";
import { getNewInfos, Information } from "./information";

// ===== TYPES =====
export interface DashboardStats {
  totalSignals: number;
  activeSignals: number;
  runningSignals: number;
  profitSignals: number;
  profitRate: number;
  newInfos: Information[];
  activeSignalsList: Signal[];
  
}

// ===== CALCULATOR =====
const calculateStats = (signals: Signal[]) => {
  const totalSignals = signals.length;

  const activeSignals = signals.filter(
    (s) => s.status === "active"
  ).length;

  const profitSignals = signals.filter(
    (s) => s.status === "profit"
  ).length;

  const runningSignals = activeSignals; // 🔥 customizable later

  const profitRate =
    totalSignals > 0 ? (profitSignals / totalSignals) * 100 : 0;

  return {
    totalSignals,
    activeSignals,
    runningSignals,
    profitSignals,
    profitRate: Number(profitRate.toFixed(2)),
  };
};

// ===== MAIN FUNCTION =====
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const [signals, newInfos] = await Promise.all([
      getSignals(),
      getNewInfos(),
    ]);

    const stats = calculateStats(signals);

    return {
      ...stats,
      newInfos,
        activeSignalsList: signals.filter((s) => s.status === "active" || s.status === "running"),
    };
  } catch (error) {
    console.error("Dashboard Service Error:", error);

    return {
      totalSignals: 0,
      activeSignals: 0,
      runningSignals: 0,
      profitSignals: 0,
      profitRate: 0,
      newInfos: [],
        activeSignalsList: [],
    };
  }
};