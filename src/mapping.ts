import {
  DeletePeriod,
  DeleteSpace,
  NewMedia,
  NewPeriod,
  NewSpace,
  Buy,
  Bid,
  OfferPeriod,
  UpdateMedia,
  AcceptOffer,
  Propose,
  AcceptProposal,
  DenyProposal,
} from './generated/EventEmitter/EventEmitter';
import { Address, BigInt } from '@graphprotocol/graph-ts';
import {
  Media,
  Period,
  Space,
  Offer,
  DeniedProposal,
  Kaleido,
} from './generated/schema';
import * as schema from './generated/schema';

export function handleNewMedia(event: NewMedia): void {
  let media = new Media(addressToId(event.params.proxy));
  media.owner = event.params.mediaEOA;
  media.metadata = event.params.accountMetadata;
  media.saltNonce = event.params.saltNonce;
  media.spaces = [];
  media.save();
}

export function handleUpdateMedia(event: UpdateMedia): void {
  let media = Media.load(addressToId(event.params.proxy));
  if (!media) {
    return;
  }
  media.owner = event.params.mediaEOA;
  media.metadata = event.params.accountMetadata;
  media.save();
}

export function handleNewSpace(event: NewSpace): void {
  let space = new Space(event.params.metadata);
  // TODO: media
  space.deleted = false;
  space.save();
}

export function handleNewPeriod(event: NewPeriod): void {
  let params = event.params;
  newPeriod(
    params.tokenId,
    params.displayStartTimestamp,
    params.displayEndTimestamp,
    params.minPrice,
    pricing(params.pricing),
    params.saleStartTimestamp,
    params.saleEndTimestamp,
    params.spaceMetadata,
    params.tokenMetadata
  );
}

function newPeriod(
  tokenId: BigInt,
  displayStartTimestamp: BigInt,
  displayEndTimestamp: BigInt,
  minPrice: BigInt,
  pricing: string,
  saleStartTimestamp: BigInt,
  saleEndTimestamp: BigInt,
  spaceMetadata: string,
  tokenMetadata: string
): void {
  let period = new Period(toId(tokenId));
  period.deleted = false;
  period.displayEndTimestamp = displayEndTimestamp;
  period.displayStartTimestamp = displayStartTimestamp;
  // TODO: media
  //period.media = event.params.
  period.minPrice = minPrice;
  period.pricing = pricing;
  period.saleEndTimestamp = saleEndTimestamp;
  period.saleStartTimestamp = saleStartTimestamp;
  period.space = spaceMetadata;
  period.tokenMetadata = tokenMetadata;
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

export function handleAcceptOffer(event: AcceptOffer): void {
  let params = event.params;
  let offer = loadOffer(event.params.tokenId);
  if (!offer) {
    return;
  }
  offer.status = 'ACCEPTED';
  offer.save();
  newPeriod(
    params.tokenId,
    params.displayStartTimestamp,
    params.displayEndTimestamp,
    params.price,
    'OFFER',
    event.block.timestamp,
    event.block.timestamp,
    params.spaceMetadata,
    params.tokenMetadata
  );
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
  period.bidding = buy.id;
  period.save();
  addCirculation(event.params.price);
}

export function handleOfferPeriod(event: OfferPeriod): void {
  // TODO: emit tokenID
  let offer = new Offer('0x1');
  offer.metadata = event.params.spaceMetadata;
  offer.space = event.params.spaceMetadata;
  offer.displayStartTimestamp = event.params.displayStartTimestamp;
  offer.displayEndTimestamp = event.params.displayEndTimestamp;
  offer.from = event.params.sender;
  offer.price = event.params.price;
  offer.status = 'OFFERED';
  offer.save();
  addCirculation(event.params.price);
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
  period.bidding = bid.id;
  period.save();
  addCirculation(event.params.price);
}

export function handleDeletePeriod(event: DeletePeriod): void {
  let period = loadPeriod(event.params.tokenId);
  if (!period) {
    return;
  }
  period.deleted = true;
  period.save();
}

export function handlePropose(event: Propose): void {
  let period = loadPeriod(event.params.tokenId);
  if (!period) {
    return;
  }
  period.proposedMetadata = event.params.metadata;
  period.save();
}

export function handleAcceptProposal(event: AcceptProposal): void {
  let period = loadPeriod(event.params.tokenId);
  if (!period) {
    return;
  }
  period.proposalAccepted = true;
  period.save();
}

export function handleDenyProposal(event: DenyProposal): void {
  let denied = new DeniedProposal(event.params.metadata);
  denied.period = event.params.tokenId.toHexString();
  denied.reason = event.params.reason;
  denied.save();
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

let loadOffer = (tokenId: BigInt): Offer | null => {
  return Offer.load(toId(tokenId));
};

let loadPeriod = (tokenId: BigInt): Period | null => {
  return Period.load(toId(tokenId));
};

let loadKaleido = (): Kaleido => {
  let k = schema.Kaleido.load('kaleido');
  if (k) {
    return k;
  }
  let newK = new Kaleido('kaleido');
  newK.circulation = BigInt.fromI32(0);
  newK.save();
  return newK;
};

let addCirculation = (amount: BigInt): void => {
  let k = loadKaleido();
  k.circulation = k.circulation.plus(amount);
  k.save();
};

let addressToId = (address: Address): string => {
  return address.toHexString();
};
