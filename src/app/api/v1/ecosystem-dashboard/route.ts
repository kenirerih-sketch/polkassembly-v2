// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { withErrorHandling } from '@/app/api/_api-utils/withErrorHandling';
import { buildEcosystemDashboardData } from '@/_shared/_services/ecosystem-dashboard/buildData';
import { Mode } from '@/_shared/_data/ecosystem-dashboard/types';

const modeSchema = z.object({
	mode: z.enum(['live', 'static']).optional().default('live')
});

export const GET = withErrorHandling(async (req: NextRequest) => {
	const searchParamsObject = Object.fromEntries(req.nextUrl.searchParams.entries());
	const { mode } = modeSchema.parse(searchParamsObject);

	const data = await buildEcosystemDashboardData(mode as Mode);
	const ttl = mode === 'static' ? 60 * 60 * 24 : 60 * 10;

	return NextResponse.json(data, {
		headers: {
			'Cache-Control': `public, s-maxage=${ttl}, stale-while-revalidate=${String(ttl * 6)}`
		}
	});
});
