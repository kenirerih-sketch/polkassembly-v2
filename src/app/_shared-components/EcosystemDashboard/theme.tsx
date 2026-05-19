// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable react/function-component-definition */

'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'observatory-theme';

type ObservatoryTheme = 'light' | 'dark';

type ObservatoryThemeContextValue = {
	theme: ObservatoryTheme;
	toggle: () => void;
	mounted: boolean;
};

const ObservatoryThemeContext = createContext<ObservatoryThemeContextValue | null>(null);

const getInitialTheme = (): ObservatoryTheme => {
	if (typeof window === 'undefined') return 'light';
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === 'light' || stored === 'dark') return stored;
	return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ObservatoryThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [theme, setTheme] = useState<ObservatoryTheme>('light');
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setTheme(getInitialTheme());
		setMounted(true);
	}, []);

	const toggle = useCallback(() => {
		setTheme((prev) => {
			const next = prev === 'light' ? 'dark' : 'light';
			localStorage.setItem(STORAGE_KEY, next);
			return next;
		});
	}, []);

	const contextValue = useMemo(() => ({ theme, toggle, mounted }), [theme, toggle, mounted]);

	return (
		<ObservatoryThemeContext.Provider value={contextValue}>
			<div
				className='ecosystem-observatory -mx-5 -mt-5 sm:-mx-10 sm:-mt-10'
				data-theme={mounted ? theme : 'light'}
			>
				{children}
			</div>
		</ObservatoryThemeContext.Provider>
	);
};

export const useObservatoryTheme = () => {
	const ctx = useContext(ObservatoryThemeContext);
	if (!ctx) {
		throw new Error('useObservatoryTheme must be used within ObservatoryThemeProvider');
	}
	return ctx;
};

export const ThemeToggle: React.FC = () => {
	const { theme, toggle, mounted } = useObservatoryTheme();
	if (!mounted) return <div className='h-8 w-8' />;
	return (
		<button
			type='button'
			onClick={toggle}
			aria-label='Toggle theme'
			className='inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] text-[var(--text-faint)] transition hover:border-[var(--border-strong)] hover:text-[var(--text)]'
		>
			{theme === 'light' ? (
				<svg
					width='14'
					height='14'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
				>
					<path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
				</svg>
			) : (
				<svg
					width='14'
					height='14'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
				>
					<circle
						cx='12'
						cy='12'
						r='4'
					/>
					<path d='M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41' />
				</svg>
			)}
		</button>
	);
};

type BrandAsset = {
	initial: string;
	bg: string;
	fg: string;
	src?: string;
	padding?: number;
	radius?: number;
	objectFit?: 'contain' | 'cover';
};

const GOOGLE_FAVICON_HOST = 'www.google.com';

