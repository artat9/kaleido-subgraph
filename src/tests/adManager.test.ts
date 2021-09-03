import {
  Accept,
  Bid,
  Book,
  Call,
  Close,
  Deny,
  NewPost,
  Refund,
} from "./../generated/AdManager/AdManager";
import {
  clearStore,
  test,
  assert,
  newMockEvent,
} from "matchstick-as/assembly/index";
import {
  handleAccept,
  handleBid,
  handleBook,
  handleCall,
  handleClose,
  handleDeny,
  handleNewPost,
  handleRefund,
  loadPost,
} from "../mapping";
import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";

export function runTests(): void {
  testHandleNewPost();
  testHandleBid();
  testHandleAccept();
  testHandleCall();
  testHandleDeny();
  testHandleRefund();
  testHandleClosed();
}

function testHandleRefund(): void {
  test("bid status should be changed to REFUNDED", () => {
    let postId = new BigInt(3);
    newPost_(
      mockNewPost(postId, address_(), meta_(), 1, new BigInt(1), new BigInt(1))
    );
    let id = new BigInt(1);
    bid_(mockNewBid(id, postId, address_(), new BigInt(1), meta_()));
    refund_(mockRefund(postId, id, address_(), new BigInt(0)));
    assert.fieldEquals("Bidder", id.toHexString(), "status", "REFUNDED");
    clearStore();
  });
}

function testHandleDeny(): void {
  test("bid status should be changed to DENIED", () => {
    let postId = new BigInt(3);
    newPost_(
      mockNewPost(postId, address_(), meta_(), 1, new BigInt(1), new BigInt(1))
    );
    let id = new BigInt(1);
    bid_(mockNewBid(id, postId, address_(), new BigInt(1), meta_()));
    deny_(mockDeny(postId, id));
    assert.fieldEquals("Bidder", id.toHexString(), "status", "DENIED");
    clearStore();
  });
}

function testHandleAccept(): void {
  test("bid status should be changed to ACCEPTED", () => {
    let postId = new BigInt(3);
    newPost_(
      mockNewPost(postId, address_(), meta_(), 1, new BigInt(1), new BigInt(1))
    );
    let id = new BigInt(1);
    bid_(mockNewBid(id, postId, address_(), new BigInt(1), meta_()));
    accept_(mockAccept(postId, id));
    assert.fieldEquals("Bidder", id.toHexString(), "status", "ACCEPTED");
    clearStore();
  });
}

function testHandleClosed(): void {
  test("on close, bid status should be changed to ACCEPTED", () => {
    let postId = new BigInt(3);
    newPost_(
      mockNewPost(postId, address_(), meta_(), 1, new BigInt(1), new BigInt(1))
    );
    let id = new BigInt(1);
    bid_(mockNewBid(id, postId, address_(), new BigInt(1), meta_()));
    close_(mockClose(id, postId, address_(), new BigInt(1), meta_()));
    assert.fieldEquals("Bidder", id.toHexString(), "status", "ACCEPTED");
    clearStore();
  });
}

