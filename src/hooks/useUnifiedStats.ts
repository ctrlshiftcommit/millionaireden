import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface UnifiedStats {
	total_exp: number;
	current_level: number;
	lunar_crystals: number;
	created_at: string;
	updated_at: string;
}

interface HabitStats {
	totalCompleted: number;
	maxStreak: number;
	completionRate: number;
	habitsToday: number;
	totalHabits: number;
}

interface LevelInfo {
	level: number;
	title: string;
	description: string;
	pointsRequired: number;
	nextLevelPoints: number;
	progress: number;
}

interface DailyExpData {
	date: string;
	exp: number;
}

interface LevelHistoryEntry {
	id: string;
	old_level: number;
	new_level: number;
	exp_at_levelup: number;
	created_at: string;
}

interface ExpTransactionItem {
	id: string;
	created_at: string;
	amount: number;
	description: string;
	type: string;
}

const levelTitles = [
	{ level: 0, title: 'Novice', pointsRequired: 0, description: 'Just starting your journey.' },
	{ level: 1, title: 'Peasant', pointsRequired: 1000, description: 'Just a commoner, struggling to survive.' },
	{ level: 2, title: 'Servant', pointsRequired: 5000, description: 'Just a commoner, struggling to survive.' },
	{ level: 3, title: 'Recruit', pointsRequired: 12000, description: 'A fresh fighter with basic combat knowledge.' },
	{ level: 4, title: 'Soldier', pointsRequired: 20000, description: 'Trained and battle-ready, part of a greater force.' },
	{ level: 5, title: 'Mercenary', pointsRequired: 30000, description: 'A seasoned warrior fighting for coin and glory.' },
	{ level: 6, title: 'Knight', pointsRequired: 42000, description: 'Honorable, skilled, and a recognized fighter.' },
	{ level: 7, title: 'Slayer', pointsRequired: 55000, description: 'Feared in battle, taking down foes with ruthless efficiency.' },
	{ level: 8, title: 'Warlord', pointsRequired: 69000, description: 'Commands warriors, leads conquests, and inspires fear.' },
	{ level: 9, title: 'Champion', pointsRequired: 84000, description: 'A master combatant, known far and wide.' },
	{ level: 10, title: 'Elite Warrior', pointsRequired: 100000, description: 'The absolute peak, an unstoppable force in battle.' },
];

