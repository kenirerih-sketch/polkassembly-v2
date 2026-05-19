// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { STATIC_ECOSYSTEM_DASHBOARD_DATA } from '@/_shared/_data/ecosystem-dashboard/staticData';
import { IEcosystemDashboardData, Mode } from '@/_shared/_data/ecosystem-dashboard/types';

const COINGECKO_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=polkadot&price_change_percentage=24h';

const fmtUsd = (n: number): string => {
	if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
	if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
	if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
	return `$${n.toFixed(2)}`;
};

const fetchLiveDotMarket = async (): Promise<{ price: number; marketCap: number } | null> => {
	try {
		const res = await fetch(COINGECKO_URL, { headers: { accept: 'application/json' } });
		if (!res.ok) return null;
		const data = await res.json();
		const row = Array.isArray(data) ? data[0] : null;
		if (!row?.current_price || !row?.market_cap) return null;
		return { price: Number(row.current_price), marketCap: Number(row.market_cap) };
	} catch {
		return null;
	}
};

export const buildEcosystemDashboardData = async (mode: Mode = 'live'): Promise<IEcosystemDashboardData> => {
	const base: IEcosystemDashboardData = JSON.parse(JSON.stringify(STATIC_ECOSYSTEM_DASHBOARD_DATA));
	base.mode = mode;
	base.generatedAt = new Date().toISOString();

	if (mode === 'live') {
		const live = await fetchLiveDotMarket();
		if (live) {
			base.economy.priceUsd = live.price;
			base.economy.priceDisplay = `$${live.price.toFixed(2)}`;
			base.economy.marketCapUsd = live.marketCap;
			base.economy.marketCapDisplay = fmtUsd(live.marketCap);
			base.hero.stats[0] = {
				label: 'Network market cap',
				value: fmtUsd(live.marketCap),
				sub: 'Peak $53B (Nov 2021)',
				citations: [1, 2]
			};
			const last = base.economy.priceTimeline[base.economy.priceTimeline.length - 1];
			if (last) last.value = live.marketCap;
		}
	}

	return base;
};