const favicon = (domain: string) => `https://${GOOGLE_FAVICON_HOST}/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;

const BRAND_LOGOS: Record<string, BrandAsset> = {
	Polkadot: {
		initial: 'P',
		bg: '#ffffff',
		fg: '#E6007A',
		src: 'https://polkadot.network/favicon-light.svg',
		padding: 2,
		radius: 999
	},
	Polkassembly: {
		initial: 'P',
		bg: '#ffffff',
		fg: '#E6007A',
		src: 'https://polkassembly.io/logo.png',
		padding: 2
	},
	Subsquare: {
		initial: 'S',
		bg: '#ffffff',
		fg: '#111827',
		src: 'https://www.subsquare.io/imgs/logo-img.svg',
		padding: 1
	},
	PolkaSafe: {
		initial: 'P',
		bg: '#ffffff',
		fg: '#14B8A6',
		src: 'https://polkasafe.xyz/logo.svg',
		padding: 2
	},
	Multix: {
		initial: 'M',
		bg: '#ffffff',
		fg: '#0F172A',
		src: 'https://multix.chainsafe.io/multix-logo.svg',
		padding: 1
	},
	Signet: {
		initial: 'S',
		bg: '#171717',
		fg: '#D7FF62',
		src: 'https://signet.talisman.xyz/mask-icon.svg?v=2021-10-05',
		padding: 2
	},
	Talisman: {
		initial: 'T',
		bg: '#171717',
		fg: '#D7FF62',
		src: 'https://talisman.xyz/talisman.svg?v=1749994215',
		padding: 2
	},
	'Native pallet (no UI)': { initial: 'N', bg: '#475569', fg: '#ffffff' },
	'Direct RPC / others': { initial: 'RPC', bg: '#94A3B8', fg: '#ffffff' },
	Frequency: { initial: 'F', bg: '#ffffff', fg: '#111827', src: favicon('frequency.xyz'), padding: 2 },
	Moonbeam: {
		initial: 'M',
		bg: '#ffffff',
		fg: '#53CBC9',
		src: 'https://cdn.sanity.io/images/76lym2dp/mb-production/1aacbb5dc188314678a0e4504808b57171837cd7-512x512.png?w=256&h=256',
		padding: 1
	},
	Phala: { initial: 'P', bg: '#ffffff', fg: '#111827', src: favicon('phala.network'), padding: 2 },
	Mythos: { initial: 'M', bg: '#ffffff', fg: '#111827', src: favicon('mythos.foundation'), padding: 2 },
	peaq: { initial: 'P', bg: '#ffffff', fg: '#111827', src: favicon('peaq.network'), padding: 2 },
	Hydration: {
		initial: 'H',
		bg: '#ffffff',
		fg: '#FF0000',
		src: 'https://hydration.net/_next/static/media/hydration.26b66c3b.svg',
		padding: 2
	},
	'Hydration Lending': {
		initial: 'H',
		bg: '#ffffff',
		fg: '#FF0000',
		src: 'https://hydration.net/_next/static/media/hydration.26b66c3b.svg',
		padding: 2
	},
	Bifrost: {
		initial: 'B',
		bg: '#ffffff',
		fg: '#6B5CFF',
		src: 'https://www.subsquare.io/imgs/icons/project-bifrost.svg',
		padding: 2
	},
	'Bifrost Liquid Staking': {
		initial: 'B',
		bg: '#ffffff',
		fg: '#6B5CFF',
		src: 'https://www.subsquare.io/imgs/icons/project-bifrost.svg',
		padding: 2
	},
	Moonwell: { initial: 'M', bg: '#ffffff', fg: '#7C3AED', src: favicon('moonwell.fi'), padding: 2 },
	Acala: {
		initial: 'A',
		bg: '#ffffff',
		fg: '#E11D48',
		src: 'https://www.subsquare.io/imgs/icons/project-acala.svg',
		padding: 2
	},
	StellaSwap: {
		initial: 'S',
		bg: '#ffffff',
		fg: '#6844F5',
		src: 'https://raw.githubusercontent.com/moonbeam-foundation/app-directory-data/refs/heads/main/projects/stellaswap/logos/stellaswap-logo-large.jpeg',
		objectFit: 'cover'
	},
	Astar: {
		initial: 'A',
		bg: '#ffffff',
		fg: '#111827',
		src: 'https://www.subsquare.io/imgs/icons/project-astar.png',
		padding: 2
	}
};

const getBrandAsset = (name: string): BrandAsset => {
	if (Object.hasOwn(BRAND_LOGOS, name)) {
		// eslint-disable-next-line security/detect-object-injection -- name validated via Object.hasOwn
		return BRAND_LOGOS[name];
	}
	return { initial: name.charAt(0), bg: '#94A3B8', fg: '#ffffff' };
};

export const BrandMark: React.FC<{ name: string; size?: number; className?: string }> = ({ name, size = 18, className = '' }) => {
	const [failed, setFailed] = useState(false);
	const brand = getBrandAsset(name);
	const radius = brand.radius ?? Math.max(4, Math.round(size * 0.22));
	const canUseImage = Boolean(brand.src && !failed);
	return (
		<span
			className={`inline-flex shrink-0 items-center justify-center overflow-hidden border border-[var(--border)] font-mono font-semibold leading-none ${className}`}
			style={{
				width: size,
				height: size,
				background: brand.bg,
				color: brand.fg,
				borderRadius: radius,
				fontSize: Math.max(7, Math.round(size * (brand.initial.length > 1 ? 0.34 : 0.52)))
			}}
			aria-hidden
		>
			{canUseImage ? (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					src={brand.src}
					alt=''
					loading='lazy'
					className='h-full w-full'
					style={{
						objectFit: brand.objectFit || 'contain',
						padding: brand.padding || 0
					}}
					onError={() => setFailed(true)}
				/>
			) : (
				brand.initial
			)}
		</span>
	);
};

export const PolkadotMark: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 18 }) => (
	<BrandMark
		name='Polkadot'
		size={size}
		className={className}
	/>
);

export const PlatformMark = BrandMark;
