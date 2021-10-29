import { assert, newMockEvent } from 'matchstick-as/assembly/index';
import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import {
  NewMedia,
  NewSpace,
  DeleteSpace,
  DeletePeriod,
  NewPeriod,
  Buy,
} from '../src/generated/EventEmitter/EventEmitter';
import {
  handleBuy,
  handleDeletePeriod,
  handleDeleteSpace,
  handleNewMedia,
  handleNewPeriod,
  handleNewSpace,
} from '../src/mapping';

export function assertMedia(id: Address, key: string, want: string): void {
  assertEquals('Media', id.toHexString(), key, want);
}

export function assertPeriod(id: string, key: string, want: string): void {
  assertEquals('Period', id, key, want);
}

export function assertBuy(id: string, key: string, want: string): void {
  assertEquals('Buy', id, key, want);
}

export function assertEquals(
  entity: string,
  id: string,
  key: string,
  want: string
): void {
  assert.fieldEquals(entity, id, key, want);
}

export function address_(): Address {
  return addressFromHexString('0xD149ac01A582e65DBaa3D4ae986A6cf3fd758C1b');
}

export function addressFromHexString(val: string): Address {
  return Address.fromString(val);
}

export function meta_(): string {
  return 'metadata';
}

export function idParam_(id: BigInt): ethereum.EventParam {
  return bigIntParam_('id', id);
}

export function bigIntParam_(key: string, val: BigInt): ethereum.EventParam {
  return new ethereum.EventParam(key, ethereum.Value.fromUnsignedBigInt(val));
}

export function strParam_(key: string, val: string): ethereum.EventParam {
  return new ethereum.EventParam(key, ethereum.Value.fromString(val));
}

export function addressParam_(
  key: string,
  address: Address
): ethereum.EventParam {
  return new ethereum.EventParam(key, ethereum.Value.fromAddress(address));
}

export function i32Param_(key: string, val: i32): ethereum.EventParam {
  return new ethereum.EventParam(key, ethereum.Value.fromI32(val));
}

export function mockNewMedia(
  id: Address,
  from: Address,
  metadata: string,
  saltNonce: BigInt
): NewMedia {
  let mockEvent = newMockEvent();
  let newMedia = new NewMedia(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters
  );
  newMedia.parameters = new Array();
  newMedia.transaction = new ethereum.Transaction(
    new Bytes(0),
    new BigInt(0),
    from,
    null,
    new BigInt(0),
    new BigInt(0),
    new BigInt(0),
    new Bytes(0)
  );
  let idParam = addressParam_('proxy', id);
  let metadataParam = strParam_('accountMetadata', metadata);
  let saltNonceParam = bigIntParam_('saltNonce', saltNonce);
  newMedia.parameters.push(idParam);
  newMedia.parameters.push(metadataParam);
  newMedia.parameters.push(saltNonceParam);
  return newMedia;
}

export function mockNewSpace(metadata: string): NewSpace {
  let mockEvent = newMockEvent();
  let newSpace = new NewSpace(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters
  );
  newSpace.parameters = new Array();
  newSpace.transaction = new ethereum.Transaction(
    new Bytes(0),
    new BigInt(0),
    address_(),
    null,
    new BigInt(0),
    new BigInt(0),
    new BigInt(0),
    new Bytes(0)
  );
  let metadataParam = strParam_('metadata', metadata);
  newSpace.parameters.push(metadataParam);
  return newSpace;
}

