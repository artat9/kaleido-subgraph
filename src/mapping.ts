import { BigInt } from "@graphprotocol/graph-ts";

import {
  Accept,
  Bid,
  Call,
  Close,
  Deny,
  NewPost,
  Propose,
  Refund,
} from "./generated/AdManager/AdManager";
import { Bidder, PostContent } from "./generated/schema";
//export { runTests } from "./tests/adManager.test";

export function handleNewPost(event: NewPost): void {
  let post = new PostContent(toId(event.params.postId));
  post.metadata = event.params.metadata;
  post.owner = event.params.owner;
  post.metadataIndex = event.params.metadataIndex;
  post.fromTimestamp = event.params.fromTimestamp.toI32();
  post.toTimestamp = event.params.toTimestamp.toI32();
  post.save();
}

export function handleBid(event: Bid): void {
  let bidder = new Bidder(toId(event.params.bidId));
  bidder.post = toId(event.params.postId);
  bidder.metadata = event.params.metadata;
  bidder.price = event.params.price;
  bidder.status = "LISTED";
  bidder.sender = event.params.sender;
  bidder.save();
}

export function handleAccept(event: Accept): void {
  handleSuccessful(event.params.postId, event.params.bidId, "ACCEPTED");
}

function handleSuccessful(
  postId: BigInt,
  bidId: BigInt,
  statusAfter: string
): void {
  let post = loadPost(toId(postId));
  post.successfulBid = toId(bidId);
  post.save();
  updateBidStatus(toId(bidId), statusAfter);
}

export function handleCall(event: Call): void {
  handleSuccessful(event.params.postId, event.params.bidId, "CALLED");
}

export function handleDeny(event: Deny): void {
  // TODO: bookedBidIds ?
  updateBidStatus(toId(event.params.bidId), "DENIED");
}

export function handleRefund(event: Refund): void {
  updateBidStatus(toId(event.params.bitId), "REFUNDED");
}

export function handlePropose(event: Propose): void {
  let bid = loadBidder(toId(event.params.bidId));
  bid.metadata = event.params.metadata;
  bid.save();
  updateBidStatus(toId(event.params.bidId), "PROPOSED");
}

export function handleClose(event: Close): void {
  // TODO: difference between Accept and Close
  let post = loadPost(toId(event.params.postId));
  post.successfulBid = toId(event.params.bitId);
  post.save();
  updateBidStatus(toId(event.params.bitId), "ACCEPTED");
}

function updateBidStatus(id: string, after: string): void {
  let bidder = loadBidder(id);
  bidder.status = after;
  bidder.save();
}

function loadBidder(id: string): Bidder {
  return Bidder.load(id)!!;
}

export function loadPost(id: string): PostContent {
  return PostContent.load(id)!!;
}

let toId = (postId: BigInt): string => {
  return postId.toHexString();
};
