// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Metadata } from 'next';
import { OPENGRAPH_METADATA } from '@/_shared/_constants/opengraphMetadata';
import { getNetworkFromHeaders } from '@/app/api/_api-utils/getNetworkFromHeaders';
import { getGeneratedContentMetadata } from '@/_shared/_utils/generateContentMetadata';
import { buildEcosystemDashboardData } from '@/_shared/_services/ecosystem-dashboard/buildData';
import EcosystemDashboard from '@/app/_shared-components/EcosystemDashboard';
import './ecosystem-dashboard.scss';

export async function generateMetadata(): Promise<Metadata> {
	const network = await getNetworkFromHeaders();
	const { title } = OPENGRAPH_METADATA;

	return getGeneratedContentMetadata({
		title: `${title} - Polkadot Ecosystem Observatory`,
		description:
			'Public data on the Polkadot network — economy, treasury, governance throughput, and infrastructure surfaces. Compiled from on-chain sources, official network dashboards, and platform-public reporting.',
		network,
		url: `https://${network}.polkassembly.io/ecosystem-dashboard`,
		imageAlt: 'Polkadot Ecosystem Observatory'
	});
}

export default async function EcosystemDashboardPage() {
	const data = await buildEcosystemDashboardData('live');

	return <EcosystemDashboard initialData={data} />;
}
