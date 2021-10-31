import {
  AcceptOffer,
  UpdateMedia,
} from './../src/generated/EventEmitter/EventEmitter';
import { assert, newMockEvent } from 'matchstick-as/assembly/index';
import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import {
  NewMedia,
  NewSpace,
  DeleteSpace,
  DeletePeriod,
  NewPeriod,
  Buy,
  Bid,
  OfferPeriod,
} from '../src/generated/EventEmitter/EventEmitter';
import {
  handleAcceptOffer,
  handleBid,
  handleBuy,
  handleDeletePeriod,
  handleDeleteSpace,
  handleNewMedia,
  handleNewPeriod,
  handleNewSpace,
  handleOfferPeriod,
  handleUpdateMedia,
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

export function assertBid(id: string, key: string, want: string): void {
  assertEquals('Bid', id, key, want);
}

export function assertOffer(id: string, key: string, want: string): void {
  assertEquals('Offer', id, key, want);
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
  newMedia.parameters.push(addressParam_('proxy', id));
  newMedia.parameters.push(addressParam_('mediaEOA', from));
  newMedia.parameters.push(strParam_('accountMetadata', metadata));
  newMedia.parameters.push(bigIntParam_('saltNonce', saltNonce));
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
  newSpace.parameters.push(strParam_('metadata', metadata));
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
  newPeriod.parameters.push(bigIntParam_('tokenId', tokenId));
  newPeriod.parameters.push(strParam_('spaceMetadata', spaceMetadata));
  newPeriod.parameters.push(strParam_('tokenMetadata', tokenMetadata));
  newPeriod.parameters.push(
    bigIntParam_('saleStartTimestamp', saleStartTimestamp)
  );
  newPeriod.parameters.push(bigIntParam_('saleEndTimestamp', saleEndTimestamp));
  newPeriod.parameters.push(
    bigIntParam_('displayStartTimestamp', displayStartTimestamp)
  );
  newPeriod.parameters.push(
    bigIntParam_('displayEndTimestamp', displayEndTimestamp)
  );
  newPeriod.parameters.push(bigIntParam_('pricing', pricing));
  newPeriod.parameters.push(bigIntParam_('minPrice', minPrice));
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
  deleteSpace.parameters.push(strParam_('metadata', meta));
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
  deletePeriod.parameters.push(bigIntParam_('tokenId', tokenId));
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
  buy.parameters.push(bigIntParam_('tokenId', tokenId));
  buy.parameters.push(bigIntParam_('price', price));
  buy.parameters.push(addressParam_('buyer', buyer));
  buy.parameters.push(bigIntParam_('timestamp', timestamp));
  return buy;
}

export function mockBid(
  tokenId: BigInt,
  price: BigInt,
  buyer: Address,
  timestamp: BigInt
): Bid {
  let mockEvent = newMockEvent();
  let bid = new Bid(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters
  );
  bid.parameters = new Array();
  bid.transaction = new ethereum.Transaction(
    new Bytes(0),
    new BigInt(0),
    mockEvent.address,
    null,
    new BigInt(0),
    new BigInt(0),
    new BigInt(0),
    new Bytes(0)
  );
  bid.parameters.push(bigIntParam_('tokenId', tokenId));
  bid.parameters.push(bigIntParam_('price', price));
  bid.parameters.push(addressParam_('buyer', buyer));
  bid.parameters.push(bigIntParam_('timestamp', timestamp));
  return bid;
}

export function mockOfferPeriod(
  metadata: string,
  displayStartTimestamp: BigInt,
  displayEndTimestamp: BigInt,
  from: Address,
  price: BigInt
): OfferPeriod {
  let mockEvent = newMockEvent();
  let offer = new OfferPeriod(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters
  );
  offer.parameters = new Array();
  offer.transaction = new ethereum.Transaction(
    new Bytes(0),
    new BigInt(0),
    mockEvent.address,
    null,
    new BigInt(0),
    new BigInt(0),
    new BigInt(0),
    new Bytes(0)
  );
  offer.parameters.push(strParam_('spaceMetadata', metadata));
  offer.parameters.push(
    bigIntParam_('displayStartTimestamp', displayStartTimestamp)
  );
  offer.parameters.push(
    bigIntParam_('displayEndTimestamp', displayEndTimestamp)
  );
  offer.parameters.push(addressParam_('sender', from));
  offer.parameters.push(bigIntParam_('price', price));
  return offer;
}

export function mockUpdateMedia(
  proxy: Address,
  mediaEOA: Address,
  meta: string
): UpdateMedia {
  let mockEvent = newMockEvent();
  let updateMedia = new UpdateMedia(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters
  );
  updateMedia.parameters = new Array();
  updateMedia.transaction = new ethereum.Transaction(
    new Bytes(0),
    new BigInt(0),
    mockEvent.address,
    null,
    new BigInt(0),
    new BigInt(0),
    new BigInt(0),
    new Bytes(0)
  );
  let metadataParam = strParam_('accontMetadata', meta);
  let proxyParam = addressParam_('proxy', proxy);
  let mediaEOAParam = addressParam_('mediaEOA', mediaEOA);
  updateMedia.parameters.push(proxyParam);
  updateMedia.parameters.push(mediaEOAParam);
  updateMedia.parameters.push(metadataParam);
  return updateMedia;
}

export function mockAcceptOffer(
  tokenId: BigInt,
  spaceMetadata: string,
  tokenMetadata: string,
  displayStartTimestamp: BigInt,
  displayEndTimestamp: BigInt,
  price: BigInt
): AcceptOffer {
  let mockEvent = newMockEvent();
  let acceptOffer = new AcceptOffer(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters
  );
  acceptOffer.parameters = new Array();
  acceptOffer.transaction = new ethereum.Transaction(
    new Bytes(0),
    new BigInt(0),
    mockEvent.address,
    null,
    new BigInt(0),
    new BigInt(0),
    new BigInt(0),
    new Bytes(0)
  );
  acceptOffer.parameters.push(bigIntParam_('tokenId', tokenId));
  acceptOffer.parameters.push(strParam_('spaceMetadata', spaceMetadata));
  acceptOffer.parameters.push(strParam_('tokenMetadata', tokenMetadata));
  acceptOffer.parameters.push(
    bigIntParam_('displayStartTimestamp', displayStartTimestamp)
  );
  acceptOffer.parameters.push(
    bigIntParam_('displayEndTimestamp', displayEndTimestamp)
  );
  acceptOffer.parameters.push(bigIntParam_('price', price));
  return acceptOffer;
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

export function _bid(bid: Bid): void {
  handleBid(bid);
}

export function _offerPeriod(offer: OfferPeriod): void {
  handleOfferPeriod(offer);
}

export function _updateMedia(updateMedia: UpdateMedia): void {
  handleUpdateMedia(updateMedia);
}

export function _acceptOffer(acceptOffer: AcceptOffer): void {
  handleAcceptOffer(acceptOffer);
}
