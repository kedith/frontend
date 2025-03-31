import { ERole } from './eRole';

export const ERoleMapping: Record<ERole, string> = {
  [ERole.Administrator]: 'Administrator',
  [ERole.Manager]: 'Manager',
  [ERole.Cenzor]: 'Cenzor',
  [ERole.Reporter]: 'Reporter',
};
