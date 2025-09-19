export function resolveShippingAddress(order: any, client: any) {
  if (!order || !client) {
    return null;
  }

  if (order?.informacoes_adicionais?.outros_detalhes) {
    return formatOrderLineAddress(order.informacoes_adicionais.outros_detalhes);
  }
}

function formatOrderLineAddress(addressLine: string): { line: string } {
  return { line: `${addressLine['cEnderecoOd']}, ` };
}
