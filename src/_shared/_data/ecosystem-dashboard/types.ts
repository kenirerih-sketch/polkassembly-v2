// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// Polkadot Ecosystem Observatory — data shape

export type Mode = 'live' | 'static';

export interface ICitation {
	id: number;
	label: string;
	url: string;
	publisher: string;
	accessedOn?: string;
}

export interface IHeroStat {
	label: string;
	value: string;
	sub?: string;
	citations: number[];
}

export interface ITimePoint {
	period: string;
	value: number;
	label?: string;
	annotation?: string;
}

export interface IEconomySection {
	priceUsd: number;
	priceDisplay: string;
	marketCapUsd: number;
	marketCapDisplay: string;
	athPriceUsd: number;
	athPriceDate: string;
	peakMarketCapUsd: number;
	peakMarketCapDate: string;
	circulatingSupplyDot: number;
	stakedDot: number;
	stakedRatioPercent: number;
	activeValidators: number;
	activeNominators: number;
	stakingApyPercent: number;
	nakamotoCoefficient: number;
	weeklyCoreDevs: number;
	priceTimeline: ITimePoint[];
	citations: number[];
}

export interface IDefiSection {
	totalEcosystemTvlUsd: number;
	asOfDate: string;
	stablecoinSupplyUsd?: number;
	topProtocols: { name: string; chain: string; tvlUsd: number; category: string }[];
	citations: number[];
}

export interface IXcmSection {
	totalMessagesAllTime: number;
	monthlyMessagesAvg: number;
	connectedChains: number;
	openChannels: number;
	citations: number[];
}

export interface ITreasurySection {
	currentDot: number;
	currentUsd: number;
	peakUsd: number;
	peakUsdDate: string;
	cumulativeDeployedUsd: number;
	balanceTimeline: ITimePoint[];
	annualSpend: { year: string; usd: number }[];
	categoryBreakdown: { year: string; categories: { name: string; usd: number; sharePercent: number }[] }[];
	citations: number[];
}

export interface IOpenGovSection {
	totalReferenda: number;
	openGovReferenda: number;
	govV1Proposals: number;
	originTracks: number;
	rejectionRatePercent: number;
	approvalRatePercent: number;
	medianTurnoutPercent: number;
	referendaPerQuarter: ITimePoint[];
	citations: number[];
}

export interface IGovernanceInterface {
	name: string;
	role: string;
	stats: { label: string; value: string; sub?: string }[];
	notable: string[];
	citations: number[];
}

export interface IGovernanceInterfacesSection {
	overview: string;
	discussionShare: { name: string; sharePercent: number }[];
	interfaces: IGovernanceInterface[];
	commentSyncNote: string;
	citations: number[];
}

export interface IMultisigPlatform {
	name: string;
	role: string;
	peakAumUsd: number;
	currentAumUsd: number;
	peakSharePercent: number;
	currentSharePercent: number;
	multisigsManaged?: number;
	transactionsExecuted?: number;
	citations: number[];
}

export interface IMultisigSection {
	overview: string;
	totalPeakAumUsd: number;
	totalCurrentAumUsd: number;
	totalMultisigsCount: number;
	totalTransactionsCount: number;
	platforms: IMultisigPlatform[];
	citations: number[];
}

export interface INetworkInfraSection {
	activeParachains: number;
	monthlyActiveDevs: number;
	q1TransactionsMillions: number;
	blockTimeSeconds: number;
	finalitySeconds: number;
	coretimeNote: string;
	topParachains: { name: string; transactionsMillions: number; sharePercent: number }[];
	citations: number[];
}

export interface IEcosystemDashboardData {
	mode: Mode;
	generatedAt: string;
	asOfDate: string;
	hero: {
		title: string;
		standfirst: string;
		stats: IHeroStat[];
	};
	economy: IEconomySection;
	treasury: ITreasurySection;
	openGov: IOpenGovSection;
	governanceInterfaces: IGovernanceInterfacesSection;
	multisig: IMultisigSection;
	infrastructure: INetworkInfraSection;
	defi: IDefiSection;
	xcm: IXcmSection;
	citations: ICitation[];
}
