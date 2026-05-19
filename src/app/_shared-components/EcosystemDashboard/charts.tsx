// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable react/function-component-definition */

'use client';

import React, { useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const fmtUsdCompact = (n: number): string => {
	if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
	if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
	if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
	return `$${n.toFixed(0)}`;
};

const useThemeTokens = () => {
	const [tokens, setTokens] = useState({
		grid: '#E2E8F0',
		text: '#64748B',
		accent: '#E6007A',
		bar: '#0F172A',
		tooltipBg: '#0F172A',
		tooltipText: '#ffffff',
		pie: ['#1E293B', '#475569', '#94A3B8', '#CBD5E1', '#E2E8F0']
	});

	useEffect(() => {
		const read = () => {
			const root = document.querySelector('.ecosystem-observatory');
			const cs = root ? getComputedStyle(root) : getComputedStyle(document.documentElement);
			setTokens({
				grid: cs.getPropertyValue('--grid').trim() || '#E2E8F0',
				text: cs.getPropertyValue('--text-faint').trim() || '#64748B',
				accent: cs.getPropertyValue('--accent').trim() || '#E6007A',
				bar: cs.getPropertyValue('--bar-fill').trim() || '#0F172A',
				tooltipBg: cs.getPropertyValue('--tooltip-bg').trim() || '#0F172A',
				tooltipText: cs.getPropertyValue('--tooltip-text').trim() || '#ffffff',
				pie: [
					cs.getPropertyValue('--pie-1').trim() || '#1E293B',
					cs.getPropertyValue('--pie-2').trim() || '#475569',
					cs.getPropertyValue('--pie-3').trim() || '#94A3B8',
					cs.getPropertyValue('--pie-4').trim() || '#CBD5E1',
					cs.getPropertyValue('--pie-5').trim() || '#E2E8F0'
				]
			});
		};
		read();
		const root = document.querySelector('.ecosystem-observatory');
		if (!root) return undefined;
		const obs = new MutationObserver(read);
		obs.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
		return () => obs.disconnect();
	}, []);

	return tokens;
};

const tooltipStyle = (bg: string, fg: string): React.CSSProperties => ({
	background: bg,
	border: 'none',
	borderRadius: 6,
	color: fg,
	fontSize: 12,
	padding: '8px 10px',
	boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
});

export const TimeAreaChart: React.FC<{
	data: { period: string; value: number; label?: string; annotation?: string }[];
	height?: number;
	yFormatter?: (n: number) => string;
	annotatePeak?: boolean;
	valueLabel?: string;
}> = ({ data, height = 280, yFormatter = fmtUsdCompact, annotatePeak, valueLabel = 'Value' }) => {
	const t = useThemeTokens();
	const peak = annotatePeak ? data.reduce((p, c) => (c.value > p.value ? c : p), data[0]) : null;
	return (
		<ResponsiveContainer
			width='100%'
			height={height}
		>
			<AreaChart
				data={data}
				margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
			>
				<defs>
					<linearGradient
						id='areaAccent'
						x1='0'
						y1='0'
						x2='0'
						y2='1'
					>
						<stop
							offset='0%'
							stopColor={t.accent}
							stopOpacity={0.22}
						/>
						<stop
							offset='100%'
							stopColor={t.accent}
							stopOpacity={0}
						/>
					</linearGradient>
				</defs>
				<CartesianGrid
					stroke={t.grid}
					vertical={false}
				/>
				<XAxis
					dataKey='label'
					tick={{ fontSize: 11, fill: t.text }}
					axisLine={{ stroke: t.grid }}
					tickLine={false}
				/>
				<YAxis
					tick={{ fontSize: 11, fill: t.text }}
					axisLine={false}
					tickLine={false}
					tickFormatter={yFormatter}
					width={56}
				/>
				<Tooltip
					contentStyle={tooltipStyle(t.tooltipBg, t.tooltipText)}
					formatter={(v) => [yFormatter(Number(v ?? 0)), valueLabel]}
					labelFormatter={(label) => label}
					labelStyle={{ color: t.tooltipText, fontSize: 11, opacity: 0.7, marginBottom: 2 }}
					cursor={{ stroke: t.text, strokeOpacity: 0.4, strokeDasharray: '3 3' }}
				/>
				<Area
					type='monotone'
					dataKey='value'
					stroke={t.accent}
					strokeWidth={2}
					fill='url(#areaAccent)'
				/>
				{peak && (
					<ReferenceLine
						x={peak.label}
						stroke={t.accent}
						strokeDasharray='3 3'
						strokeOpacity={0.4}
						label={{ value: 'Peak', position: 'top', fill: t.accent, fontSize: 10, fontWeight: 600 }}
					/>
				)}
			</AreaChart>
		</ResponsiveContainer>
	);
};

export const YearBarChart: React.FC<{
	data: { year: string; usd: number }[];
	height?: number;
	valueLabel?: string;
}> = ({ data, height = 240, valueLabel = 'Spend' }) => {
	const t = useThemeTokens();
	return (
		<ResponsiveContainer
			width='100%'
			height={height}
		>
			<BarChart
				data={data}
				margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
			>
				<CartesianGrid
					stroke={t.grid}
					vertical={false}
				/>
				<XAxis
					dataKey='year'
					tick={{ fontSize: 11, fill: t.text }}
					axisLine={{ stroke: t.grid }}
					tickLine={false}
				/>
				<YAxis
					tick={{ fontSize: 11, fill: t.text }}
					axisLine={false}
					tickLine={false}
					tickFormatter={fmtUsdCompact}
					width={56}
				/>
				<Tooltip
					contentStyle={tooltipStyle(t.tooltipBg, t.tooltipText)}
					formatter={(v) => [fmtUsdCompact(Number(v ?? 0)), valueLabel]}
					labelFormatter={(label) => `Year ${label}`}
					labelStyle={{ color: t.tooltipText, fontSize: 11, opacity: 0.7, marginBottom: 2 }}
					cursor={{ fill: t.text, fillOpacity: 0.06 }}
				/>
				<Bar
					dataKey='usd'
					fill={t.bar}
					radius={[3, 3, 0, 0]}
					maxBarSize={56}
				/>
			</BarChart>
		</ResponsiveContainer>
	);
};

export const QuarterBarChart: React.FC<{
	data: { period: string; value: number; label?: string }[];
	height?: number;
	valueLabel?: string;
}> = ({ data, height = 220, valueLabel = 'Referenda' }) => {
	const t = useThemeTokens();
	return (
		<ResponsiveContainer
			width='100%'
			height={height}
		>
			<BarChart
				data={data}
				margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
			>
				<CartesianGrid
					stroke={t.grid}
					vertical={false}
				/>
				<XAxis
					dataKey='label'
					tick={{ fontSize: 10, fill: t.text }}
					axisLine={{ stroke: t.grid }}
					tickLine={false}
				/>
				<YAxis
					tick={{ fontSize: 11, fill: t.text }}
					axisLine={false}
					tickLine={false}
					width={36}
				/>
				<Tooltip
					contentStyle={tooltipStyle(t.tooltipBg, t.tooltipText)}
					formatter={(v) => [Number(v ?? 0).toLocaleString(), valueLabel]}
					labelFormatter={(label) => label}
					labelStyle={{ color: t.tooltipText, fontSize: 11, opacity: 0.7, marginBottom: 2 }}
					cursor={{ fill: t.text, fillOpacity: 0.06 }}
				/>
				<Bar
					dataKey='value'
					fill={t.bar}
					radius={[3, 3, 0, 0]}
					maxBarSize={36}
				/>
			</BarChart>
		</ResponsiveContainer>
	);
};

export const SharePie: React.FC<{
	data: { name: string; value: number }[];
	height?: number;
	formatter?: (v: number) => string;
}> = ({ data, height = 240, formatter }) => {
	const t = useThemeTokens();
	const fmt = formatter || ((v: number) => `${v.toFixed(2)}%`);
	return (
		<ResponsiveContainer
			width='100%'
			height={height}
		>
			<PieChart>
				<Pie
					data={data}
					dataKey='value'
					nameKey='name'
					cx='50%'
					cy='50%'
					innerRadius={56}
					outerRadius={92}
					paddingAngle={1}
					stroke='var(--bg-elev)'
					strokeWidth={2}
				>
					{data.map((entry, i) => (
						<Cell
							key={entry.name}
							fill={t.pie[i % t.pie.length]}
						/>
					))}
				</Pie>
				<Tooltip
					contentStyle={tooltipStyle(t.tooltipBg, t.tooltipText)}
					formatter={(v, name) => [fmt(Number(v ?? 0)), String(name)]}
					separator=' · '
				/>
			</PieChart>
		</ResponsiveContainer>
	);
};

export const InlineBar: React.FC<{ percent: number; tone?: 'accent' | 'neutral' }> = ({ percent, tone = 'accent' }) => (
	<div className='h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]'>
		<div
			className='h-full rounded-full transition-all'
			style={{ width: `${Math.min(100, Math.max(0, percent))}%`, background: tone === 'accent' ? 'var(--accent)' : 'var(--text)' }}
		/>
	</div>
);
