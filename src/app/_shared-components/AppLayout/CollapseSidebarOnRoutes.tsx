// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useSidebar } from '@/app/_shared-components/Sidebar/Sidebar';

const ROUTES_WITH_COLLAPSED_SIDEBAR = ['/ecosystem-dashboard'];

const shouldCollapseSidebar = (pathname: string) => ROUTES_WITH_COLLAPSED_SIDEBAR.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export function CollapseSidebarOnRoutes() {
	const pathname = usePathname();
	const { open, setOpen, setOpenMobile, isMobile } = useSidebar();
	const openRef = useRef(open);

	openRef.current = open;

	useEffect(() => {
		if (!shouldCollapseSidebar(pathname)) {
			return undefined;
		}

		const previousOpen = openRef.current;
		setOpen(false);
		if (isMobile) {
			setOpenMobile(false);
		}

		return () => {
			setOpen(previousOpen);
		};
	}, [pathname, setOpen, setOpenMobile, isMobile]);

	return null;
}
