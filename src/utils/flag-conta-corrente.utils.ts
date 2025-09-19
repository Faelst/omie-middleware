const CONTA_ALVO = 4200544798;

type InfoAdicionais =
  | {
      codigo_conta_corrente?: number | string | null;
    }
  | undefined
  | null;

export function flagContaCorrente(
  input: InfoAdicionais | number | string | null,
): 's' | 'n' {
  let valor: number | undefined;

  if (
    typeof input === 'object' &&
    input !== null &&
    'codigo_conta_corrente' in input
  ) {
    const v = (input as any).codigo_conta_corrente;
    valor = v === '' || v == null ? undefined : Number(v);
  } else {
    valor = input === '' || input == null ? undefined : Number(input as any);
  }

  return valor === CONTA_ALVO ? 's' : 'n';
}