function testHandleCall(): void {
  test("bid status should be changed to CALLED", () => {
    let postId = new BigInt(3);
    newPost_(
      mockNewPost(postId, address_(), meta_(), 1, new BigInt(1), new BigInt(1))
    );
    let id = new BigInt(1);
    bid_(mockNewBid(id, postId, address_(), new BigInt(1), meta_()));
    call_(mockCall(id, postId, address_(), new BigInt(0)));
    assert.fieldEquals("Bidder", id.toHexString(), "status", "CALLED");
    clearStore();
  });
  test("bid succeed when called", () => {
    let postId = new BigInt(3);
    newPost_(
      mockNewPost(postId, address_(), meta_(), 1, new BigInt(1), new BigInt(1))
    );
    let id = new BigInt(1);
    bid_(mockNewBid(id, postId, address_(), new BigInt(1), meta_()));
    call_(mockCall(id, postId, address_(), new BigInt(0)));
    let post = loadPost(postId.toHexString());
    let got = ethereum.Value.fromString(post.successfulBid!!);
    let want = ethereum.Value.fromString(postId.toHexString());
    assert.equals(want, got);
    clearStore();
  });
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
      bid_(mockNewBid(id, postId, address_(), new BigInt(1), meta_()));
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
      bid_(mockNewBid(id, postId, address_(), new BigInt(1), metadata));
      assert.fieldEquals("Bidder", id.toHexString(), "metadata", metadata);
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
      bid_(mockNewBid(id, postId, address_(), price, "metadata"));
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
      bid_(mockNewBid(id, postId, address_(), new BigInt(1), "metadata"));
      assert.fieldEquals("Bidder", id.toHexString(), "status", "LISTED");
      clearStore();
    });
    test("sender should be as it is", () => {
      let postId = new BigInt(3);
      let sender = address_();
      newPost_(
        mockNewPost(postId, sender, "metadata", 1, new BigInt(1), new BigInt(1))
      );
      let id = new BigInt(1);
      bid_(mockNewBid(id, postId, sender, new BigInt(1), "metadata"));
      assert.fieldEquals(
        "Bidder",
        id.toHexString(),
        "sender",
        sender.toHexString()
      );
      clearStore();
    });
  });
}

