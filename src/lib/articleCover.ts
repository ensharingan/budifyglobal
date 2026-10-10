import { saImage } from '@/lib/saImage';
const MAP: Record<string, string> = {
  'Records & compliance': 'access', 'Stock & inventory': 'inventory', 'Membership & access': 'membership', Operations: 'pos',
  'Finance & reporting': 'finance', 'Data protection': 'insights', Technology: 'comms', Growth: 'about'
};
/** Self-hosted cover for a category (SA-look markets only); null → gradient tile. */
export const coverFor = (category: string | undefined, sa: boolean) => (sa && category ? saImage(MAP[category] ?? 'pos') : null);
