import { BigInt } from "@graphprotocol/graph-ts";

import {
  Accept,
  Bid,
  Call,
  Close,
  Deny,
  NewPost,
  Propose,
} from "./generated/AdManager/AdManager";
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

export function handleAccept(event: Accept): void {
  let post = loadPost(toId(event.params.postId));
  post.successfulBid = toId(event.params.bidId);
  post.save();
  updateBidStatus(toId(event.params.bidId), "ACCEPTED");
}

export function handleCall(event: Call): void {
  updateBidStatus(toId(event.params.bidId), "CALLED");
}

export function handleDeny(event: Deny): void {
  // TODO: bookedBidIds ?
  updateBidStatus(toId(event.params.bidId), "DENIED");
}

export function handlePropose(event: Propose): void {
  let bid = loadBidder(toId(event.params.bidId));
  bid.metadata = event.params.metadata;
  bid.originalLink = event.params.originalLink;
  bid.save();
  updateBidStatus(toId(event.params.bidId), "PROPOSED");
}

export function handleClose(event: Close): void {
  // TODO: difference between Accept and Close
  let post = loadPost(toId(event.params.postId));
  post.successfulBid = toId(event.params.bitId);
  post.save();
  updateBidStatus(toId(event.params.bitId), "CLOSE");
}

function updateBidStatus(id: string, after: string): void {
  let bidder = loadBidder(id);
  bidder.status = after;
  bidder.save();
}

function loadBidder(id: string): Bidder {
  return Bidder.load(id)!!;
}

function loadPost(id: string): PostContent {
  return PostContent.load(id)!!;
}

let toId = (postId: BigInt): string => {
  return postId.toHexString();
};