export function mockNewPeriod(
  tokenId: BigInt,
  spaceMetadata: string,
  tokenMetadata: string,
  saleStartTimestamp: BigInt,
  saleEndTimestamp: BigInt,
  displayStartTimestamp: BigInt,
  displayEndTimestamp: BigInt,
  pricing: BigInt,
  minPrice: BigInt
): NewPeriod {
  let mockEvent = newMockEvent();
  let newPeriod = new NewPeriod(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters
  );
  newPeriod.parameters = new Array();
  newPeriod.transaction = new ethereum.Transaction(
    new Bytes(0),
    new BigInt(0),
    address_(),
    null,
    new BigInt(0),
    new BigInt(0),
    new BigInt(0),
    new Bytes(0)
  );
  let tokenIdParam = bigIntParam_('tokenId', tokenId);
  let spaceMetadataParam = strParam_('spaceMetadata', spaceMetadata);
  let tokenMetadataParam = strParam_('tokenMetadata', tokenMetadata);
  let saleStartTimestampParam = bigIntParam_(
    'saleStartTimestamp',
    saleStartTimestamp
  );
  let saleEndTimestampParam = bigIntParam_(
    'saleEndTimestamp',
    saleEndTimestamp
  );
  let displayStartTimestampParam = bigIntParam_(
    'displayStartTimestamp',
    displayStartTimestamp
  );
  let displayEndTimestampParam = bigIntParam_(
    'displayEndTimestamp',
    displayEndTimestamp
  );
  let pricingParam = bigIntParam_('pricing', pricing);
  let minPriceParam = bigIntParam_('minPrice', minPrice);
  newPeriod.parameters.push(tokenIdParam);
  newPeriod.parameters.push(spaceMetadataParam);
  newPeriod.parameters.push(tokenMetadataParam);
  newPeriod.parameters.push(saleStartTimestampParam);
  newPeriod.parameters.push(saleEndTimestampParam);
  newPeriod.parameters.push(displayStartTimestampParam);
  newPeriod.parameters.push(displayEndTimestampParam);
  newPeriod.parameters.push(pricingParam);
  newPeriod.parameters.push(minPriceParam);
  return newPeriod;
}

export function mockDeleteSpace(meta: string): DeleteSpace {
  let mockEvent = newMockEvent();
  let deleteSpace = new DeleteSpace(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters
  );
  deleteSpace.parameters = new Array();
  deleteSpace.transaction = new ethereum.Transaction(
    new Bytes(0),
    new BigInt(0),
    mockEvent.address,
    null,
    new BigInt(0),
    new BigInt(0),
    new BigInt(0),
    new Bytes(0)
  );
  let metaParam = strParam_('metadata', meta);
  deleteSpace.parameters.push(metaParam);
  return deleteSpace;
}

export function mockDeletePeriod(tokenId: BigInt): DeletePeriod {
  let mockEvent = newMockEvent();
  let deletePeriod = new DeletePeriod(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters
  );
  deletePeriod.parameters = new Array();
  deletePeriod.transaction = new ethereum.Transaction(
    new Bytes(0),
    new BigInt(0),
    mockEvent.address,
    null,
    new BigInt(0),
    new BigInt(0),
    new BigInt(0),
    new Bytes(0)
  );
  let tokenIdParam = bigIntParam_('tokenId', tokenId);
  deletePeriod.parameters.push(tokenIdParam);
  return deletePeriod;
}

export function mockBuy(
  tokenId: BigInt,
  price: BigInt,
  buyer: Address,
  timestamp: BigInt
): Buy {
  let mockEvent = newMockEvent();
  let buy = new Buy(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters
  );
  buy.parameters = new Array();
  buy.transaction = new ethereum.Transaction(
    new Bytes(0),
    new BigInt(0),
    mockEvent.address,
    null,
    new BigInt(0),
    new BigInt(0),
    new BigInt(0),
    new Bytes(0)
  );
  let tokenIdParam = bigIntParam_('tokenId', tokenId);
  let priceParam = bigIntParam_('price', price);
  let buyerParam = addressParam_('buyer', buyer);
  let timestampParam = bigIntParam_('timestamp', timestamp);
  buy.parameters.push(tokenIdParam);
  buy.parameters.push(priceParam);
  buy.parameters.push(buyerParam);
  buy.parameters.push(timestampParam);
  return buy;
}

export function _newMedia(newMedia: NewMedia): void {
  handleNewMedia(newMedia);
}

export function _newSpace(newSpace: NewSpace): void {
  handleNewSpace(newSpace);
}

export function _newPeriod(newPeriod: NewPeriod): void {
  handleNewPeriod(newPeriod);
}

export function _deleteSpace(deleteSpace: DeleteSpace): void {
  handleDeleteSpace(deleteSpace);
}

export function _deletePeriod(deletePeriod: DeletePeriod): void {
  handleDeletePeriod(deletePeriod);
}

export function _buy(buy: Buy): void {
  handleBuy(buy);
}