export const useUnifiedStats = () => {
	const [stats, setStats] = useState<UnifiedStats | null>(null);
	const [loading, setLoading] = useState(true);
	const { user } = useAuth();
	const { toast } = useToast();

	useEffect(() => {
		if (user) {
			fetchStats();
		} else {
			setLoading(false);
		}
	}, [user]);

	const fetchStats = async () => {
		if (!user) return;

		try {
			const { data, error } = await supabase
				.from('user_experience')
				.select('*')
				.eq('user_id', user.id)
				.maybeSingle();

			if (error && error.code !== 'PGRST116') {
				console.error('Error fetching stats:', error);
				return;
			}

			if (data) {
				setStats(data);
			}
		} catch (error) {
			console.error('Error in fetchStats:', error);
		} finally {
			setLoading(false);
		}
	};

	const addEXP = async (amount: number, source: string = 'Unknown'): Promise<boolean> => {
		if (!user || !stats) return false;

		const oldLevel = getLevelInfo().level;
		const newTotalExp = stats.total_exp + amount;
		const newLevel = calculateLevel(newTotalExp);
		const leveledUp = newLevel > oldLevel;

		try {
			// Update user experience
			const { error: updateError } = await supabase
				.from('user_experience')
				.update({
					total_exp: newTotalExp,
					current_level: newLevel,
					updated_at: new Date().toISOString()
				})
				.eq('user_id', user.id);

			if (updateError) throw updateError;

			// Record EXP transaction
			const { error: transactionError } = await supabase
				.from('exp_transactions')
				.insert([{ 
					user_id: user.id, 
					type: 'habit_completed', 
					amount, 
					description: source, 
					source, 
					old_level: oldLevel, 
					new_level: newLevel 
				}]);

			if (transactionError) {
				console.error('Error recording transaction:', transactionError);
			}

			// Record level history if leveled up
			if (leveledUp) {
				const { error: levelError } = await supabase
					.from('level_history')
					.insert([{ 
						user_id: user.id, 
						old_level: oldLevel, 
						new_level: newLevel, 
						exp_at_levelup: newTotalExp 
					}]);

				if (levelError) {
					console.error('Error recording level history:', levelError);
				}

				toast({
					title: "🎉 Level Up!",
					description: `Congratulations! You reached Level ${newLevel}: ${levelTitles[newLevel]?.title || 'Elite Warrior'}!`,
				});
			}

			// Update local state
			setStats(prev => prev ? {
				...prev,
				total_exp: newTotalExp,
				current_level: newLevel,
				updated_at: new Date().toISOString()
			} : null);

			return leveledUp;
		} catch (error) {
			console.error('Error adding EXP:', error);
			toast({
				title: "Error",
				description: "Failed to update experience points.",
				variant: "destructive"
			});
			return false;
		}
	};

	const addLunarCrystals = async (amount: number, source: string = 'Achievement'): Promise<void> => {
		if (!user || !stats) return;

		try {
			const newCrystals = stats.lunar_crystals + amount;

			const { error } = await supabase
				.from('user_experience')
				.update({
					lunar_crystals: newCrystals,
					updated_at: new Date().toISOString()
				})
				.eq('user_id', user.id);

			if (error) throw error;

			// Update local state
			setStats(prev => prev ? {
				...prev,
				lunar_crystals: newCrystals,
				updated_at: new Date().toISOString()
			} : null);

			toast({
				title: "💎 Crystals Earned!",
				description: `+${amount} Lunar Crystals from ${source}`,
			});
		} catch (error) {
			console.error('Error adding crystals:', error);
			toast({
				title: "Error",
				description: "Failed to update Lunar Crystals.",
				variant: "destructive"
			});
		}
	};

	const spendLunarCrystals = async (amount: number, purpose: string = 'Purchase'): Promise<boolean> => {
		if (!user || !stats) return false;

		if (stats.lunar_crystals < amount) {
			toast({
				title: "Insufficient Crystals",
				description: `You need ${amount} crystals but only have ${stats.lunar_crystals}.`,
				variant: "destructive"
			});
			return false;
		}

		try {
			const newCrystals = stats.lunar_crystals - amount;

			const { error } = await supabase
				.from('user_experience')
				.update({
					lunar_crystals: newCrystals,
					updated_at: new Date().toISOString()
				})
				.eq('user_id', user.id);

			if (error) throw error;

			// Update local state
			setStats(prev => prev ? {
				...prev,
				lunar_crystals: newCrystals,
				updated_at: new Date().toISOString()
			} : null);

			return true;
		} catch (error) {
			console.error('Error spending crystals:', error);
			toast({
				title: "Error",
				description: "Failed to process crystal transaction.",
				variant: "destructive"
			});
			return false;
		}
	};

	const convertExpToCrystals = async (expAmount: number, rate: number = 100): Promise<boolean> => {
		if (!user || !stats) return false;
		if (expAmount <= 0 || stats.total_exp < expAmount) return false;

		const crystalsToAdd = Math.floor(expAmount / rate);
		const newExp = stats.total_exp - expAmount;
		const newLevel = calculateLevel(newExp);
		const newCrystals = stats.lunar_crystals + crystalsToAdd;

		try {
			const { error: updateError } = await supabase
				.from('user_experience')
				.update({
					total_exp: newExp,
					current_level: newLevel,
					lunar_crystals: newCrystals,
					updated_at: new Date().toISOString()
				})
				.eq('user_id', user.id);

			if (updateError) throw updateError;

			const { error: txError } = await supabase
				.from('exp_transactions')
				.insert([{ 
					user_id: user.id, 
					type: 'conversion_loss', 
					amount: -expAmount, 
					description: `Converted ${expAmount} EXP to ${crystalsToAdd} crystals` 
				}]);

			if (txError) console.error('Error recording conversion transaction:', txError);

			setStats(prev => prev ? {
				...prev,
				total_exp: newExp,
				current_level: newLevel,
				lunar_crystals: newCrystals,
				updated_at: new Date().toISOString()
			} : null);

			return true;
		} catch (error) {
			console.error('Error converting EXP to crystals:', error);
			toast({
				title: 'Error',
				description: 'Failed to convert EXP to crystals.',
				variant: 'destructive'
			});
			return false;
		}
	};

	const calculateLevel = (totalExp: number): number => {
		for (let i = levelTitles.length - 1; i >= 0; i--) {
			if (totalExp >= levelTitles[i].pointsRequired) {
				return i;
			}
		}
		return 0;
	};

	const getLevelInfo = (): LevelInfo => {
		const exp = stats?.total_exp || 0;
		const level = calculateLevel(exp);
		const currentLevelData = levelTitles[level] || levelTitles[0];
		const nextLevelData = levelTitles[level + 1];

		const pointsRequired = currentLevelData.pointsRequired;
		const nextLevelPoints = nextLevelData?.pointsRequired || currentLevelData.pointsRequired;
		const progress = nextLevelData ? 
			(exp - pointsRequired) / (nextLevelPoints - pointsRequired) : 1;

		return {
			level,
			title: currentLevelData.title,
			description: currentLevelData.description,
			pointsRequired,
			nextLevelPoints,
			progress: Math.min(progress, 1)
		};
	};

	const getExpProgressData = async (days: number = 30): Promise<DailyExpData[]> => {
		if (!user) return [];

		const end = new Date();
		const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);

		const { data, error } = await supabase
			.from('exp_transactions')
			.select('created_at, amount, type')
			.eq('user_id', user.id)
			.gte('created_at', start.toISOString())
			.lte('created_at', end.toISOString())
			.order('created_at');

		if (error) {
			console.error('Error fetching EXP progress data:', error);
			return [];
		}

		const byDate = new Map<string, number>();
		for (let i = 0; i < days; i++) {
			const d = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
			const key = d.toISOString().split('T')[0];
			byDate.set(key, 0);
		}

		(data || []).forEach(row => {
			if (row.type === 'task_completed' || row.type === 'habit_completed') {
				const key = new Date(row.created_at).toISOString().split('T')[0];
				byDate.set(key, (byDate.get(key) || 0) + (row.amount || 0));
			}
		});

		return Array.from(byDate.entries()).map(([date, exp]) => ({ date, exp }));
	};

