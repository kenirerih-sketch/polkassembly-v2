// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sonarjs/no-duplicate-string */

import { IEcosystemDashboardData } from './types';

const ASOF = '2026-02-01';

const CITATIONS = [
	{ id: 1, label: 'DOT historical price and market capitalization', url: 'https://www.coingecko.com/en/coins/polkadot', publisher: 'CoinGecko' },
	{ id: 2, label: 'Polkadot all-time high price record (Nov 4, 2021)', url: 'https://www.coinbase.com/price/polkadot', publisher: 'Coinbase' },
	{ id: 3, label: '2025 Q4 Polkadot Treasury Report', url: 'https://forum.polkadot.network/t/2025-q4-polkadot-treasury-report/16847', publisher: 'Polkadot Forum' },
	{ id: 4, label: '2024 Polkadot Treasury Report (Q4 / annual)', url: 'https://www.opengov.watch/reports/treasury-reports/05-2024-treasury-report-q4', publisher: 'OpenGov.Watch' },
	{ id: 5, label: '2023 Polkadot Treasury Report', url: 'https://forum.polkadot.network/t/polkadot-treasury-report-2023/7071', publisher: 'Polkadot Forum' },
	{ id: 6, label: 'Polkadot relay chain treasury, on-chain data', url: 'https://polkadot.subscan.io/treasury', publisher: 'Subscan' },
	{
		id: 7,
		label: 'Polkadot Treasury annual spending 2020 – 2023',
		url: 'https://forum.polkadot.network/t/polkadot-treasury-annual-spending-in-usd-dot-2020-2023-june/3342',
		publisher: 'Polkadot Forum'
	},
	{ id: 8, label: 'Polkadot OpenGov referenda — live count', url: 'https://polkadot.subsquare.io/referenda', publisher: 'Subsquare' },
	{ id: 9, label: 'Polkadot OpenGov referenda — Polkassembly App Hub', url: 'https://polkadot.polkassembly.io/all-posts', publisher: 'Polkassembly' },
	{ id: 10, label: 'Messari — Polkadot OpenGov Deep Dive', url: 'https://messari.io/report/polkadot-opengov-report', publisher: 'Messari' },
	{ id: 11, label: 'Messari — Polkadot State of the Network Q1 2025', url: 'https://messari.io/project/polkadot', publisher: 'Messari' },
	{ id: 12, label: 'Polkadot validator set, staking ratio, Nakamoto coefficient', url: 'https://staking.polkadot.cloud', publisher: 'Polkadot Staking Dashboard' },
	{ id: 13, label: 'Polkadot governance applications directory', url: 'https://wiki.polkadot.network/docs/governance-apps', publisher: 'Polkadot Wiki' },
	{ id: 14, label: 'Polkassembly — platform usage and analytics', url: 'https://polkassembly.io/about', publisher: 'Polkassembly' },
	{ id: 15, label: 'Polkassembly — network coverage', url: 'https://polkassembly.io', publisher: 'Polkassembly' },
	{ id: 16, label: 'PolkaSafe multisig platform — assets under management', url: 'https://polkasafe.xyz', publisher: 'PolkaSafe' },
	{ id: 17, label: 'Multix multisig manager', url: 'https://multix.chainsafe.io', publisher: 'ChainSafe Multix' },
	{ id: 18, label: 'Signet multisig (Talisman)', url: 'https://signet.talisman.xyz', publisher: 'Signet' },
	{ id: 19, label: 'Substrate native multisig pallet', url: 'https://wiki.polkadot.network/docs/learn-account-multisig', publisher: 'Polkadot Wiki' },
	{ id: 20, label: 'Parachain ecosystem directory', url: 'https://parachains.info', publisher: 'parachains.info' },
	{ id: 21, label: 'Polkadot Coretime model', url: 'https://wiki.polkadot.network/docs/learn-agile-coretime', publisher: 'Polkadot Wiki' },
	{ id: 22, label: 'Polkadot Roundup 2025', url: 'https://www.parity.io/blog/polkadot-roundup-2025', publisher: 'Parity Technologies' },
	{ id: 23, label: 'Polkadot ecosystem TVL', url: 'https://defillama.com/chain/polkadot', publisher: 'DefiLlama' },
	{ id: 24, label: 'Polkadot staking yield, validators, nominators', url: 'https://www.stakingrewards.com/asset/polkadot', publisher: 'StakingRewards' },
	{
		id: 25,
		label: 'Polkadot XCM activity and connected channels',
		url: 'https://wiki.polkadot.com/general/dashboards/parity-data-dashboards/',
		publisher: 'Parity Data Dashboards'
	}
];

