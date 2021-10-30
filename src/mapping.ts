import {
  DeletePeriod,
  DeleteSpace,
  NewMedia,
  NewPeriod,
  NewSpace,
  Buy,
  Bid,
} from './generated/EventEmitter/EventEmitter';
import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Media, Period, Space } from './generated/schema';
import * as schema from './generated/schema';

export function handleNewMedia(event: NewMedia): void {
  let media = new Media(addressToId(event.params.proxy));
  media.owner = event.transaction.from;
  media.metadata = event.params.accountMetadata;
  media.saltNonce = event.params.saltNonce;
  media.spaces = [];
  media.save();
}

export function handleNewSpace(event: NewSpace): void {
  let space = new Space(event.params.metadata);
  // TODO: media
  space.deleted = false;
  space.save();
}

export function handleNewPeriod(event: NewPeriod): void {
  let period = new Period(toId(event.params.tokenId));
  period.deleted = false;
  period.displayEndTimestamp = event.params.displayEndTimestamp;
  period.displayStartTimestamp = event.params.displayStartTimestamp;
  // TODO: media
  //period.media = event.params.
  period.minPrice = event.params.minPrice;
  period.pricing = pricing(event.params.pricing);
  period.saleEndTimestamp = event.params.saleEndTimestamp;
  period.saleStartTimestamp = event.params.saleStartTimestamp;
  period.space = event.params.spaceMetadata;
  period.tokenMetadata = event.params.tokenMetadata;
  period.save();
}

export function handleDeleteSpace(event: DeleteSpace): void {
  let space = loadSpace(event.params.metadata);
  if (!space) {
    return;
  }
  space.deleted = true;
  space.save();
}

export function handleBuy(event: Buy): void {
  let spaceId = toId(event.params.tokenId);
  let period = loadPeriod(event.params.tokenId);
  if (!period) {
    return;
  }
  let buy = new schema.Buy(spaceId);
  buy.buyer = event.params.buyer;
  buy.period = period.id;
  buy.timestamp = event.params.timestamp;
  buy.save();
  period.bid = buy.id;
  period.save();
}

export function handleBid(event: Bid): void {
  let spaceId = toId(event.params.tokenId);
  let period = loadPeriod(event.params.tokenId);
  if (!period) {
    return;
  }
  let bid = new schema.Bid(spaceId);
  bid.buyer = event.params.buyer;
  bid.period = period.id;
  bid.timestamp = event.params.timestamp;
  bid.save();
  period.bid = bid.id;
  period.save();
}

export function handleDeletePeriod(event: DeletePeriod): void {
  let period = loadPeriod(event.params.tokenId);
  if (!period) {
    return;
  }
  period.deleted = true;
  period.save();
}

function pricing(val: i32): string {
  switch (val) {
    case 0:
      return 'RRP';
    case 1:
      return 'DPBT';
    case 2:
      return 'BIDDING';
    case 3:
      return 'OFFER';
    default:
      return '';
  }
}

let toId = (postId: BigInt): string => {
  return postId.toHexString();
};

let loadSpace = (metadata: string): Space | null => {
  return Space.load(metadata);
};

let loadPeriod = (tokenId: BigInt): Period | null => {
  return Period.load(toId(tokenId));
};

let addressToId = (address: Address): string => {
  return address.toHexString();
};
