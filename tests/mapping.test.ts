import {
  clearStore,
  test,
  assert,
  newMockEvent,
} from "matchstick-as/assembly/index";
import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { NewMedia } from "../src/generated/EventEmitter/EventEmitter";
import { handleNewMedia } from "../src/mapping";

test("test on handleNewPost", () => {
  test("id should be id hex string", () => {
    let contractAddress = address_();
    _newMedia(
      mockNewMedia(contractAddress, address_(), meta_(), new BigInt(0))
    );
    assert.fieldEquals(
      "Media",
      contractAddress.toHexString(),
      "id",
      contractAddress.toHexString()
    );
    clearStore();
  });
});

function address_(): Address {
  return Address.fromString("0xD149ac01A582e65DBaa3D4ae986A6cf3fd758C1b");
}

function meta_(): string {
  return "metadata";
}

function idParam_(id: BigInt): ethereum.EventParam {
  return bigIntParam_("id", id);
}

function bigIntParam_(key: string, val: BigInt): ethereum.EventParam {
  return new ethereum.EventParam(key, ethereum.Value.fromUnsignedBigInt(val));
}

function strParam_(key: string, val: string): ethereum.EventParam {
  return new ethereum.EventParam(key, ethereum.Value.fromString(val));
}

function addressParam_(key: string, address: Address): ethereum.EventParam {
  return new ethereum.EventParam(key, ethereum.Value.fromAddress(address));
}

function i32Param_(key: string, val: i32): ethereum.EventParam {
  return new ethereum.EventParam(key, ethereum.Value.fromI32(val));
}

function mockNewMedia(
  id: Address,
  from: Address,
  metadata: string,
  saltNonce: BigInt
): NewMedia {
  let newMedia = newMockEvent();
  newMedia.parameters = new Array();
  newMedia.transaction = new ethereum.Transaction(
    new Bytes(0),
    new BigInt(0),
    address_(),
    null,
    new BigInt(0),
    new BigInt(0),
    new BigInt(0),
    new Bytes(0)
  );
  let idParam = addressParam_("id", id);
  let metadataParam = strParam_("accountMetadata", metadata);
  let saltNonceParam = bigIntParam_("saltNonce", saltNonce);
  newMedia.parameters.push(idParam);
  newMedia.parameters.push(metadataParam);
  newMedia.parameters.push(saltNonceParam);
  newMedia.transaction.from = from;
  return newMedia as NewMedia;
}

function _newMedia(newMedia: NewMedia): void {
  handleNewMedia(newMedia);
}
