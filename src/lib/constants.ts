export const SITE_NAME = 'Goliath Investment Group';
export const SITE_DESCRIPTION =
  'Institutional-grade equity research, macro commentary, and market intelligence';
export const SITE_URL = 'https://goliathig.com';
export const AUTHOR_NAME = 'Jonathan Cao';
export const SUBSTACK_URL = 'https://goliathig.substack.com';

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Equity Research', href: SUBSTACK_URL, external: true },
  { label: 'Blog', href: SUBSTACK_URL, external: true },
  { label: 'Team', href: '/about' },
];

export const CATEGORIES: { [key: string]: string } = {
  'equity-research': 'Equity Research',
  'market-intelligence': 'Market Intelligence',
  'blog': 'Blog',
};
