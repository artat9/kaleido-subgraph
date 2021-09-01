import { BigInt } from "@graphprotocol/graph-ts";

import { Bid, NewPost } from "./generated/AdManager/AdManager";
import { Bidder, PostContent } from "./generated/schema";

export function handleNewPost(event: NewPost): void {
  let post = new PostContent(toId(event.params.postId));
  post.metadata = event.params.metadata;
  post.metadataIndex = event.params.metadataIndex;
  post.fromTimestamp = event.params.fromTimestamp.toI32();
  post.toTimestamp = event.params.toTimestamp.toI32();
  post.save();
}

export function handleBid(event: Bid): void {
  let bidder = new Bidder(toId(event.params.bidId));
  bidder.post = toId(event.params.postId);
  bidder.metadata = event.params.metadata;
  bidder.originalLink = event.params.originalLink;
  bidder.price = event.params.price;
  bidder.status = "LISTED";
  bidder.save();
}

let toId = (postId: BigInt): string => {
  return postId.toHexString();
};
