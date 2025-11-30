import { HoleScore, PostRoundAnswers, RoundSetup } from '../entities/round.entity';

/** Define la carga útil necesaria para crear una nueva ronda. */
export interface CreateRoundDto {
  date: string;
  setup: RoundSetup;
  scores: HoleScore[];
  answers: PostRoundAnswers;
}
