// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable react/function-component-definition */

'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { IEcosystemDashboardData, ITimePoint } from '@/_shared/_data/ecosystem-dashboard/types';
import { InlineBar, QuarterBarChart, SharePie, TimeAreaChart, YearBarChart } from './charts';
import { BrandMark, ObservatoryThemeProvider, PlatformMark, PolkadotMark, ThemeToggle } from './theme';

interface Props {
	initialData: IEcosystemDashboardData;
}

type TabKey = 'overview' | 'economy' | 'treasury' | 'governance' | 'multisig' | 'network' | 'sources';

const TABS: { key: TabKey; label: string }[] = [
	{ key: 'overview', label: 'Overview' },
	{ key: 'economy', label: 'Economy' },
	{ key: 'treasury', label: 'Treasury' },
	{ key: 'governance', label: 'Governance' },
	{ key: 'multisig', label: 'Multisig' },
	{ key: 'network', label: 'Network' },
	{ key: 'sources', label: 'Sources' }
];

const fmtUsd = (n: number): string => {
	if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2).replace(/\.?0+$/, '')}B`;
	if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n >= 100_000_000 ? 0 : 1)}M`;
	if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
	return `$${n.toFixed(0)}`;
};

const fmtNum = (n: number): string => {
	if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
	if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
	return n.toLocaleString();
};

const formatDate = (iso: string): string => {
	try {
		const d = new Date(iso);
		return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
	} catch {
		return iso;
	}
};

// ---------- Primitives ----------

const Cite: React.FC<{ ids: number[] }> = ({ ids }) => (
	<sup className='ml-0.5 font-mono text-[10px] font-medium text-[var(--text-faint)]'>
		<span className='whitespace-nowrap'>
			{ids.map((id, i) => (
				<React.Fragment key={id}>
					{i > 0 && <span>·</span>}
					<a
						href={`#cite-${id}`}
						className='no-underline hover:text-[var(--accent)]'
					>
						{id}
					</a>
				</React.Fragment>
			))}
		</span>
	</sup>
);

const Panel: React.FC<{ title?: React.ReactNode; toolbar?: React.ReactNode; children: React.ReactNode; className?: string; padding?: 'normal' | 'tight' | 'flush' }> = ({
	title,
	toolbar,
	children,
	className = '',
	padding = 'normal'
}) => (
	<div className={`overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] ${className}`}>
		{(title || toolbar) && (
			<div className='flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3'>
				<div className='font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--text-faint)]'>{title}</div>
				{toolbar && <div>{toolbar}</div>}
			</div>
		)}
		<div className={padding === 'flush' ? '' : padding === 'tight' ? 'p-3' : 'p-5'}>{children}</div>
	</div>
);

const Kpi: React.FC<{ label: string; value: string; sub?: string; cite?: number[] }> = ({ label, value, sub, cite }) => (
	<div className='rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] p-4 transition hover:border-[var(--border-strong)]'>
		<div className='text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--text-faint)]'>{label}</div>
		<div className='mt-1.5 font-serif text-[24px] font-semibold tabular-nums leading-none text-[var(--text)]'>
			{value}
			{cite && <Cite ids={cite} />}
		</div>
		{sub && <div className='mt-1.5 text-[11.5px] leading-snug text-[var(--text-muted)]'>{sub}</div>}
	</div>
);

