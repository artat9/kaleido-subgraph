import {
  clearStore,
  test,
  assert,
  newMockEvent,
} from "matchstick-as/assembly/index";
import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { NewMedia, NewSpace } from "../src/generated/EventEmitter/EventEmitter";
import { handleNewMedia, handleNewSpace } from "../src/mapping";

test("test on handleNewMedia", () => {
  let contractAddress = address_();
  let eoa = addressFromHexString("0x50414Ac6431279824df9968855181474c919a94B");
  let metadata = meta_();
  let saltNonce = BigInt.fromString("1234");
  _newMedia(mockNewMedia(contractAddress, eoa, metadata, saltNonce));
  assertMedia(contractAddress, "id", contractAddress.toHexString());
  assertMedia(contractAddress, "owner", eoa.toHexString());
  assertMedia(contractAddress, "metadata", metadata);
  assertMedia(contractAddress, "saltNonce", saltNonce.toString());
  assertMedia(contractAddress, "spaces", "[]");
  clearStore();
});

test("test on handleNewSpace", () => {
  let metadata = meta_();
  _newSpace(mockNewSpace(metadata));
  assert.fieldEquals("Space", metadata, "id", metadata);
});

function assertMedia(id: Address, key: string, want: string): void {
  assert.fieldEquals("Media", id.toHexString(), key, want);
}

function address_(): Address {
  return addressFromHexString("0xD149ac01A582e65DBaa3D4ae986A6cf3fd758C1b");
}

function addressFromHexString(val: string): Address {
  return Address.fromString(val);
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
  let mockEvent = newMockEvent();
  let newMedia = new NewMedia(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters
  );
  newMedia.parameters = new Array();
  newMedia.transaction = new ethereum.Transaction(
    new Bytes(0),
    new BigInt(0),
    from,
    null,
    new BigInt(0),
    new BigInt(0),
    new BigInt(0),
    new Bytes(0)
  );
  let idParam = addressParam_("proxy", id);
  let metadataParam = strParam_("accountMetadata", metadata);
  let saltNonceParam = bigIntParam_("saltNonce", saltNonce);
  newMedia.parameters.push(idParam);
  newMedia.parameters.push(metadataParam);
  newMedia.parameters.push(saltNonceParam);
  return newMedia;
}

function mockNewSpace(metadata: string): NewSpace {
  let mockEvent = newMockEvent();
  let newSpace = new NewSpace(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters
  );
  newSpace.parameters = new Array();
  newSpace.transaction = new ethereum.Transaction(
    new Bytes(0),
    new BigInt(0),
    address_(),
    null,
    new BigInt(0),
    new BigInt(0),
    new BigInt(0),
    new Bytes(0)
  );
  let metadataParam = strParam_("metadata", metadata);
  newSpace.parameters.push(metadataParam);
  return newSpace;
}

function _newMedia(newMedia: NewMedia): void {
  handleNewMedia(newMedia);
}

function _newSpace(newSpace: NewSpace): void {
  handleNewSpace(newSpace);
}
