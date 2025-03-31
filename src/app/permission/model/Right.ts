import { Role } from './Role';
import { ERight } from './ERight';

export interface Right {
  id: number;
  name: ERight;
  role: Role[];
}
