export type OmieFault = {
  faultstring: string;
  faultcode: string;
  detalhe?: string;
};

export type OmieEnvelope<P> = {
  call: string;
  app_key: string;
  app_secret: string;
  param: P[];
};

export type ConsultarPedidoParam = {
  codigo_pedido: string | number;
};

export type ConsultarPedidoResponse = unknown;
