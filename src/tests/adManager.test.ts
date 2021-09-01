import { Bid, NewPost } from "./../generated/AdManager/AdManager";
import {
  clearStore,
  test,
  assert,
  newMockEvent,
} from "matchstick-as/assembly/index";
import { handleBid, handleNewPost } from "../mapping";
import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";

export function runTests(): void {
  testHandleNewPost();
  testHandleBid();
}

function testHandleBid(): void {
  test("test ont handleBid", () => {
    test("bid id should be id hex string", () => {
      let postId = new BigInt(3);
      newPost_(
        mockNewPost(
          postId,
          address_(),
          meta_(),
          1,
          new BigInt(1),
          new BigInt(1)
        )
      );
      let id = new BigInt(1);
      bid_(mockNewBid(id, postId, address_(), new BigInt(1), meta_(), "link"));
      assert.fieldEquals("Bidder", id.toHexString(), "id", id.toHexString());
      clearStore();
    });
    test("bid metadata should be as it is", () => {
      let postId = new BigInt(3);
      let metadata = "metadata";
      newPost_(
        mockNewPost(
          postId,
          address_(),
          metadata,
          1,
          new BigInt(1),
          new BigInt(1)
        )
      );
      let id = new BigInt(1);
      bid_(mockNewBid(id, postId, address_(), new BigInt(1), metadata, "link"));
      assert.fieldEquals("Bidder", id.toHexString(), "metadata", metadata);
      clearStore();
    });
    test("originalLink should be as it is", () => {
      let postId = new BigInt(3);
      let originalLink = "https://yahoo.com";
      newPost_(
        mockNewPost(
          postId,
          address_(),
          "metadata",
          1,
          new BigInt(1),
          new BigInt(1)
        )
      );
      let id = new BigInt(1);
      bid_(
        mockNewBid(
          id,
          postId,
          address_(),
          new BigInt(1),
          "metadata",
          originalLink
        )
      );
      assert.fieldEquals(
        "Bidder",
        id.toHexString(),
        "originalLink",
        originalLink
      );
      clearStore();
    });
    test("price should be as it is", () => {
      let postId = new BigInt(3);
      newPost_(
        mockNewPost(
          postId,
          address_(),
          "metadata",
          1,
          new BigInt(1),
          new BigInt(1)
        )
      );
      let id = new BigInt(1);
      let price = new BigInt(100000000);
      bid_(mockNewBid(id, postId, address_(), price, "metadata", "link"));
      assert.fieldEquals("Bidder", id.toHexString(), "price", price.toString());
      clearStore();
    });
    test("status should be LISTED on bid", () => {
      let postId = new BigInt(3);
      newPost_(
        mockNewPost(
          postId,
          address_(),
          "metadata",
          1,
          new BigInt(1),
          new BigInt(1)
        )
      );
      let id = new BigInt(1);
      bid_(
        mockNewBid(id, postId, address_(), new BigInt(1), "metadata", "link")
      );
      assert.fieldEquals("Bidder", id.toHexString(), "status", "LISTED");
      clearStore();
    });
  });
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

function bid_(bid: Bid): void {
  let newbidEvent = newMockEvent(bid) as Bid;
  handleBid(newbidEvent);
}

function mockNewBid(
  id: BigInt,
  postId: BigInt,
  sender: Address,
  price: BigInt,
  metadata: string,
  originalLink: string
): Bid {
  let bid = new Bid();
  bid.parameters = new Array();
  let idParam = new ethereum.EventParam();
  idParam.value = ethereum.Value.fromUnsignedBigInt(id);
  let postIdParam = new ethereum.EventParam();
  postIdParam.value = ethereum.Value.fromUnsignedBigInt(postId);
  let senderParam = new ethereum.EventParam();
  senderParam.value = ethereum.Value.fromAddress(sender);
  let priceParam = new ethereum.EventParam();
  priceParam.value = ethereum.Value.fromUnsignedBigInt(price);
  let metadataParam = new ethereum.EventParam();
  metadataParam.value = ethereum.Value.fromString(metadata);
  let originalLinkParam = new ethereum.EventParam();
  originalLinkParam.value = ethereum.Value.fromString(originalLink);
  bid.parameters.push(idParam);
  bid.parameters.push(postIdParam);
  bid.parameters.push(senderParam);
  bid.parameters.push(priceParam);
  bid.parameters.push(metadataParam);
  bid.parameters.push(originalLinkParam);
  return bid;
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
