import { clearStore, test, assert } from 'matchstick-as/assembly/index';
import { BigInt } from '@graphprotocol/graph-ts';
import { log } from 'matchstick-as/assembly/log';

import {
  addressFromHexString,
  address_,
  assertBid,
  assertBuy,
  assertDeniedProposal,
  assertMedia,
  assertOffer,
  assertPeriod,
  meta_,
  mockAcceptOffer,
  mockAcceptProposal,
  mockBid,
  mockBuy,
  mockDeletePeriod,
  mockDeleteSpace,
  mockDenyProposal,
  mockNewMedia,
  mockNewPeriod,
  mockNewSpace,
  mockOfferPeriod,
  mockPropose,
  mockUpdateMedia,
  _acceptOffer,
  _acceptProposal,
  _bid,
  _buy,
  _deletePeriod,
  _deleteSpace,
  _denyProposal,
  _newMedia,
  _newPeriod,
  _newSpace,
  _offerPeriod,
  _propose,
  _updateMedia,
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
  let tokenId = BigInt.fromI32(1);
  let spaceMetadata = 'spaceMetadata';
  let tokenMetadata = 'tokenMetadata';
  let saleStartTimestamp = BigInt.fromI32(100);
  let saleEndTimestamp = BigInt.fromI32(101);
  let displayStartTimestamp = BigInt.fromI32(200);
  let displayEndTimestamp = BigInt.fromI32(201);
  let pricing = BigInt.fromI32(0);
  let minPrice = BigInt.fromI32(1000);

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
  let tokenId = BigInt.fromI32(1);
  _newPeriod(
    mockNewPeriod(
      tokenId,
      meta_(),
      meta_(),
      BigInt.fromI32(0),
      BigInt.fromI32(0),
      BigInt.fromI32(0),
      BigInt.fromI32(0),
      BigInt.fromI32(0),
      BigInt.fromI32(0)
    )
  );
  _deletePeriod(mockDeletePeriod(tokenId));
  assertPeriod(tokenId.toHexString(), 'deleted', 'true');
  clearStore();
});

test('on buy', () => {
  let tokenId = BigInt.fromI32(1);
  _newPeriod(
    mockNewPeriod(
      tokenId,
      meta_(),
      meta_(),
      BigInt.fromI32(0),
      BigInt.fromI32(0),
      BigInt.fromI32(0),
      BigInt.fromI32(0),
      BigInt.fromI32(0),
      BigInt.fromI32(0)
    )
  );
  let price = BigInt.fromI32(2);
  let address = addressFromHexString(
    '0x50414Ac6431279824df9968855181474c919a94B'
  );
  let timestamp = BigInt.fromI32(3);
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
  let tokenId = BigInt.fromI32(1);
  _newPeriod(
    mockNewPeriod(
      tokenId,
      meta_(),
      meta_(),
      BigInt.fromI32(0),
      BigInt.fromI32(0),
      BigInt.fromI32(0),
      BigInt.fromI32(0),
      BigInt.fromI32(0),
      BigInt.fromI32(0)
    )
  );
  let price = BigInt.fromI32(2);
  let address = addressFromHexString(
    '0x50414Ac6431279824df9968855181474c919a94B'
  );
  let timestamp = BigInt.fromI32(3);
  _bid(mockBid(tokenId, price, address, timestamp));
  assertBid(tokenId.toHexString(), 'id', tokenId.toHexString());
  // TODO: assert period
  //assertBuy(tokenId.toHexString(), 'period', 'test');
  assertBid(tokenId.toHexString(), 'buyer', address.toHexString());
  assertBid(tokenId.toHexString(), 'timestamp', timestamp.toString());
  // TODO: assert period.buy
  let period = Period.load(tokenId.toHexString());
  // TODO: fix error
  //assert.stringEquals(period.bids.length.toString(), '1');
  assert.assertNotNull(period);
  clearStore();
});

test('on offer period', () => {
  // TODO: id
  let id = '0x1';
  let meta = meta_();
  let start = BigInt.fromI32(2);
  let end = BigInt.fromI32(3);
  let address = addressFromHexString(
    '0x50414Ac6431279824df9968855181474c919a94B'
  );
  let price = BigInt.fromI32(100);
  _offerPeriod(mockOfferPeriod(meta, start, end, address, price));
  assertOffer(id, 'id', id);
  assertOffer(id, 'metadata', meta);
  assertOffer(id, 'displayStartTimestamp', start.toString());
  assertOffer(id, 'displayEndTimestamp', end.toString());
  assertOffer(id, 'from', address.toHexString());
  assertOffer(id, 'price', price.toString());
  assertOffer(id, 'status', 'OFFERED');
  clearStore();
});

