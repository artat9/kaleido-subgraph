import { clearStore, test, assert } from 'matchstick-as/assembly/index';
import { BigInt } from '@graphprotocol/graph-ts';

import {
  addressFromHexString,
  address_,
  assertBid,
  assertBuy,
  assertMedia,
  assertPeriod,
  meta_,
  mockBid,
  mockBuy,
  mockDeletePeriod,
  mockDeleteSpace,
  mockNewMedia,
  mockNewPeriod,
  mockNewSpace,
  _bid,
  _buy,
  _deletePeriod,
  _deleteSpace,
  _newMedia,
  _newPeriod,
  _newSpace,
} from './mocks';
import { Period } from '../src/generated/schema';

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
  assert.fieldEquals('Space', metadata, 'deleted', 'false');
  clearStore();
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
  assertPeriod(tokenId.toHexString(), 'deleted', 'false');
  clearStore();
});

test('on deleteSpace', () => {
  let metadata = meta_();
  _newSpace(mockNewSpace(metadata));
  _deleteSpace(mockDeleteSpace(metadata));
  assert.fieldEquals('Space', metadata, 'deleted', 'true');
  clearStore();
});

test('on deletePeriod', () => {
  let tokenId = new BigInt(1);
  _newPeriod(
    mockNewPeriod(
      tokenId,
      meta_(),
      meta_(),
      new BigInt(0),
      new BigInt(0),
      new BigInt(0),
      new BigInt(0),
      new BigInt(0),
      new BigInt(0)
    )
  );
  _deletePeriod(mockDeletePeriod(tokenId));
  assertPeriod(tokenId.toHexString(), 'deleted', 'true');
  clearStore();
});

test('on buy', () => {
  let tokenId = new BigInt(1);
  _newPeriod(
    mockNewPeriod(
      tokenId,
      meta_(),
      meta_(),
      new BigInt(0),
      new BigInt(0),
      new BigInt(0),
      new BigInt(0),
      new BigInt(0),
      new BigInt(0)
    )
  );
  let price = new BigInt(2);
  let address = addressFromHexString(
    '0x50414Ac6431279824df9968855181474c919a94B'
  );
  let timestamp = new BigInt(3);
  _buy(mockBuy(tokenId, price, address, timestamp));
  assertBuy(tokenId.toHexString(), 'id', tokenId.toHexString());
  // TODO: assert period
  //assertBuy(tokenId.toHexString(), 'period', 'test');
  assertBuy(tokenId.toHexString(), 'buyer', address.toHexString());
  assertBuy(tokenId.toHexString(), 'timestamp', timestamp.toString());
  // TODO: assert period.buy
  let period = Period.load(tokenId.toHexString());
  assert.assertNotNull(period);
  clearStore();
});

test('on bid', () => {
  let tokenId = new BigInt(1);
  _newPeriod(
    mockNewPeriod(
      tokenId,
      meta_(),
      meta_(),
      new BigInt(0),
      new BigInt(0),
      new BigInt(0),
      new BigInt(0),
      new BigInt(0),
      new BigInt(0)
    )
  );
  let price = new BigInt(2);
  let address = addressFromHexString(
    '0x50414Ac6431279824df9968855181474c919a94B'
  );
  let timestamp = new BigInt(3);
  _bid(mockBid(tokenId, price, address, timestamp));
  assertBid(tokenId.toHexString(), 'id', tokenId.toHexString());
  // TODO: assert period
  //assertBuy(tokenId.toHexString(), 'period', 'test');
  assertBid(tokenId.toHexString(), 'buyer', address.toHexString());
  assertBid(tokenId.toHexString(), 'timestamp', timestamp.toString());
  // TODO: assert period.buy
  let period = Period.load(tokenId.toHexString())!!;
  // TODO: fix error
  //assert.stringEquals(period.bids.length.toString(), '1');
  assert.assertNotNull(period);
});