function testHandleBook(): void {
  test("test ont handleBook", () => {
    test("bid id should be id hex string on book", () => {
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
      _book(mockNewBook(id, postId, address_(), new BigInt(1)));
      assert.fieldEquals("Bidder", id.toHexString(), "id", id.toHexString());
      clearStore();
    });
    test("bid metadata should be empty string on book", () => {
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
      _book(mockNewBook(id, postId, address_(), new BigInt(1)));
      assert.fieldEquals("Bidder", id.toHexString(), "metadata", "");
      clearStore();
    });
    test("price should be as it is on book", () => {
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
      _book(mockNewBook(id, postId, address_(), price));
      assert.fieldEquals("Bidder", id.toHexString(), "price", price.toString());
      clearStore();
    });
    test("status should be BOOKED on book", () => {
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
      _book(mockNewBook(id, postId, address_(), new BigInt(1)));
      assert.fieldEquals("Bidder", id.toHexString(), "status", "BOOKED");
      clearStore();
    });
    test("sender should be as it is on book", () => {
      let postId = new BigInt(3);
      let sender = address_();
      newPost_(
        mockNewPost(postId, sender, "metadata", 1, new BigInt(1), new BigInt(1))
      );
      let id = new BigInt(1);
      _book(mockNewBook(id, postId, sender, new BigInt(1)));
      assert.fieldEquals(
        "Bidder",
        id.toHexString(),
        "sender",
        sender.toHexString()
      );
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

function accept_(accept: Accept): void {
  let acceptEvent = newMockEvent(accept) as Accept;
  handleAccept(acceptEvent);
}

function mockAccept(postId: BigInt, bidId: BigInt): Accept {
  let accept = new Accept();
  accept.parameters = new Array();
  let postIdParam = idParam_(postId);
  let bidIdParam = idParam_(bidId);
  accept.parameters.push(postIdParam);
  accept.parameters.push(bidIdParam);
  return accept;
}

function refund_(refund: Refund): void {
  let refundEvent = newMockEvent(refund) as Refund;
  handleRefund(refundEvent);
}

function mockRefund(
  bidId: BigInt,
  postId: BigInt,
  sender: Address,
  price: BigInt
): Refund {
  let refund = new Refund();
  refund.parameters = new Array();
  let bidIdParam = idParam_(bidId);
  let postIdParam = idParam_(postId);
  let senderParam = addressParam_(sender);
  let priceParam = bigIntParam_(price);
  refund.parameters.push(bidIdParam);
  refund.parameters.push(postIdParam);
  refund.parameters.push(senderParam);
  refund.parameters.push(priceParam);
  return refund;
}

function deny_(deny: Deny): void {
  let acceptEvent = newMockEvent(deny) as Deny;
  handleDeny(acceptEvent);
}

function mockDeny(postId: BigInt, bidId: BigInt): Deny {
  let accept = new Deny();
  accept.parameters = new Array();
  let bidIdParam = idParam_(bidId);
  let postIdParam = idParam_(postId);
  accept.parameters.push(bidIdParam);
  accept.parameters.push(postIdParam);
  return accept;
}

function call_(call: Call): void {
  let callEvent = newMockEvent(call) as Call;
  handleCall(callEvent);
}

function mockCall(
  bidId: BigInt,
  postId: BigInt,
  sender: Address,
  price: BigInt
): Call {
  let call = new Call();
  call.parameters = new Array();
  let bidid = idParam_(bidId);
  let postIdParam = idParam_(postId);
  let senderParam = addressParam_(sender);
  let priceParam = bigIntParam_(price);
  call.parameters.push(bidid);
  call.parameters.push(postIdParam);
  call.parameters.push(senderParam);
  call.parameters.push(priceParam);
  return call;
}

function idParam_(id: BigInt): ethereum.EventParam {
  return bigIntParam_(id);
}

function bigIntParam_(val: BigInt): ethereum.EventParam {
  let p = new ethereum.EventParam();
  p.value = ethereum.Value.fromUnsignedBigInt(val);
  return p;
}

function strParam_(val: string): ethereum.EventParam {
  let p = new ethereum.EventParam();
  p.value = ethereum.Value.fromString(val);
  return p;
}

function addressParam_(address: Address): ethereum.EventParam {
  let p = new ethereum.EventParam();
  p.value = ethereum.Value.fromAddress(address);
  return p;
}

function i32Param_(val: i32): ethereum.EventParam {
  let p = new ethereum.EventParam();
  p.value = ethereum.Value.fromI32(val);
  return p;
}

function close_(close: Close): void {
  let closeEvent = newMockEvent(close) as Close;
  handleClose(closeEvent);
}

function mockClose(
  id: BigInt,
  postId: BigInt,
  sender: Address,
  price: BigInt,
  metadata: string
): Close {
  let close = new Close();
  close.parameters = new Array();
  let idParam = idParam_(id);
  let postIdParam = idParam_(postId);
  let senderParam = addressParam_(sender);
  let priceParam = bigIntParam_(price);
  let metaParam = strParam_(metadata);
  close.parameters.push(idParam);
  close.parameters.push(postIdParam);
  close.parameters.push(senderParam);
  close.parameters.push(priceParam);
  close.parameters.push(metaParam);
  return close;
}

function _book(book: Book): void {
  let bookEvent = newMockEvent(book) as Book;
  handleBook(bookEvent);
}

function mockNewBook(
  id: BigInt,
  postId: BigInt,
  sender: Address,
  price: BigInt
): Bid {
  let bid = new Bid();
  bid.parameters = new Array();
  let idParam = idParam_(id);
  let postIdParam = idParam_(postId);
  let senderParam = addressParam_(sender);
  let priceParam = bigIntParam_(price);
  bid.parameters.push(idParam);
  bid.parameters.push(postIdParam);
  bid.parameters.push(senderParam);
  bid.parameters.push(priceParam);
  return bid;
}

function mockNewBid(
  id: BigInt,
  postId: BigInt,
  sender: Address,
  price: BigInt,
  metadata: string
): Bid {
  let bid = new Bid();
  bid.parameters = new Array();
  let idParam = idParam_(id);
  let postIdParam = idParam_(postId);
  let senderParam = addressParam_(sender);
  let priceParam = bigIntParam_(price);
  let metadataParam = strParam_(metadata);
  bid.parameters.push(idParam);
  bid.parameters.push(postIdParam);
  bid.parameters.push(senderParam);
  bid.parameters.push(priceParam);
  bid.parameters.push(metadataParam);
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
  let postIdParam = idParam_(id);
  let ownerParam = addressParam_(owner);
  let metadataParam = strParam_(meta);
  let metadataIndexParam = i32Param_(metadataIndex);
  let fromTimestampParam = bigIntParam_(from);
  let toTimestammpParam = bigIntParam_(to);
  post.parameters.push(postIdParam);
  post.parameters.push(ownerParam);
  post.parameters.push(metadataParam);
  post.parameters.push(metadataIndexParam);
  post.parameters.push(fromTimestampParam);
  post.parameters.push(toTimestammpParam);
  return post;
}
