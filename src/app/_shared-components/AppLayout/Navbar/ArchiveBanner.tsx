// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const BANNER_STORAGE_KEY = 'pa_archive_v1';

function ArchiveBanner() {
	const t = useTranslations('AnnouncementBanner');
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		try {
			if (!sessionStorage.getItem(BANNER_STORAGE_KEY)) {
				setVisible(true);
			}
		} catch {
			setVisible(true);
		}
	}, []);

	function dismiss() {
		try {
			sessionStorage.setItem(BANNER_STORAGE_KEY, '1');
		} catch {
			/* noop */
		}
		setVisible(false);
	}

	if (!visible) return null;

	return (
		<div className='relative flex w-full items-center justify-center rounded-b-[20px] bg-[linear-gradient(90deg,_#42122C_0%,_#A6075C_33%,_#952863_77%,_#E5007A_100%)] px-10 py-2 text-sm font-medium text-white'>
			<p className='flex flex-wrap items-center gap-x-1 text-center text-sm'>
				{t('archiveMessage')}{' '}
				<a
					href='https://polkassembly.io'
					target='_blank'
					rel='noopener noreferrer'
					className='underline'
				>
					polkassembly.io
				</a>
			</p>
			<button
				type='button'
				onClick={dismiss}
				aria-label='Dismiss'
				className='absolute right-3 top-1/2 -translate-y-1/2 bg-transparent p-1 text-lg leading-none text-white/70 transition-colors hover:text-white'
			>
				×
			</button>
		</div>
	);
}

export default ArchiveBanner;
