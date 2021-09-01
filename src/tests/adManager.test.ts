import { NewPost } from "./../generated/AdManager/AdManager";
import {
  clearStore,
  test,
  assert,
  newMockEvent,
} from "matchstick-as/assembly/index";
import { handleNewPost } from "../mapping";
import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";

export function runTests(): void {
  testHandleNewPost();
}

function testHandleNewPost(): void {
  test("test on handleNewPost", () => {
    test("id should be id hex string", () => {
      let id = new BigInt(1);
      newPost_(
        mockNewPost(id, address_(), meta_(), 1, new BigInt(1), new BigInt(1))
      );
      assert.fieldEquals(
        "PostContent",
        id.toHexString(),
        "id",
        id.toHexString()
      );
      clearStore();
    });
    test("owner should be owner hex string", () => {
      let id = new BigInt(1);
      let address = Address.fromString(
        "0xD149ac01A582e65DBaa3D4ae986A6cf3fd758C1b"
      );
      newPost_(
        mockNewPost(id, address, meta_(), 1, new BigInt(1), new BigInt(1))
      );
      assert.fieldEquals(
        "PostContent",
        id.toHexString(),
        "owner",
        address.toHexString()
      );
      clearStore();
    });
  });
  test("metadata should be as it is", () => {
    let id = new BigInt(1);
    let metadata = "metadata";
    newPost_(
      mockNewPost(id, address_(), metadata, 1, new BigInt(0), new BigInt(0))
    );
    assert.fieldEquals("PostContent", id.toHexString(), "metadata", metadata);
    clearStore();
  });
  test("metadata idx should be as it is", () => {
    let id = new BigInt(1);
    let idx = 1;
    newPost_(
      mockNewPost(id, address_(), meta_(), idx, new BigInt(0), new BigInt(0))
    );
    assert.fieldEquals(
      "PostContent",
      id.toHexString(),
      "metadataIndex",
      idx.toString()
    );
    clearStore();
  });
  test("from timestamp should be as it is", () => {
    let id = new BigInt(1);
    let from = new BigInt(1000);
    newPost_(mockNewPost(id, address_(), meta_(), 1, from, new BigInt(0)));
    assert.fieldEquals(
      "PostContent",
      id.toHexString(),
      "fromTimestamp",
      from.toString()
    );
    clearStore();
  });
  test("to timestamp should be as it is", () => {
    let id = new BigInt(1);
    let to = new BigInt(1000);
    newPost_(mockNewPost(id, address_(), meta_(), 1, new BigInt(0), to));
    assert.fieldEquals(
      "PostContent",
      id.toHexString(),
      "toTimestamp",
      to.toString()
    );
    clearStore();
  });
}

function address_(): Address {
  return Address.fromString("0xD149ac01A582e65DBaa3D4ae986A6cf3fd758C1b");
}

function meta_(): string {
  return "metadata";
}

function newPost_(post: NewPost): void {
  let newPostEvent = newMockEvent(post) as NewPost;
  handleNewPost(newPostEvent);
}
function mockNewPost(
  id: BigInt,
  owner: Address,
  meta: string,
  metadataIndex: i32,
  from: BigInt,
  to: BigInt
): NewPost {
  let post = new NewPost();
  post.parameters = new Array();
  let postIdParam = new ethereum.EventParam();
  postIdParam.value = ethereum.Value.fromUnsignedBigInt(id);
  let ownerParam = new ethereum.EventParam();
  ownerParam.value = ethereum.Value.fromAddress(owner);
  let metadataParam = new ethereum.EventParam();
  metadataParam.value = ethereum.Value.fromString(meta);
  let metadataIndexParam = new ethereum.EventParam();
  metadataIndexParam.value = ethereum.Value.fromI32(metadataIndex);
  let fromTimestampParam = new ethereum.EventParam();
  fromTimestampParam.value = ethereum.Value.fromUnsignedBigInt(from);
  let toTimestammpParam = new ethereum.EventParam();
  toTimestammpParam.value = ethereum.Value.fromUnsignedBigInt(to);
  post.parameters.push(postIdParam);
  post.parameters.push(ownerParam);
  post.parameters.push(metadataParam);
  post.parameters.push(metadataIndexParam);
  post.parameters.push(fromTimestampParam);
  post.parameters.push(toTimestammpParam);
  return post;
}