test('on update media', () => {
  let contractAddress = address_();
  let saltNonce = BigInt.fromString('1234');
  _newMedia(mockNewMedia(contractAddress, address_(), meta_(), saltNonce));
  let newEoa = addressFromHexString(
    '0x50414Ac6431279824df9968855181474c919a94B'
  );
  let newMetadata = 'Afrer';
  _updateMedia(mockUpdateMedia(contractAddress, newEoa, newMetadata));
  assertMedia(contractAddress, 'owner', newEoa.toHexString());
  assertMedia(contractAddress, 'metadata', newMetadata);
  clearStore();
});

test('on accept offer', () => {
  // TODO: id
  let id = BigInt.fromI32(1);
  log.info(id.toHexString(), []);
  let meta = meta_();
  let tokenMeta = 'tokenMeta';
  let start = BigInt.fromI32(2);
  let end = BigInt.fromI32(3);
  let displayStart = BigInt.fromI32(4);
  let displayEnd = BigInt.fromI32(5);
  let address = addressFromHexString(
    '0x50414Ac6431279824df9968855181474c919a94B'
  );
  let price = BigInt.fromI32(100);
  _offerPeriod(mockOfferPeriod(meta, start, end, address, price));
  _acceptOffer(
    mockAcceptOffer(id, meta, tokenMeta, displayStart, displayEnd, price)
  );
  assertOffer(id.toHexString(), 'status', 'ACCEPTED');
  assertPeriod(id.toHexString(), 'id', id.toHexString());

  clearStore();
});

test('on update media', () => {
  let contractAddress = address_();
  let saltNonce = BigInt.fromString('1234');
  _newMedia(mockNewMedia(contractAddress, address_(), meta_(), saltNonce));
  let newEoa = addressFromHexString(
    '0x50414Ac6431279824df9968855181474c919a94B'
  );
  let newMetadata = 'Afrer';
  _updateMedia(mockUpdateMedia(contractAddress, newEoa, newMetadata));
  assertMedia(contractAddress, 'owner', newEoa.toHexString());
  assertMedia(contractAddress, 'metadata', newMetadata);
  clearStore();
});

test('on propose', () => {
  let tokenId = BigInt.fromI32(1);
  _newPeriod(
    mockNewPeriod(
      tokenId,
      meta_(),
      meta_(),
      BigInt.fromI32(0),
      BigInt.fromI32(0),
      BigInt.fromI32(0),
      BigInt.fromI32(0),
      BigInt.fromI32(0),
      BigInt.fromI32(0)
    )
  );
  let meta = 'propose';
  _propose(mockPropose(tokenId, meta));
  assertPeriod(tokenId.toHexString(), 'proposedMetadata', meta);
  assertPeriod(tokenId.toHexString(), 'proposalAccepted', 'false');
});

test('on accept proposal', () => {
  let tokenId = BigInt.fromI32(1);
  _newPeriod(
    mockNewPeriod(
      tokenId,
      meta_(),
      meta_(),
      BigInt.fromI32(0),
      BigInt.fromI32(0),
      BigInt.fromI32(0),
      BigInt.fromI32(0),
      BigInt.fromI32(0),
      BigInt.fromI32(0)
    )
  );
  let meta = 'propose';
  _propose(mockPropose(tokenId, meta));
  _acceptProposal(mockAcceptProposal(tokenId, meta));
  assertPeriod(tokenId.toHexString(), 'proposalAccepted', 'true');
});

test('on deny proposal', () => {
  let tokenId = BigInt.fromI32(1);
  _newPeriod(
    mockNewPeriod(
      tokenId,
      meta_(),
      meta_(),
      BigInt.fromI32(0),
      BigInt.fromI32(0),
      BigInt.fromI32(0),
      BigInt.fromI32(0),
      BigInt.fromI32(0),
      BigInt.fromI32(0)
    )
  );
  let meta = 'propose';
  let reason = 'bad content';
  _propose(mockPropose(tokenId, meta));
  _denyProposal(mockDenyProposal(tokenId, meta, reason));
  assertDeniedProposal(meta, 'id', meta);
  assertDeniedProposal(meta, 'reason', reason);
});
