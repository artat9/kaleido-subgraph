import { BigInt } from "@graphprotocol/graph-ts";

import { NewPost } from "./generated/AdManager/AdManager";
import { PostContent } from "./generated/schema";

export function handleNewPost(event: NewPost): void {
  let post = new PostContent(toId(event.params.postId));
  post.metadata = event.params.metadata;
  post.metadataIndex = event.params.metadataIndex;
  post.fromTimestamp = event.params.fromTimestamp.toI32();
  post.toTimestamp = event.params.toTimestamp.toI32();
  post.save();
}

let toId = (postId: BigInt): string => {
  return postId.toHexString();
};
