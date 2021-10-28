import { NewMedia, NewSpace } from "./generated/EventEmitter/EventEmitter";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Media, Space } from "./generated/schema";

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
  space.save();
}

let toId = (postId: BigInt): string => {
  return postId.toHexString();
};

let addressToId = (address: Address): string => {
  return address.toHexString();
};