const STATIC_ECOSYSTEM_DASHBOARD_DATA: IEcosystemDashboardData = {
	mode: 'static',
	generatedAt: new Date().toISOString(),
	asOfDate: ASOF,
	hero: {
		title: 'Polkadot Ecosystem Observatory',
		standfirst:
			'Open data on the Polkadot network — economy, treasury, governance, and infrastructure surfaces. Compiled from on-chain queries, official network reports, and platform-public reporting.',
		stats: [
			{ label: 'Network market cap', value: '$6.2B', sub: 'Peak $53B (Nov 2021)', citations: [1, 2] },
			{ label: 'Ecosystem TVL', value: '$143M', sub: 'Across Polkadot parachains', citations: [23] },
			{ label: 'Treasury balance', value: '$58M', sub: '32M DOT · Q4 2025', citations: [3, 6] },
			{ label: 'Active validators', value: '400', sub: '29.5K nominators · 13.08% APY', citations: [12, 24] },
			{ label: 'Active parachains', value: '65+', sub: 'Coretime model since 2024', citations: [20, 21] }
		]
	},
	economy: {
		priceUsd: 4.15,
		priceDisplay: '$4.15',
		marketCapUsd: 6_220_000_000,
		marketCapDisplay: '$6.22B',
		athPriceUsd: 55.13,
		athPriceDate: '2021-11-04',
		peakMarketCapUsd: 53_000_000_000,
		peakMarketCapDate: '2021-11-04',
		circulatingSupplyDot: 1_660_000_000,
		stakedDot: 843_900_000,
		stakedRatioPercent: 50.8,
		activeValidators: 400,
		activeNominators: 29_457,
		stakingApyPercent: 13.08,
		nakamotoCoefficient: 149,
		weeklyCoreDevs: 122,
		priceTimeline: [
			{ period: '2020-09', value: 3_500_000_000, label: 'Sep 2020' },
			{ period: '2021-05', value: 41_000_000_000, label: 'May 2021' },
			{ period: '2021-11', value: 53_000_000_000, label: 'Nov 2021', annotation: 'Peak market cap $53B' },
			{ period: '2022-06', value: 8_400_000_000, label: 'Jun 2022' },
			{ period: '2023-01', value: 6_500_000_000, label: 'Jan 2023' },
			{ period: '2023-12', value: 9_800_000_000, label: 'Dec 2023' },
			{ period: '2024-03', value: 14_200_000_000, label: 'Mar 2024' },
			{ period: '2024-09', value: 5_900_000_000, label: 'Sep 2024' },
			{ period: '2025-04', value: 5_200_000_000, label: 'Apr 2025' },
			{ period: '2025-12', value: 6_220_000_000, label: 'Dec 2025' }
		],
		citations: [1, 2, 11, 12]
	},
	treasury: {
		currentDot: 32_000_000,
		currentUsd: 57_800_000,
		peakUsd: 1_000_000_000,
		peakUsdDate: '2021-11',
		cumulativeDeployedUsd: 240_000_000,
		balanceTimeline: [
			{ period: '2021-11', value: 1_000_000_000, label: 'Nov 2021', annotation: 'Peak treasury value ~$1.0B' },
			{ period: '2022-06', value: 540_000_000, label: 'Jun 2022' },
			{ period: '2023-06', value: 245_000_000, label: 'Jun 2023' },
			{ period: '2024-06', value: 245_000_000, label: 'Jun 2024' },
			{ period: '2024-12', value: 130_000_000, label: 'Dec 2024' },
			{ period: '2025-06', value: 78_000_000, label: 'Jun 2025' },
			{ period: '2025-12', value: 57_800_000, label: 'Dec 2025' }
		],
		annualSpend: [
			{ year: '2022', usd: 12_000_000 },
			{ year: '2023', usd: 33_500_000 },
			{ year: '2024', usd: 133_000_000 },
			{ year: '2025', usd: 68_000_000 }
		],
		categoryBreakdown: [
			{
				year: '2024',
				categories: [
					{ name: 'Outreach', usd: 48_000_000, sharePercent: 36 },
					{ name: 'Software development', usd: 32_000_000, sharePercent: 24 },
					{ name: 'Business development', usd: 19_000_000, sharePercent: 14 },
					{ name: 'Economy incentives', usd: 15_000_000, sharePercent: 11 },
					{ name: 'Talent & education', usd: 9_900_000, sharePercent: 7 },
					{ name: 'Network infrastructure', usd: 6_500_000, sharePercent: 5 },
					{ name: 'Research', usd: 2_500_000, sharePercent: 2 }
				]
			},
			{
				year: '2025',
				categories: [
					{ name: 'Software development', usd: 17_500_000, sharePercent: 34 },
					{ name: 'Outreach', usd: 11_700_000, sharePercent: 23 },
					{ name: 'Operations', usd: 9_200_000, sharePercent: 18 },
					{ name: 'Business development', usd: 8_200_000, sharePercent: 16 },
					{ name: 'Economy incentives', usd: 2_400_000, sharePercent: 5 },
					{ name: 'Research', usd: 1_100_000, sharePercent: 2 },
					{ name: 'Talent & education', usd: 900_000, sharePercent: 2 }
				]
			}
		],
		citations: [3, 4, 5, 7]
	},
	openGov: {
		totalReferenda: 1971,
		openGovReferenda: 1888,
		govV1Proposals: 83,
		originTracks: 15,
		rejectionRatePercent: 40,
		approvalRatePercent: 60,
		medianTurnoutPercent: 7.4,
		referendaPerQuarter: [
			{ period: '2023-Q3', value: 87, label: 'Q3 2023' },
			{ period: '2023-Q4', value: 188, label: 'Q4 2023' },
			{ period: '2024-Q1', value: 210, label: 'Q1 2024' },
			{ period: '2024-Q2', value: 245, label: 'Q2 2024' },
			{ period: '2024-Q3', value: 218, label: 'Q3 2024' },
			{ period: '2024-Q4', value: 196, label: 'Q4 2024' },
			{ period: '2025-Q1', value: 184, label: 'Q1 2025' },
			{ period: '2025-Q2', value: 162, label: 'Q2 2025' },
			{ period: '2025-Q3', value: 128, label: 'Q3 2025' },
			{ period: '2025-Q4', value: 98, label: 'Q4 2025' }
		],
		citations: [8, 9, 10]
	},
	governanceInterfaces: {
		overview:
			'OpenGov proposals are authored, discussed, and voted on through two web interfaces. Comments are mirrored across both via shared APIs, but each maintains a distinct user base, network coverage, and product surface area. A small remainder of proposals is submitted directly via the relay-chain RPC without using either interface.',
		discussionShare: [
			{ name: 'Polkassembly', sharePercent: 95.66 },
			{ name: 'Subsquare', sharePercent: 4.04 },
			{ name: 'Direct RPC / others', sharePercent: 0.3 }
		],
		interfaces: [
			{
				name: 'Polkassembly',
				role: 'End-to-end governance workflow — discovery, discussion, delegation, voting, and identity.',
				stats: [
					{ label: 'Monthly active users', value: '250K+', sub: 'Sustained; peak ≈ 300K in high-activity months' },
					{ label: 'API requests', value: '92M+', sub: 'per month' },
					{ label: 'Networks supported', value: '50+', sub: 'Substrate chains, testnets & partner integrations' },
					{ label: 'Governance discussion share', value: '95.66%', sub: 'of OpenGov post volume' },
					{ label: 'Comment share', value: '82.66%', sub: 'across both interfaces' },
					{ label: 'Identity judgements share', value: '52.22%', sub: 'of issued judgements' },
					{ label: 'Treasury decisions surfaced', value: '$300M+', sub: 'cumulative on-chain value' }
				],
				notable: [
					'Primary discussion surface for Polkadot OpenGov since 2021.',
					'Operates the App Hub for Polkadot, Kusama, and 50+ Substrate chains.',
					'Identity verification and judgement workflow integrated with on-chain registrar.'
				],
				citations: [13, 14, 15]
			},
			{
				name: 'Subsquare',
				role: 'OpenGov dashboards, notifications, and an alternative discussion thread.',
				stats: [
					{ label: 'Governance discussion share', value: '4.04%', sub: 'of OpenGov post volume' },
					{ label: 'Networks supported', value: '8+', sub: 'Polkadot, Kusama, selected Substrate chains' },
					{ label: 'Comment sync', value: 'Bi-directional', sub: 'with Polkassembly' },
					{ label: 'Operated by', value: 'OpenSquare', sub: 'Founded 2022' },
					{ label: 'Specialised dashboards', value: 'Treasury · Fellowship', sub: 'plus referenda explorer' },
					{ label: 'Live since', value: 'Q1 2022', sub: 'Polkadot governance interface' }
				],
				notable: [
					'Comments authored on either platform are mirrored to the other via shared APIs.',
					'Maintains independent dashboards for treasury, fellowship, and referenda.',
					'Open-source codebase under an MIT licence.'
				],
				citations: [8, 13]
			}
		],
		commentSyncNote: 'Discussion share figures reflect where OpenGov posts are originally authored. Comments themselves are synchronised across platforms.',
		citations: [13, 14, 15]
	},
	multisig: {
		overview:
			'Multisig accounts on Polkadot are native to Substrate — any account holder can construct one without an external smart contract. Several user-facing platforms wrap this primitive with a UI, transaction queue, and notifications. AUM refers to on-chain DOT and stable balances held by accounts that transact through each platform.',
		totalPeakAumUsd: 480_000_000,
		totalCurrentAumUsd: 122_000_000,
		totalMultisigsCount: 6_800,
		totalTransactionsCount: 71_200,
		platforms: [
			{
				name: 'PolkaSafe',
				role: 'Multisig wallet platform with treasury management, address book, and proposal queue.',
				peakAumUsd: 300_000_000,
				currentAumUsd: 63_400_000,
				peakSharePercent: 62,
				currentSharePercent: 52,
				multisigsManaged: 4_200,
				transactionsExecuted: 38_500,
				citations: [16]
			},
			{
				name: 'Multix',
				role: 'Multisig manager built by ChainSafe; supports pure proxies and nested multisigs.',
				peakAumUsd: 120_000_000,
				currentAumUsd: 34_200_000,
				peakSharePercent: 25,
				currentSharePercent: 28,
				citations: [17]
			},
			{
				name: 'Signet',
				role: 'Talisman multisig with portfolio view and transaction signing flow.',
				peakAumUsd: 38_000_000,
				currentAumUsd: 14_600_000,
				peakSharePercent: 8,
				currentSharePercent: 12,
				citations: [18]
			},
			{
				name: 'Native pallet (no UI)',
				role: 'Multisigs constructed directly via the Substrate multisig pallet without a managing platform.',
				peakAumUsd: 22_000_000,
				currentAumUsd: 9_800_000,
				peakSharePercent: 5,
				currentSharePercent: 8,
				citations: [19]
			}
		],
		citations: [16, 17, 18, 19]
	},
	infrastructure: {
		activeParachains: 65,
		monthlyActiveDevs: 475,
		q1TransactionsMillions: 137.1,
		blockTimeSeconds: 6,
		finalitySeconds: 12,
		coretimeNote:
			'In 2024 Polkadot transitioned from fixed-slot parachain auctions to Agile Coretime — a market for blockspace measured in 28-day bulk cores and on-demand spot purchases.',
		topParachains: [
			{ name: 'Frequency', transactionsMillions: 26.8, sharePercent: 19.5 },
			{ name: 'Moonbeam', transactionsMillions: 16.7, sharePercent: 12.2 },
			{ name: 'Phala', transactionsMillions: 15.1, sharePercent: 11.0 },
			{ name: 'Mythos', transactionsMillions: 12.3, sharePercent: 9.0 },
			{ name: 'peaq', transactionsMillions: 10.1, sharePercent: 7.4 }
		],
		citations: [11, 20, 21, 22]
	},
	defi: {
		totalEcosystemTvlUsd: 143_000_000,
		asOfDate: '2026-01-15',
		stablecoinSupplyUsd: 92_000_000,
		topProtocols: [
			{ name: 'Hydration', chain: 'Hydration', tvlUsd: 70_900_000, category: 'DEX / money market' },
			{ name: 'Hydration Lending', chain: 'Hydration', tvlUsd: 37_700_000, category: 'Money market' },
			{ name: 'Bifrost Liquid Staking', chain: 'Bifrost', tvlUsd: 24_300_000, category: 'Liquid staking' },
			{ name: 'Moonwell', chain: 'Moonbeam', tvlUsd: 13_500_000, category: 'Money market' },
			{ name: 'Acala', chain: 'Acala', tvlUsd: 9_400_000, category: 'DEX / stablecoin' },
			{ name: 'StellaSwap', chain: 'Moonbeam', tvlUsd: 7_200_000, category: 'DEX' },
			{ name: 'Astar', chain: 'Astar', tvlUsd: 5_300_000, category: 'Smart-contract platform' }
		],
		citations: [23]
	},
	xcm: {
		totalMessagesAllTime: 4_820_000,
		monthlyMessagesAvg: 312_000,
		connectedChains: 47,
		openChannels: 168,
		citations: [25]
	},
	citations: CITATIONS
};

export { STATIC_ECOSYSTEM_DASHBOARD_DATA };
