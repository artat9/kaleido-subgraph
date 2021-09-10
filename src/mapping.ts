import { ADDRESS_ZERO } from "./../kaleido-core/test/utils/address";
import { Transfer } from "./generated/DistributionRight/DistributionRight";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  Accept,
  Bid,
  Book,
  Call,
  Close,
  Deny,
  NewPost,
  Propose,
  Refund,
} from "./generated/AdManager/AdManager";
import {
  Bidder,
  DistributionRight,
  Inventory,
  PostContent,
} from "./generated/schema";
//export { runTests } from "./tests/mapping.test";

export function handleNewPost(event: NewPost): void {
  newInventory(event.params.metadata, event.params.owner);
  let post = new PostContent(toId(event.params.postId));
  post.metadata = event.params.metadata;
  post.owner = event.params.owner;
  post.fromTimestamp = event.params.fromTimestamp.toI32();
  post.toTimestamp = event.params.toTimestamp.toI32();
  post.inventory = event.params.metadata;
  post.save();
}

function newInventory(metadata: string, owner: Address): void {
  let inventory = loadInventory(metadata);
  if (inventory) {
    return;
  }
  inventory = new Inventory(metadata);
  inventory.owner = owner;
  inventory.save();
}

export function handleTransfer(event: Transfer): void {
  let zero = Address.fromHexString(ADDRESS_ZERO);
  if (event.params.from == zero) {
    return;
  }
  if (event.params.to == zero) {
    return;
  }
  let right = loadRight(toId(event.params.tokenId));
  right.owner = event.params.to;
  right.save();
}

export function handleBid(event: Bid): void {
  handleNewBidder(
    event.params.postId,
    event.params.bidId,
    event.params.metadata,
    event.params.price,
    "LISTED",
    event.params.sender
  );
  let bidder = loadBidder(toId(event.params.bidId));
  bidder.bidPost = toId(event.params.postId);
  bidder.save();
}

export function handleBook(event: Book): void {
  handleNewBidder(
    event.params.postId,
    event.params.bidId,
    "",
    event.params.price,
    "BOOKED",
    event.params.sender
  );
  let bidder = loadBidder(toId(event.params.bidId));
  bidder.bookedPost = toId(event.params.postId);
  bidder.save();
}

function handleNewBidder(
  postId: BigInt,
  bidId: BigInt,
  metadata: string,
  price: BigInt,
  status: string,
  sender: Address
): void {
  let bidder = new Bidder(toId(bidId));
  bidder.post = toId(postId);
  bidder.metadata = metadata;
  bidder.price = price;
  bidder.status = status;
  bidder.sender = sender;
  bidder.successful = false;
  bidder.save();
}

export function handleAccept(event: Accept): void {
  updateBidStatus(toId(event.params.bidId), "ACCEPTED");
  let right = loadRight(toId(event.params.postId));
  right.burned = true;
  right.save();
}

function handleSuccessful(
  postId: BigInt,
  bidId: BigInt,
  statusAfter: string
): void {
  let post = loadPost(toId(postId));
  post.successfulBid = toId(bidId);
  post.save();
  let successfulBid = loadBidder(toId(bidId));
  successfulBid.successful = true;
  successfulBid.save();
  updateBidStatus(toId(bidId), statusAfter);
}

export function handleCall(event: Call): void {
  handleSuccessful(event.params.postId, event.params.bidId, "CALLED");
  let right = new DistributionRight(toId(event.params.postId));
  right.burned = false;
  right.owner = event.params.sender;
  right.post = toId(event.params.postId);
  right.save();
  let post = loadPost(toId(event.params.postId));
  post.right = toId(event.params.postId);
  post.save();
}

export function handleDeny(event: Deny): void {
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
  handleSuccessful(event.params.postId, event.params.bitId, "ACCEPTED");
}

function updateBidStatus(id: string, after: string): void {
  let bidder = loadBidder(id);
  bidder.status = after;
  bidder.save();
}

function loadBidder(id: string): Bidder {
  return Bidder.load(id)!!;
}

function loadRight(id: string): DistributionRight {
  return DistributionRight.load(id)!!;
}

export function loadPost(id: string): PostContent {
  return PostContent.load(id)!!;
}

export function loadInventory(metadata: string): Inventory | null {
  return Inventory.load(metadata);
}

let toId = (postId: BigInt): string => {
  return postId.toHexString();
};
