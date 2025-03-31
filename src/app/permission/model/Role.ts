import { Right } from './Right';
import { ERole } from './ERole';

export interface Role {
  id: number;
  name: ERole;
  rights: Right[];
}
