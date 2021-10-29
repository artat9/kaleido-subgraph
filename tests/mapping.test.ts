import { NewPeriod } from '../src/generated/EventEmitter/EventEmitter';
import {
  clearStore,
  test,
  assert,
  newMockEvent,
} from 'matchstick-as/assembly/index';
import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { NewMedia, NewSpace } from '../src/generated/EventEmitter/EventEmitter';
import {
  handleNewMedia,
  handleNewPeriod,
  handleNewSpace,
} from '../src/mapping';

test('on handleNewMedia', () => {
  let contractAddress = address_();
  let eoa = addressFromHexString('0x50414Ac6431279824df9968855181474c919a94B');
  let metadata = meta_();
  let saltNonce = BigInt.fromString('1234');
  _newMedia(mockNewMedia(contractAddress, eoa, metadata, saltNonce));
  assertMedia(contractAddress, 'id', contractAddress.toHexString());
  assertMedia(contractAddress, 'owner', eoa.toHexString());
  assertMedia(contractAddress, 'metadata', metadata);
  assertMedia(contractAddress, 'saltNonce', saltNonce.toString());
  assertMedia(contractAddress, 'spaces', '[]');
  clearStore();
});

test('on handleNewSpace', () => {
  let metadata = meta_();
  _newSpace(mockNewSpace(metadata));
  assert.fieldEquals('Space', metadata, 'id', metadata);
});

test('on handleNewPeriod', () => {
  let tokenId = new BigInt(1);
  let spaceMetadata = 'spaceMetadata';
  let tokenMetadata = 'tokenMetadata';
  let saleStartTimestamp = new BigInt(100);
  let saleEndTimestamp = new BigInt(101);
  let displayStartTimestamp = new BigInt(200);
  let displayEndTimestamp = new BigInt(201);
  let pricing = new BigInt(0);
  let minPrice = new BigInt(1000);

  _newPeriod(
    mockNewPeriod(
      tokenId,
      spaceMetadata,
      tokenMetadata,
      saleStartTimestamp,
      saleEndTimestamp,
      displayStartTimestamp,
      displayEndTimestamp,
      pricing,
      minPrice
    )
  );
  // TODO: closure: https://github.com/AssemblyScript/assemblyscript/issues/798
  // TODO: assert media
  assertPeriod(tokenId.toHexString(), 'id', tokenId.toHexString());
  assertPeriod(tokenId.toHexString(), 'tokenMetadata', tokenMetadata);
  assertPeriod(
    tokenId.toHexString(),
    'saleStartTimestamp',
    saleStartTimestamp.toString()
  );
  assertPeriod(
    tokenId.toHexString(),
    'saleEndTimestamp',
    saleEndTimestamp.toString()
  );
  assertPeriod(
    tokenId.toHexString(),
    'displayStartTimestamp',
    displayStartTimestamp.toString()
  );
  assertPeriod(
    tokenId.toHexString(),
    'displayEndTimestamp',
    displayEndTimestamp.toString()
  );
  assertPeriod(tokenId.toHexString(), 'pricing', 'RRP');
  assertPeriod(tokenId.toHexString(), 'minPrice', minPrice.toString());
});

function assertMedia(id: Address, key: string, want: string): void {
  assertEquals('Media', id.toHexString(), key, want);
}

function assertPeriod(id: string, key: string, want: string): void {
  assertEquals('Period', id, key, want);
}

function assertEquals(
  entity: string,
  id: string,
  key: string,
  want: string
): void {
  assert.fieldEquals(entity, id, key, want);
}

function address_(): Address {
  return addressFromHexString('0xD149ac01A582e65DBaa3D4ae986A6cf3fd758C1b');
}

function addressFromHexString(val: string): Address {
  return Address.fromString(val);
}

function meta_(): string {
  return 'metadata';
}

function idParam_(id: BigInt): ethereum.EventParam {
  return bigIntParam_('id', id);
}

function bigIntParam_(key: string, val: BigInt): ethereum.EventParam {
  return new ethereum.EventParam(key, ethereum.Value.fromUnsignedBigInt(val));
}

function strParam_(key: string, val: string): ethereum.EventParam {
  return new ethereum.EventParam(key, ethereum.Value.fromString(val));
}

function addressParam_(key: string, address: Address): ethereum.EventParam {
  return new ethereum.EventParam(key, ethereum.Value.fromAddress(address));
}

function i32Param_(key: string, val: i32): ethereum.EventParam {
  return new ethereum.EventParam(key, ethereum.Value.fromI32(val));
}

function mockNewMedia(
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

function mockNewSpace(metadata: string): NewSpace {
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

function mockNewPeriod(
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

function _newMedia(newMedia: NewMedia): void {
  handleNewMedia(newMedia);
}

function _newSpace(newSpace: NewSpace): void {
  handleNewSpace(newSpace);
}

function _newPeriod(newPeriod: NewPeriod): void {
  handleNewPeriod(newPeriod);
}
