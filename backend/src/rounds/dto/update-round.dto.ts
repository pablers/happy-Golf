import { CreateRoundDto } from './create-round.dto';

/** Reutiliza el contrato de creación permitiendo actualizaciones parciales. */
export type UpdateRoundDto = Partial<CreateRoundDto>;