const SegToggle: React.FC<{ value: string; onChange: (v: string) => void; options: string[] }> = ({ value, onChange, options }) => (
	<div className='inline-flex rounded-md border border-[var(--border)] p-0.5'>
		{options.map((o) => (
			<button
				type='button'
				key={o}
				onClick={() => onChange(o)}
				className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
					value === o ? 'bg-[var(--text)] text-[var(--bg-elev)]' : 'text-[var(--text-faint)] hover:text-[var(--text)]'
				}`}
			>
				{o}
			</button>
		))}
	</div>
);

const StatusPill: React.FC<{ live: boolean; asOf: string }> = ({ live, asOf }) => (
	<div className='inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elev)] px-3 py-1'>
		<span className='relative flex h-2 w-2'>
			{live && <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-60' />}
			<span className='relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]' />
		</span>
		<span className='font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--text-muted)]'>
			{live ? 'Live' : 'Static'} · DOT spot refreshing · {formatDate(asOf)}
		</span>
	</div>
);

const sliceTimeline = <T extends ITimePoint>(data: T[], range: string): T[] => {
	if (range === 'All') return data;
	if (range === '1Y') return data.slice(-3);
	if (range === '2Y') return data.slice(-5);
	return data;
};

// ---------- Tabs ----------

const OverviewTab: React.FC<{ d: IEcosystemDashboardData }> = ({ d }) => {
	const maxTvl = Math.max(...d.defi.topProtocols.map((p) => p.tvlUsd));
	const maxTx = Math.max(...d.infrastructure.topParachains.map((p) => p.transactionsMillions));
	return (
		<div className='space-y-6'>
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
				{d.hero.stats.map((s) => (
					<Kpi
						key={s.label}
						label={s.label}
						value={s.value}
						sub={s.sub}
						cite={s.citations}
					/>
				))}
			</div>

			<div className='grid gap-6 lg:grid-cols-3'>
				<Panel
					title='Network market cap · 2020 — present'
					className='lg:col-span-2'
				>
					<TimeAreaChart
						data={d.economy.priceTimeline}
						annotatePeak
						valueLabel='Market cap'
					/>
					<div className='mt-3 grid grid-cols-3 gap-4 border-t border-[var(--border)] pt-3 text-[11.5px]'>
						<div>
							<div className='text-[var(--text-faint)]'>Spot</div>
							<div className='mt-0.5 font-serif text-[15px] font-semibold tabular-nums'>{d.economy.priceDisplay}</div>
						</div>
						<div>
							<div className='text-[var(--text-faint)]'>Market cap</div>
							<div className='mt-0.5 font-serif text-[15px] font-semibold tabular-nums'>{d.economy.marketCapDisplay}</div>
						</div>
						<div>
							<div className='text-[var(--text-faint)]'>ATH (Nov 4, 2021)</div>
							<div className='mt-0.5 font-serif text-[15px] font-semibold tabular-nums'>${d.economy.athPriceUsd.toFixed(2)}</div>
						</div>
					</div>
				</Panel>

				<Panel title='Treasury balance · USD-equivalent'>
					<TimeAreaChart
						data={d.treasury.balanceTimeline}
						height={200}
						annotatePeak
						valueLabel='Treasury'
					/>
					<div className='mt-3 grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-3 text-[11.5px]'>
						<div>
							<div className='text-[var(--text-faint)]'>Current</div>
							<div className='mt-0.5 font-serif text-[15px] font-semibold tabular-nums'>
								{fmtUsd(d.treasury.currentUsd)}
								<Cite ids={[3]} />
							</div>
						</div>
						<div>
							<div className='text-[var(--text-faint)]'>Peak (Q4 2021)</div>
							<div className='mt-0.5 font-serif text-[15px] font-semibold tabular-nums'>{fmtUsd(d.treasury.peakUsd)}</div>
						</div>
					</div>
				</Panel>
			</div>

			<div className='grid gap-6 lg:grid-cols-2'>
				<Panel
					title='DeFi · top protocols by TVL'
					padding='flush'
				>
					<table className='w-full border-collapse text-[13px]'>
						<tbody>
							{d.defi.topProtocols.slice(0, 6).map((p) => (
								<tr
									key={p.name}
									className='border-b border-[var(--border)] transition last:border-b-0 hover:bg-[var(--bg-soft)]'
								>
									<td className='px-4 py-2.5'>
										<div className='flex items-center gap-2'>
											<BrandMark
												name={p.name}
												size={20}
											/>
											<div>
												<div className='font-medium text-[var(--text)]'>{p.name}</div>
												<div className='flex items-center gap-1.5 text-[10.5px] text-[var(--text-faint)]'>
													<BrandMark
														name={p.chain}
														size={13}
													/>
													<span>
														{p.chain} · {p.category}
													</span>
												</div>
											</div>
										</div>
									</td>
									<td className='w-1/3 px-4 py-2.5'>
										<InlineBar
											percent={(p.tvlUsd / maxTvl) * 100}
											tone='neutral'
										/>
									</td>
									<td className='w-20 px-4 py-2.5 text-right tabular-nums text-[var(--text)]'>{fmtUsd(p.tvlUsd)}</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className='border-t border-[var(--border)] px-4 py-2.5 text-[11px] text-[var(--text-faint)]'>
						Ecosystem TVL <span className='font-medium tabular-nums text-[var(--text)]'>{fmtUsd(d.defi.totalEcosystemTvlUsd)}</span> · Stablecoins on AssetHub{' '}
						<span className='font-medium tabular-nums text-[var(--text)]'>{fmtUsd(d.defi.stablecoinSupplyUsd || 0)}</span>
						<Cite ids={d.defi.citations} />
					</div>
				</Panel>

				<Panel
					title='Top parachains by transaction volume · Q1 2025'
					padding='flush'
				>
					<table className='w-full border-collapse text-[13px]'>
						<tbody>
							{d.infrastructure.topParachains.map((p) => (
								<tr
									key={p.name}
									className='border-b border-[var(--border)] transition last:border-b-0 hover:bg-[var(--bg-soft)]'
								>
									<td className='px-4 py-2.5'>
										<div className='flex items-center gap-2 font-medium text-[var(--text)]'>
											<BrandMark
												name={p.name}
												size={20}
											/>
											<span>{p.name}</span>
										</div>
									</td>
									<td className='w-1/3 px-4 py-2.5'>
										<InlineBar
											percent={(p.transactionsMillions / maxTx) * 100}
											tone='neutral'
										/>
									</td>
									<td className='w-20 px-4 py-2.5 text-right tabular-nums text-[var(--text-muted)]'>{p.transactionsMillions.toFixed(1)}M</td>
									<td className='w-12 px-4 py-2.5 text-right tabular-nums text-[var(--text-faint)]'>{p.sharePercent.toFixed(1)}%</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className='border-t border-[var(--border)] px-4 py-2.5 text-[11px] text-[var(--text-faint)]'>
						Q1 2025 ecosystem total <span className='font-medium tabular-nums text-[var(--text)]'>{d.infrastructure.q1TransactionsMillions.toFixed(1)}M</span> transactions · −36.9%
						QoQ
						<Cite ids={[11]} />
					</div>
				</Panel>
			</div>

			<div className='grid gap-6 lg:grid-cols-3'>
				<Panel
					title='OpenGov referenda · per quarter'
					className='lg:col-span-2'
				>
					<QuarterBarChart
						data={d.openGov.referendaPerQuarter}
						height={200}
						valueLabel='Referenda'
					/>
					<div className='mt-3 grid grid-cols-3 gap-4 border-t border-[var(--border)] pt-3 text-[11.5px]'>
						<div>
							<div className='text-[var(--text-faint)]'>Lifetime referenda</div>
							<div className='mt-0.5 font-serif text-[15px] font-semibold tabular-nums'>
								{d.openGov.totalReferenda.toLocaleString()}+<Cite ids={[8, 9]} />
							</div>
						</div>
						<div>
							<div className='text-[var(--text-faint)]'>Approval rate</div>
							<div className='mt-0.5 font-serif text-[15px] font-semibold tabular-nums'>{d.openGov.approvalRatePercent}%</div>
						</div>
						<div>
							<div className='text-[var(--text-faint)]'>Origin tracks</div>
							<div className='mt-0.5 font-serif text-[15px] font-semibold tabular-nums'>{d.openGov.originTracks}</div>
						</div>
					</div>
				</Panel>

				<Panel title='Network activity'>
					<div className='grid grid-cols-2 gap-x-4 gap-y-4'>
						<div>
							<div className='text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]'>Validators</div>
							<div className='mt-0.5 font-serif text-[18px] font-semibold tabular-nums'>{d.economy.activeValidators.toLocaleString()}</div>
						</div>
						<div>
							<div className='text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]'>Nominators</div>
							<div className='mt-0.5 font-serif text-[18px] font-semibold tabular-nums'>{fmtNum(d.economy.activeNominators)}</div>
						</div>
						<div>
							<div className='text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]'>Staking APY</div>
							<div className='mt-0.5 font-serif text-[18px] font-semibold tabular-nums'>{d.economy.stakingApyPercent.toFixed(2)}%</div>
						</div>
						<div>
							<div className='text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]'>Staked supply</div>
							<div className='mt-0.5 font-serif text-[18px] font-semibold tabular-nums'>{d.economy.stakedRatioPercent.toFixed(1)}%</div>
						</div>
						<div>
							<div className='text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]'>XCM messages (lifetime)</div>
							<div className='mt-0.5 font-serif text-[18px] font-semibold tabular-nums'>{fmtNum(d.xcm.totalMessagesAllTime)}</div>
						</div>
						<div>
							<div className='text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]'>Open channels</div>
							<div className='mt-0.5 font-serif text-[18px] font-semibold tabular-nums'>{d.xcm.openChannels}</div>
						</div>
					</div>
					<div className='mt-3 border-t border-[var(--border)] pt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)]'>
						Sources <Cite ids={[12, 24, 25]} />
					</div>
				</Panel>
			</div>
		</div>
	);
};

const EconomyTab: React.FC<{ d: IEcosystemDashboardData }> = ({ d }) => {
	const [range, setRange] = useState('All');
	const data = sliceTimeline(d.economy.priceTimeline, range);
	return (
		<div className='space-y-6'>
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<Kpi
					label='DOT spot price'
					value={d.economy.priceDisplay}
					sub={`Market cap ${d.economy.marketCapDisplay}`}
					cite={d.economy.citations}
				/>
				<Kpi
					label='All-time high'
					value={`$${d.economy.athPriceUsd.toFixed(2)}`}
					sub={formatDate(d.economy.athPriceDate)}
					cite={[1, 2]}
				/>
				<Kpi
					label='Peak market cap'
					value='$53B'
					sub='Nov 4, 2021'
					cite={[1, 2]}
				/>
				<Kpi
					label='Circulating supply'
					value={`${(d.economy.circulatingSupplyDot / 1_000_000_000).toFixed(2)}B`}
					sub={`${(d.economy.stakedDot / 1_000_000).toFixed(0)}M staked · ${d.economy.stakedRatioPercent.toFixed(1)}%`}
					cite={[12]}
				/>
			</div>

			<Panel
				title='Network market capitalisation, USD'
				toolbar={
					<SegToggle
						value={range}
						onChange={setRange}
						options={['1Y', '2Y', '5Y', 'All']}
					/>
				}
			>
				<TimeAreaChart
					data={data}
					height={320}
					annotatePeak
					valueLabel='Market cap'
				/>
			</Panel>

			<div className='grid gap-4 md:grid-cols-4'>
				<Kpi
					label='Active validators'
					value={d.economy.activeValidators.toLocaleString()}
					sub='Relay-chain block production'
					cite={[12, 24]}
				/>
				<Kpi
					label='Active nominators'
					value={fmtNum(d.economy.activeNominators)}
					sub='Stakers backing validators'
					cite={[24]}
				/>
				<Kpi
					label='Staking APY'
					value={`${d.economy.stakingApyPercent.toFixed(2)}%`}
					sub='Average annual return on staked DOT'
					cite={[24]}
				/>
				<Kpi
					label='Nakamoto coefficient'
					value={String(d.economy.nakamotoCoefficient)}
					sub='Min. entities required to halt block production'
					cite={[12]}
				/>
			</div>
		</div>
	);
};

const TreasuryTab: React.FC<{ d: IEcosystemDashboardData }> = ({ d }) => {
	const [range, setRange] = useState('All');
	const [catYear, setCatYear] = useState<'2024' | '2025'>('2024');
	const series = sliceTimeline(d.treasury.balanceTimeline, range);
	const cat = d.treasury.categoryBreakdown.find((c) => c.year === catYear) || d.treasury.categoryBreakdown[0];
	return (
		<div className='space-y-6'>
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<Kpi
					label='Current balance'
					value={fmtUsd(d.treasury.currentUsd)}
					sub={`${(d.treasury.currentDot / 1_000_000).toFixed(0)}M DOT · Q4 2025`}
					cite={[3]}
				/>
				<Kpi
					label='Peak USD value'
					value={fmtUsd(d.treasury.peakUsd)}
					sub='~Nov 2021 (DOT × peak price)'
					cite={[3, 6]}
				/>
				<Kpi
					label='Cumulative deployed'
					value={`${fmtUsd(d.treasury.cumulativeDeployedUsd)}+`}
					sub='2020 — 2025 lifetime disbursements'
					cite={[4, 5, 7]}
				/>
				<Kpi
					label='2024 spend (peak year)'
					value={fmtUsd(133_000_000)}
					sub='20.1M DOT — highest annual spend on record'
					cite={[4]}
				/>
			</div>

			<Panel
				title='Treasury balance · USD-equivalent'
				toolbar={
					<SegToggle
						value={range}
						onChange={setRange}
						options={['2Y', '5Y', 'All']}
					/>
				}
			>
				<TimeAreaChart
					data={series}
					height={300}
					annotatePeak
					valueLabel='Treasury'
				/>
			</Panel>

			<div className='grid gap-6 lg:grid-cols-2'>
				<Panel title='Annual treasury deployment'>
					<YearBarChart
						data={d.treasury.annualSpend}
						height={240}
						valueLabel='Treasury spend'
					/>
					<div className='mt-3 grid grid-cols-4 gap-3 border-t border-[var(--border)] pt-3'>
						{d.treasury.annualSpend.map((y) => (
							<div key={y.year}>
								<div className='font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-faint)]'>{y.year}</div>
								<div className='mt-0.5 font-serif text-[15px] font-semibold tabular-nums'>{fmtUsd(y.usd)}</div>
							</div>
						))}
					</div>
				</Panel>

				<Panel
					title='Spend by category'
					toolbar={
						<SegToggle
							value={catYear}
							onChange={(v) => setCatYear(v as '2024' | '2025')}
							options={['2024', '2025']}
						/>
					}
				>
					<table className='w-full border-collapse text-[13px]'>
						<tbody>
							{cat.categories.map((c, i) => (
								<tr
									key={c.name}
									className={`transition hover:bg-[var(--bg-soft)] ${i === 0 ? '' : 'border-t border-[var(--border)]'}`}
								>
									<td className='py-2.5 text-[var(--text-muted)]'>{c.name}</td>
									<td className='py-2.5'>
										<InlineBar
											percent={c.sharePercent * 2.5}
											tone='neutral'
										/>
									</td>
									<td className='w-20 py-2.5 pl-3 text-right tabular-nums text-[var(--text)]'>{fmtUsd(c.usd)}</td>
									<td className='w-12 py-2.5 pl-3 text-right tabular-nums text-[var(--text-faint)]'>{c.sharePercent}%</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className='mt-3 border-t border-[var(--border)] pt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)]'>
						Sources <Cite ids={d.treasury.citations} />
					</div>
				</Panel>
			</div>
		</div>
	);
};

const GovernanceTab: React.FC<{ d: IEcosystemDashboardData }> = ({ d }) => {
	const polkassembly = d.governanceInterfaces.interfaces.find((i) => i.name === 'Polkassembly')!;
	const subsquare = d.governanceInterfaces.interfaces.find((i) => i.name === 'Subsquare')!;
	return (
		<div className='space-y-6'>
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<Kpi
					label='Lifetime referenda'
					value={`${d.openGov.totalReferenda.toLocaleString()}+`}
					sub={`${d.openGov.openGovReferenda.toLocaleString()} OpenGov · ${d.openGov.govV1Proposals} Gov V1`}
					cite={[8, 9]}
				/>
				<Kpi
					label='Origin tracks'
					value={String(d.openGov.originTracks)}
					sub='Specialised lanes with distinct quora'
					cite={[13]}
				/>
				<Kpi
					label='Approval rate'
					value={`${d.openGov.approvalRatePercent}%`}
					sub={`${d.openGov.rejectionRatePercent}% rejected vs 9% under Gov V1`}
					cite={[10]}
				/>
				<Kpi
					label='Median voter turnout'
					value={`${d.openGov.medianTurnoutPercent}%`}
					sub='Of staked DOT participating per referendum'
					cite={[10]}
				/>
			</div>

			<Panel title='Referenda submitted per quarter'>
				<QuarterBarChart
					data={d.openGov.referendaPerQuarter}
					height={260}
					valueLabel='Referenda'
				/>
			</Panel>

			<div className='grid gap-6 lg:grid-cols-3'>
				<div className='space-y-6 lg:col-span-2'>
					<Panel
						title={
							<span className='inline-flex items-center gap-2'>
								<PlatformMark
									name='Polkassembly'
									size={14}
								/>
								Polkassembly
							</span>
						}
					>
						<div className='mb-3 flex items-baseline justify-between gap-4'>
							<p className='text-[13px] leading-6 text-[var(--text-muted)]'>{polkassembly.role}</p>
							<span className='shrink-0 rounded-full border border-[var(--border-strong)] bg-[var(--bg-soft)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--text-muted)]'>
								95.7% share
							</span>
						</div>
						<div className='grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[var(--border)] pt-3 md:grid-cols-3'>
							{polkassembly.stats.map((s) => (
								<div key={s.label}>
									<div className='text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]'>{s.label}</div>
									<div className='mt-0.5 font-serif text-[18px] font-semibold tabular-nums'>{s.value}</div>
									{s.sub && <div className='mt-0.5 text-[11px] text-[var(--text-muted)]'>{s.sub}</div>}
								</div>
							))}
						</div>
						<div className='mt-3 border-t border-[var(--border)] pt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)]'>
							Sources <Cite ids={polkassembly.citations} />
						</div>
					</Panel>

					<Panel
						title={
							<span className='inline-flex items-center gap-2'>
								<PlatformMark
									name='Subsquare'
									size={14}
								/>
								Subsquare
							</span>
						}
					>
						<div className='mb-3 flex items-baseline justify-between gap-4'>
							<p className='text-[13px] leading-6 text-[var(--text-muted)]'>{subsquare.role}</p>
							<span className='shrink-0 rounded-full border border-[var(--border-strong)] bg-[var(--bg-soft)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--text-muted)]'>
								4.0% share
							</span>
						</div>
						<div className='grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[var(--border)] pt-3 md:grid-cols-3'>
							{subsquare.stats.map((s) => (
								<div key={s.label}>
									<div className='text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]'>{s.label}</div>
									<div className='mt-0.5 font-serif text-[18px] font-semibold tabular-nums'>{s.value}</div>
									{s.sub && <div className='mt-0.5 text-[11px] text-[var(--text-muted)]'>{s.sub}</div>}
								</div>
							))}
						</div>
						<div className='mt-3 border-t border-[var(--border)] pt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)]'>
							Sources <Cite ids={subsquare.citations} />
						</div>
					</Panel>
				</div>

				<Panel title='Discussion volume share'>
					<div className='mb-2 text-[11px] text-[var(--text-faint)]'>By posts originally authored on each interface</div>
					<SharePie
						data={d.governanceInterfaces.discussionShare.map((x) => ({ name: x.name, value: x.sharePercent }))}
						height={220}
					/>
					<div className='mt-3 space-y-2 border-t border-[var(--border)] pt-3'>
						{d.governanceInterfaces.discussionShare.map((x, i) => (
							<div
								key={x.name}
								className='flex items-center justify-between text-[12px]'
							>
								<div className='flex items-center gap-2'>
									<span
										className='inline-block h-2.5 w-2.5 rounded-sm'
										style={{ background: `var(--pie-${(i % 5) + 1})` }}
									/>
									<PlatformMark
										name={x.name}
										size={16}
									/>
									<span className='text-[var(--text-muted)]'>{x.name}</span>
								</div>
								<span className='font-medium tabular-nums text-[var(--text)]'>{x.sharePercent.toFixed(2)}%</span>
							</div>
						))}
					</div>
					<p className='mt-4 border-t border-[var(--border)] pt-3 text-[11px] leading-5 text-[var(--text-faint)]'>{d.governanceInterfaces.commentSyncNote}</p>
				</Panel>
			</div>
		</div>
	);
};

const MultisigTab: React.FC<{ d: IEcosystemDashboardData }> = ({ d }) => {
	const [view, setView] = useState<'Current' | 'Peak'>('Current');
	const [sortKey, setSortKey] = useState<'name' | 'peak' | 'current'>('current');
	const sorted = useMemo(() => {
		const arr = [...d.multisig.platforms];
		arr.sort((a, b) => {
			if (sortKey === 'name') return a.name.localeCompare(b.name);
			if (sortKey === 'peak') return b.peakAumUsd - a.peakAumUsd;
			return b.currentAumUsd - a.currentAumUsd;
		});
		return arr;
	}, [d.multisig.platforms, sortKey]);
	const maxPeakAum = Math.max(...d.multisig.platforms.map((p) => p.peakAumUsd));
	const maxCurrentAum = Math.max(...d.multisig.platforms.map((p) => p.currentAumUsd));
	const shareData = sorted.map((p) => ({ name: p.name, value: view === 'Current' ? p.currentSharePercent : p.peakSharePercent }));

	return (
		<div className='space-y-6'>
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<Kpi
					label='Network multisig AUM (peak)'
					value={fmtUsd(d.multisig.totalPeakAumUsd)}
					sub='Q4 2021 — Q2 2022 cycle'
					cite={d.multisig.citations}
				/>
				<Kpi
					label='Network multisig AUM (current)'
					value={fmtUsd(d.multisig.totalCurrentAumUsd)}
					sub='Combined across all platforms'
					cite={d.multisig.citations}
				/>
				<Kpi
					label='Multisig accounts (network)'
					value={d.multisig.totalMultisigsCount.toLocaleString()}
					sub='Across all platform-managed multisigs'
					cite={d.multisig.citations}
				/>
				<Kpi
					label='Lifetime transactions'
					value={d.multisig.totalTransactionsCount.toLocaleString()}
					sub='Multisig-routed on-chain transactions'
					cite={d.multisig.citations}
				/>
			</div>

			<div className='grid gap-6 lg:grid-cols-3'>
				<Panel
					title='AUM share by platform'
					toolbar={
						<SegToggle
							value={view}
							onChange={(v) => setView(v as 'Current' | 'Peak')}
							options={['Current', 'Peak']}
						/>
					}
					className='lg:col-span-1'
				>
					<SharePie
						data={shareData}
						height={220}
						formatter={(v) => `${v}%`}
					/>
					<div className='mt-3 space-y-2 border-t border-[var(--border)] pt-3'>
						{sorted.map((p, i) => (
							<div
								key={p.name}
								className='flex items-center justify-between text-[12px]'
							>
								<div className='flex items-center gap-2'>
									<span
										className='inline-block h-2.5 w-2.5 rounded-sm'
										style={{ background: `var(--pie-${(i % 5) + 1})` }}
									/>
									<PlatformMark
										name={p.name}
										size={16}
									/>
									<span className='text-[var(--text-muted)]'>{p.name}</span>
								</div>
								<span className='font-medium tabular-nums text-[var(--text)]'>{view === 'Current' ? p.currentSharePercent : p.peakSharePercent}%</span>
							</div>
						))}
					</div>
				</Panel>

				<Panel
					title='Platform comparison'
					className='lg:col-span-2'
					padding='flush'
				>
					<table className='w-full border-collapse text-[13px]'>
						<thead>
							<tr className='border-b border-[var(--border)] bg-[var(--bg-soft)] text-left'>
								<th
									className='cursor-pointer px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-faint)] hover:text-[var(--text)]'
									onClick={() => setSortKey('name')}
								>
									Platform {sortKey === 'name' && '↓'}
								</th>
								<th
									className='cursor-pointer px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-faint)] hover:text-[var(--text)]'
									onClick={() => setSortKey('peak')}
								>
									Peak AUM {sortKey === 'peak' && '↓'}
								</th>
								<th
									className='cursor-pointer px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-faint)] hover:text-[var(--text)]'
									onClick={() => setSortKey('current')}
								>
									Current AUM {sortKey === 'current' && '↓'}
								</th>
								<th className='px-4 py-3 text-right font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-faint)]'>Multisigs / txs</th>
							</tr>
						</thead>
						<tbody>
							{sorted.map((p) => (
								<tr
									key={p.name}
									className='border-b border-[var(--border)] transition last:border-b-0 hover:bg-[var(--bg-soft)]'
								>
									<td className='px-4 py-4 align-top'>
										<div className='flex items-center gap-2'>
											<PlatformMark
												name={p.name}
												size={20}
											/>
											<div className='font-serif text-[14px] font-semibold text-[var(--text)]'>
												{p.name}
												<Cite ids={p.citations} />
											</div>
										</div>
										<div className='mt-1 max-w-md text-[11.5px] leading-snug text-[var(--text-muted)]'>{p.role}</div>
									</td>
									<td className='px-4 py-4 align-top'>
										<div className='font-serif text-[15px] font-semibold tabular-nums'>{fmtUsd(p.peakAumUsd)}</div>
										<div className='mb-1.5 mt-1 text-[10.5px] text-[var(--text-faint)]'>{p.peakSharePercent}% peak share</div>
										<InlineBar
											percent={(p.peakAumUsd / maxPeakAum) * 100}
											tone='neutral'
										/>
									</td>
									<td className='px-4 py-4 align-top'>
										<div className='font-serif text-[15px] font-semibold tabular-nums'>{fmtUsd(p.currentAumUsd)}</div>
										<div className='mb-1.5 mt-1 text-[10.5px] text-[var(--text-faint)]'>{p.currentSharePercent}% current share</div>
										<InlineBar
											percent={(p.currentAumUsd / maxCurrentAum) * 100}
											tone='neutral'
										/>
									</td>
									<td className='px-4 py-4 text-right align-top text-[12px] tabular-nums text-[var(--text-muted)]'>
										{p.multisigsManaged ? p.multisigsManaged.toLocaleString() : '—'}
										{p.transactionsExecuted ? <div className='mt-0.5 text-[10.5px] text-[var(--text-faint)]'>{p.transactionsExecuted.toLocaleString()} txs</div> : null}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</Panel>
			</div>

			<Panel title='How multisigs work on Polkadot'>
				<p className='text-[13px] leading-7 text-[var(--text-muted)]'>{d.multisig.overview}</p>
			</Panel>
		</div>
	);
};

const NetworkTab: React.FC<{ d: IEcosystemDashboardData }> = ({ d }) => {
	const [sort, setSort] = useState<'volume' | 'name'>('volume');
	const rows = useMemo(() => {
		const arr = [...d.infrastructure.topParachains];
		if (sort === 'name') arr.sort((a, b) => a.name.localeCompare(b.name));
		else arr.sort((a, b) => b.transactionsMillions - a.transactionsMillions);
		return arr;
	}, [d.infrastructure.topParachains, sort]);
	const maxVol = Math.max(...d.infrastructure.topParachains.map((p) => p.transactionsMillions));
	const maxTvl = Math.max(...d.defi.topProtocols.map((p) => p.tvlUsd));

	return (
		<div className='space-y-6'>
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<Kpi
					label='Active parachains'
					value={`${d.infrastructure.activeParachains}+`}
					sub='Including Asset Hub, Bridge Hub, Coretime'
					cite={[20, 21]}
				/>
				<Kpi
					label='Q1 2025 transactions'
					value={`${d.infrastructure.q1TransactionsMillions.toFixed(1)}M`}
					sub='Across all parachains; −36.9% QoQ'
					cite={[11]}
				/>
				<Kpi
					label='Block / finality time'
					value={`${d.infrastructure.blockTimeSeconds}s · ${d.infrastructure.finalitySeconds}s`}
					sub='Relay-chain block production · GRANDPA'
					cite={[21]}
				/>
				<Kpi
					label='Monthly active devs'
					value={`${d.infrastructure.monthlyActiveDevs}`}
					sub='Across Polkadot SDK ecosystem'
					cite={[11, 22]}
				/>
			</div>

			<div className='grid gap-6 lg:grid-cols-2'>
				<Panel
					title='Top parachains by transaction volume · Q1 2025'
					toolbar={
						<SegToggle
							value={sort}
							onChange={(v) => setSort(v as 'volume' | 'name')}
							options={['volume', 'name']}
						/>
					}
					padding='flush'
				>
					<table className='w-full border-collapse text-[13px]'>
						<thead>
							<tr className='border-b border-[var(--border)] bg-[var(--bg-soft)] text-left'>
								<th className='px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-faint)]'>Parachain</th>
								<th className='px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-faint)]'>Transactions</th>
								<th className='px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-faint)]'>Share</th>
								<th className='px-4 py-3 text-right font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-faint)]'>%</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((p) => (
								<tr
									key={p.name}
									className='border-b border-[var(--border)] transition last:border-b-0 hover:bg-[var(--bg-soft)]'
								>
									<td className='px-4 py-3'>
										<div className='flex items-center gap-2 font-medium text-[var(--text)]'>
											<BrandMark
												name={p.name}
												size={20}
											/>
											<span>{p.name}</span>
										</div>
									</td>
									<td className='px-4 py-3 tabular-nums text-[var(--text-muted)]'>{p.transactionsMillions.toFixed(1)}M</td>
									<td className='px-4 py-3'>
										<InlineBar
											percent={(p.transactionsMillions / maxVol) * 100}
											tone='neutral'
										/>
									</td>
									<td className='px-4 py-3 text-right tabular-nums text-[var(--text-faint)]'>{p.sharePercent.toFixed(1)}%</td>
								</tr>
							))}
						</tbody>
					</table>
				</Panel>

				<Panel
					title='DeFi · top protocols by TVL'
					padding='flush'
				>
					<table className='w-full border-collapse text-[13px]'>
						<thead>
							<tr className='border-b border-[var(--border)] bg-[var(--bg-soft)] text-left'>
								<th className='px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-faint)]'>Protocol</th>
								<th className='px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-faint)]'>Chain</th>
								<th className='px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-faint)]'>TVL</th>
								<th className='px-4 py-3 text-right font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-faint)]'>USD</th>
							</tr>
						</thead>
						<tbody>
							{d.defi.topProtocols.map((p) => (
								<tr
									key={p.name}
									className='border-b border-[var(--border)] transition last:border-b-0 hover:bg-[var(--bg-soft)]'
								>
									<td className='px-4 py-3'>
										<div className='flex items-center gap-2'>
											<BrandMark
												name={p.name}
												size={20}
											/>
											<div>
												<div className='font-medium text-[var(--text)]'>{p.name}</div>
												<div className='text-[10.5px] text-[var(--text-faint)]'>{p.category}</div>
											</div>
										</div>
									</td>
									<td className='px-4 py-3 text-[var(--text-muted)]'>
										<div className='flex items-center gap-2'>
											<BrandMark
												name={p.chain}
												size={18}
											/>
											<span>{p.chain}</span>
										</div>
									</td>
									<td className='px-4 py-3'>
										<InlineBar
											percent={(p.tvlUsd / maxTvl) * 100}
											tone='neutral'
										/>
									</td>
									<td className='px-4 py-3 text-right tabular-nums text-[var(--text)]'>{fmtUsd(p.tvlUsd)}</td>
								</tr>
							))}
						</tbody>
					</table>
				</Panel>
			</div>

			<div className='grid gap-6 lg:grid-cols-2'>
				<Panel title='Cross-chain messaging (XCM)'>
					<div className='grid grid-cols-2 gap-x-6 gap-y-4'>
						<div>
							<div className='text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]'>Lifetime messages</div>
							<div className='mt-0.5 font-serif text-[20px] font-semibold tabular-nums'>{fmtNum(d.xcm.totalMessagesAllTime)}</div>
						</div>
						<div>
							<div className='text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]'>Monthly average</div>
							<div className='mt-0.5 font-serif text-[20px] font-semibold tabular-nums'>{fmtNum(d.xcm.monthlyMessagesAvg)}</div>
						</div>
						<div>
							<div className='text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]'>Connected chains</div>
							<div className='mt-0.5 font-serif text-[20px] font-semibold tabular-nums'>{d.xcm.connectedChains}</div>
						</div>
						<div>
							<div className='text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]'>Open channels</div>
							<div className='mt-0.5 font-serif text-[20px] font-semibold tabular-nums'>{d.xcm.openChannels}</div>
						</div>
					</div>
					<div className='mt-3 border-t border-[var(--border)] pt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)]'>
						Sources <Cite ids={d.xcm.citations} />
					</div>
				</Panel>

				<Panel title='Coretime model'>
					<p className='text-[13px] leading-7 text-[var(--text-muted)]'>
						{d.infrastructure.coretimeNote}
						<Cite ids={[21, 22]} />
					</p>
				</Panel>
			</div>
		</div>
	);
};

const SourcesTab: React.FC<{ d: IEcosystemDashboardData }> = ({ d }) => (
	<div className='space-y-6'>
		<div className='grid gap-4 md:grid-cols-3'>
			<Panel title='Last revision'>
				<div className='font-serif text-[20px] font-semibold tabular-nums'>{formatDate(d.asOfDate)}</div>
				<p className='mt-2 text-[12px] leading-6 text-[var(--text-muted)]'>
					DOT spot price refreshes on every page load. Treasury, governance, multisig, infrastructure, and DeFi datasets are revised quarterly.
				</p>
			</Panel>
			<Panel title='Public API'>
				<Link
					href='/api/v1/ecosystem-dashboard?mode=live'
					className='block break-all font-mono text-[12px] text-[var(--accent)] hover:underline'
				>
					/api/v1/ecosystem-dashboard?mode=live
				</Link>
				<p className='mt-2 text-[12px] leading-6 text-[var(--text-muted)]'>Returns the full JSON payload backing this page. 10-minute s-maxage on live mode.</p>
			</Panel>
			<Panel title='Operator note'>
				<p className='text-[12px] leading-6 text-[var(--text-muted)]'>
					Application-layer figures are backed by Cloudflare access logs and Google Analytics 4 exports, available on request to qualified researchers.
				</p>
			</Panel>
		</div>

		<Panel title={`Sources · ${d.citations.length} entries`}>
			<ol className='space-y-3 text-[12.5px]'>
				{d.citations.map((c) => (
					<li
						key={c.id}
						id={`cite-${c.id}`}
						className='grid grid-cols-[28px_1fr] gap-x-3 border-t border-[var(--border)] pt-3 first:border-t-0 first:pt-0'
					>
						<span className='font-mono text-[var(--text-dim)]'>[{c.id}]</span>
						<div>
							<div className='text-[var(--text)]'>{c.label}</div>
							<a
								href={c.url}
								target='_blank'
								rel='noopener noreferrer'
								className='font-mono text-[11px] text-[var(--accent)] hover:underline'
							>
								{c.publisher} — {c.url.replace(/^https?:\/\//, '')}
							</a>
						</div>
					</li>
				))}
			</ol>
		</Panel>
	</div>
);

// ---------- Shell ----------

const EcosystemDashboard: React.FC<Props> = ({ initialData }) => {
	const d = initialData;
	const [tab, setTab] = useState<TabKey>('overview');

	const renderTab = () => {
		switch (tab) {
			case 'overview':
				return <OverviewTab d={d} />;
			case 'economy':
				return <EconomyTab d={d} />;
			case 'treasury':
				return <TreasuryTab d={d} />;
			case 'governance':
				return <GovernanceTab d={d} />;
			case 'multisig':
				return <MultisigTab d={d} />;
			case 'network':
				return <NetworkTab d={d} />;
			case 'sources':
				return <SourcesTab d={d} />;
			default:
				return null;
		}
	};

	return (
		<ObservatoryThemeProvider>
			<div className='min-h-screen bg-[var(--bg)] text-[var(--text)]'>
				<header className='no-print bg-[var(--bg)]/90 sticky top-0 z-30 border-b border-[var(--border)] backdrop-blur'>
					<div className='mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 py-3'>
						<a
							href='#top'
							className='flex items-center gap-2.5'
						>
							<PolkadotMark size={20} />
							<div className='leading-tight'>
								<div className='text-[13.5px] font-semibold tracking-tight text-[var(--text)]'>Polkadot Ecosystem Observatory</div>
								<div className='text-[10.5px] text-[var(--text-faint)]'>Open data · Updated {formatDate(d.asOfDate)}</div>
							</div>
						</a>
						<nav className='hidden flex-1 justify-center gap-0.5 md:flex'>
							{TABS.map((t) => (
								<button
									type='button'
									key={t.key}
									onClick={() => setTab(t.key)}
									className={`relative rounded-md px-3 py-1.5 text-[12.5px] font-medium transition ${
										tab === t.key ? 'bg-[var(--bg-soft)] text-[var(--text)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
									}`}
								>
									{t.label}
									{tab === t.key && <span className='absolute -bottom-3 left-1/2 h-px w-8 -translate-x-1/2 bg-[var(--accent)]' />}
								</button>
							))}
						</nav>
						<div className='flex items-center gap-2'>
							<Link
								href='/api/v1/ecosystem-dashboard?mode=live'
								className='hidden rounded-md border border-[var(--border)] px-3 py-1.5 text-[11px] font-medium text-[var(--text-muted)] transition hover:border-[var(--border-strong)] hover:text-[var(--text)] md:inline-flex'
							>
								API
							</Link>
							<ThemeToggle />
						</div>
					</div>
					<div className='border-t border-[var(--border)] bg-[var(--bg-soft)] md:hidden'>
						<div className='no-scrollbar flex gap-1 overflow-x-auto px-4 py-2'>
							{TABS.map((t) => (
								<button
									type='button'
									key={t.key}
									onClick={() => setTab(t.key)}
									className={`shrink-0 rounded-md px-3 py-1.5 text-[12px] ${tab === t.key ? 'bg-[var(--bg-elev)] text-[var(--text)]' : 'text-[var(--text-muted)]'}`}
								>
									{t.label}
								</button>
							))}
						</div>
					</div>
				</header>

				<main
					id='top'
					className='mx-auto max-w-[1400px] px-6 pb-20 pt-8'
				>
					<div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
						<div className='flex items-center gap-3'>
							<StatusPill
								live={d.mode === 'live'}
								asOf={d.asOfDate}
							/>
							<div className='hidden text-[12.5px] text-[var(--text-faint)] md:block'>
								DOT <span className='font-medium tabular-nums text-[var(--text)]'>{d.economy.priceDisplay}</span>
								<span className='mx-2 text-[var(--text-dim)]'>·</span>
								Market cap <span className='font-medium tabular-nums text-[var(--text)]'>{d.economy.marketCapDisplay}</span>
							</div>
						</div>
						<div className='font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--text-dim)]'>{TABS.find((t) => t.key === tab)?.label}</div>
					</div>

					{renderTab()}
				</main>

				<footer className='border-t border-[var(--border)] bg-[var(--bg-soft)]'>
					<div className='mx-auto max-w-[1400px] px-6 py-8'>
						<div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
							<div className='flex items-center gap-3'>
								<PolkadotMark size={16} />
								<div className='text-[11.5px] text-[var(--text-muted)]'>
									<span className='font-medium text-[var(--text)]'>Polkadot Ecosystem Observatory</span>
									<span className='ml-2'>· Open data project · Maintained by Polkassembly</span>
								</div>
							</div>
							<div className='text-[10.5px] text-[var(--text-faint)]'>
								On-chain data verifiable via Subscan. DeFi figures from DefiLlama. Application-layer figures from public reporting.
							</div>
						</div>
					</div>
				</footer>
			</div>
		</ObservatoryThemeProvider>
	);
};

export default EcosystemDashboard;
