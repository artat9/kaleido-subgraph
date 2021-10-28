import { NewMedia } from "./generated/EventEmitter/EventEmitter";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Media } from "./generated/schema";

export function handleNewMedia(event: NewMedia): void {
  let media = new Media(addressToId(event.params.proxy));
  media.owner = event.transaction.from;
  media.metadata = event.params.accountMetadata;
  media.saltNonce = event.params.saltNonce;
  media.save();
}

let toId = (postId: BigInt): string => {
  return postId.toHexString();
};

let addressToId = (address: Address): string => {
  return address.toHexString();
};
