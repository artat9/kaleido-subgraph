import { BigInt } from "@graphprotocol/graph-ts";

import {
  CancelDonation,
  Donate,
  NewPost,
  ReachCapacity,
  RequestRefund,
  Withdraw,
  Refund,
} from "./generated/Event/Event";
import { Donation, PostContent } from "./generated/schema";

export function handleNewPost(event: NewPost): void {
  let post = new PostContent(toId(event.params.postId));
  post.metadata = event.params.metadataURI;
  post.donee = event.params.donee;
  post.capacity = event.params.capacity.toI32();
  post.periodHours = event.params.periodHours.toI32();
  post.startTime = event.params.startTime.toI32();
  post.endTime = event.params.endTime.toI32();
  post.donatedCount = 0;
  post.donatedSum = new BigInt(0);
  post.withdrawn = false;
  post.save();
}

export function handleDonate(event: Donate): void {
  let donation = new Donation(toId(event.params.receiptId));
  donation.receiptId = event.params.receiptId;
  donation.donated = toId(event.params.postId);
  donation.serialNo = event.params.serialId.toI32();
  donation.sender = event.transaction.from;
  donation.amount = event.params.amount;
  donation.donateTime = event.block.timestamp.toI32();
  onDonate(donation);
  donation.save();
}

export function handleCancelDonation(event: CancelDonation): void {
  let post = loadPost(toId(event.params.postId));
  let cancelledPost = cancelPost(post, event.params.amount);
  cancelledPost.save();
  let donate = loadDonation(event.params.receiptId);
  let cancelled = onCancel(donate);
  cancelled.save();
}

export function handleReachCapacity(event: ReachCapacity): void {
  let post = loadPost(toId(event.params.postId));
  post.endTime = event.params.endTime.toI32();
  post.donatedSum = event.params.donatedSum;
  post.donatedCount = event.params.donatedCount.toI32();
  post.save();
}

export function handleWithdraw(event: Withdraw): void {
  let post = loadPost(toId(event.params.postId));
  post.withdrawn = true;
  post.metadata = "";
  post.save();
}

export function handleRequestRefund(event: RequestRefund): void {
  let donation = loadDonation(event.params.receiptId);
  let refundRequested = onRefundRequested(donation);
  refundRequested.save();
}

export function handleRefund(event: Refund): void {
  let donation = loadDonation(event.params.receiptId);
  let refunded = onRefund(donation);
  refunded.save();
}

let toId = (postId: BigInt): string => {
  return postId.toHexString();
};

const onDonate = (donation: Donation): void => {
  let post = loadPost(donation.donated!!);
  post.donatedSum = post.donatedSum.plus(donation.amount);
  post.donatedCount = post.donatedCount + 1;
  post.save();
};

function loadPost(id: string): PostContent {
  return PostContent.load(id)!!;
}

function loadDonation(id: BigInt): Donation {
  return Donation.load(toId(id))!!;
}

const cancelPost = (post: PostContent, amount: BigInt): PostContent => {
  post.donatedSum = post.donatedSum.minus(amount);
  post.donatedCount = post.donatedCount - 1;
  return post;
};

const onCancel = (donation: Donation): Donation => {
  donation.cancelled = donation.donated;
  donation.donated = null;
  return donation;
};

const onRefundRequested = (donation: Donation): Donation => {
  donation.refundRequested = donation.donated;
  donation.donated = null;
  return donation;
};

const onRefund = (donation: Donation): Donation => {
  donation.refunded = donation.refundRequested;
  donation.refundRequested = null;
  return donation;
};
