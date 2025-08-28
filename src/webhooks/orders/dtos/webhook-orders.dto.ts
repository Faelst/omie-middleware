import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsDate,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

const toNumber = (v: any) =>
  v === '' || v === null || v === undefined ? undefined : Number(v);

const emptyToUndefined = (v: any) =>
  typeof v === 'string' ? (v.trim() === '' ? undefined : v.trim()) : v;

const brDateToDate = (v: any) => {
  if (v instanceof Date) return v;
  if (typeof v !== 'string') return undefined;
  const parts = v.split('/');
  if (parts.length !== 3) return undefined;
  const [dd, mm, yyyy] = parts.map(Number);
  if (!dd || !mm || !yyyy) return undefined;
  return new Date(Date.UTC(yyyy, mm - 1, dd));
};

export class VendaProdutoAuthorDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  userId!: number;
}

export class VendaProdutoEtapaAlteradaEventDto {
  @Transform(({ value }) => emptyToUndefined(value))
  @IsOptional()
  @IsString()
  codIntPedido?: string;

  @IsString()
  @IsNotEmpty()
  codigoCategoria!: string; // ex: "1.01.03"

  @Transform(({ value }) => brDateToDate(value))
  @IsDate()
  dataPrevisao!: Date; // entrada "dd/MM/yyyy", internamente Date

  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  etapa!: number; // no exemplo veio "10" (string)

  @IsString()
  @IsNotEmpty()
  etapaDescr!: string;

  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  idCliente!: number;

  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  idContaCorrente!: number;

  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  idPedido!: number;

  @IsString()
  @IsNotEmpty()
  numeroPedido!: string;

  @Transform(({ value }) => toNumber(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  valorPedido!: number;
}

export class WebhookOrdersDto {
  @IsUUID()
  messageId!: string;

  @IsIn(['VendaProduto.EtapaAlterada'])
  topic!: 'VendaProduto.EtapaAlterada';

  @ValidateNested()
  @Type(() => VendaProdutoEtapaAlteradaEventDto)
  event!: VendaProdutoEtapaAlteradaEventDto;

  @ValidateNested()
  @Type(() => VendaProdutoAuthorDto)
  author!: VendaProdutoAuthorDto;

  @IsString()
  @IsNotEmpty()
  appKey!: string;

  @IsString()
  @IsNotEmpty()
  appHash!: string;

  @IsString()
  @IsNotEmpty()
  origin!: string;
}
