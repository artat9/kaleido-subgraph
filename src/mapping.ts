import {
  NewMedia,
  NewPeriod,
  NewSpace,
} from "./generated/EventEmitter/EventEmitter";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Media, Period, Space } from "./generated/schema";

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
  period.sold = false;
  period.space = event.params.spaceMetadata;
  period.tokenMetadata = event.params.tokenMetadata;
  period.save();
}

function pricing(val: i32): string {
  switch (val) {
    case 0:
      return "RRP";
    case 1:
      return "DPBT";
    case 2:
      return "BIDDING";
    case 3:
      return "OFFER";
    default:
      return "";
  }
}

let toId = (postId: BigInt): string => {
  return postId.toHexString();
};

let addressToId = (address: Address): string => {
  return address.toHexString();
};