const getLevelHistory = async (limit: number = 50): Promise<LevelHistoryEntry[]> => {
	if (!user) return [] as LevelHistoryEntry[];

	const { data, error } = await supabase
		.from('level_history')
		.select('id, old_level, new_level, exp_at_levelup, created_at')
		.eq('user_id', user.id)
		.order('created_at', { ascending: false })
		.limit(limit);

	if (error) {
		console.error('Error fetching level history:', error);
		return [] as LevelHistoryEntry[];
	}

	return (data as LevelHistoryEntry[]) || [] as LevelHistoryEntry[];
};

const getRecentExpTransactions = async (limit: number = 15): Promise<ExpTransactionItem[]> => {
	if (!user) return [] as ExpTransactionItem[];

	const { data, error } = await supabase
		.from('exp_transactions')
		.select('id, created_at, amount, description, type')
		.eq('user_id', user.id)
		.order('created_at', { ascending: false })
		.limit(limit);

	if (error) {
		console.error('Error fetching EXP transactions:', error);
		return [] as ExpTransactionItem[];
	}

	return (data as ExpTransactionItem[]) || [] as ExpTransactionItem[];
};

	const getHabitStats = async (): Promise<HabitStats> => {
		if (!user) {
			return {
				totalCompleted: 0,
				maxStreak: 0,
				completionRate: 0,
				habitsToday: 0,
				totalHabits: 0
			};
		}

		try {
			// Get total habits count
			const { data: habitsData } = await supabase
				.from('habits')
				.select('id')
				.eq('user_id', user.id)
				.eq('is_active', true);

			const totalHabits = habitsData?.length || 0;

			// Get today's completions
			const today = new Date().toISOString().split('T')[0];
			const { data: todayCompletions } = await supabase
				.from('habit_completions')
				.select('id')
				.eq('user_id', user.id)
				.eq('completed_date', today);

			const habitsToday = todayCompletions?.length || 0;

			// Get total completions
			const { data: allCompletions } = await supabase
				.from('habit_completions')
				.select('id')
				.eq('user_id', user.id);

			const totalCompleted = allCompletions?.length || 0;

			// Calculate completion rate
			const completionRate = totalHabits > 0 ? (habitsToday / totalHabits) * 100 : 0;

			// For now, use a simple max streak calculation
			// This could be improved with more complex streak logic
			const maxStreak = Math.floor(totalCompleted / Math.max(totalHabits, 1));

			return {
				totalCompleted,
				maxStreak,
				completionRate,
				habitsToday,
				totalHabits
			};
		} catch (error) {
			console.error('Error calculating habit stats:', error);
			return {
				totalCompleted: 0,
				maxStreak: 0,
				completionRate: 0,
				habitsToday: 0,
				totalHabits: 0
			};
		}
	};

	return {
		stats,
		loading,
		addEXP,
		addLunarCrystals,
		spendLunarCrystals,
		convertExpToCrystals,
		getLevelInfo,
		getExpProgressData,
		getLevelHistory,
		getRecentExpTransactions,
		getHabitStats,
		refetch: fetchStats
	};
};