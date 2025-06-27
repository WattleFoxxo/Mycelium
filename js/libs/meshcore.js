var S = Object.defineProperty;
var v = (f, e, s) => e in f ? S(f, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : f[e] = s;
var y = (f, e, s) => (v(f, typeof e != "symbol" ? e + "" : e, s), s);
class h {
  constructor() {
    this.buffer = [];
  }
  toBytes() {
    return new Uint8Array(this.buffer);
  }
  writeBytes(e) {
    this.buffer = [
      ...this.buffer,
      ...e
    ];
  }
  writeByte(e) {
    this.writeBytes([
      e
    ]);
  }
  writeUInt16LE(e) {
    const s = new Uint8Array(2);
    new DataView(s.buffer).setUint16(0, e, !0), this.writeBytes(s);
  }
  writeUInt32LE(e) {
    const s = new Uint8Array(4);
    new DataView(s.buffer).setUint32(0, e, !0), this.writeBytes(s);
  }
  writeInt32LE(e) {
    const s = new Uint8Array(4);
    new DataView(s.buffer).setInt32(0, e, !0), this.writeBytes(s);
  }
  writeString(e) {
    this.writeBytes(new TextEncoder().encode(e));
  }
  writeCString(e, s) {
    const o = new Uint8Array(new ArrayBuffer(s)), n = new TextEncoder().encode(e);
    for (var a = 0; a < s && a < n.length; a++)
      o[a] = n[a];
    o[o.length - 1] = 0, this.writeBytes(o);
  }
}
class l {
  constructor(e) {
    this.pointer = 0, this.buffer = new Uint8Array(e);
  }
  getRemainingBytesCount() {
    return this.buffer.length - this.pointer;
  }
  readByte() {
    return this.readBytes(1)[0];
  }
  readBytes(e) {
    const s = this.buffer.slice(this.pointer, this.pointer + e);
    return this.pointer += e, s;
  }
  readRemainingBytes() {
    return this.readBytes(this.getRemainingBytesCount());
  }
  readString() {
    return new TextDecoder().decode(this.readRemainingBytes());
  }
  readCString(e) {
    const s = [], o = this.readBytes(e);
    for (const n of o) {
      if (n === 0)
        return new TextDecoder().decode(new Uint8Array(s));
      s.push(n);
    }
  }
  readInt8() {
    const e = this.readBytes(1);
    return new DataView(e.buffer).getInt8(0);
  }
  readUInt8() {
    const e = this.readBytes(1);
    return new DataView(e.buffer).getUint8(0);
  }
  readUInt16LE() {
    const e = this.readBytes(2);
    return new DataView(e.buffer).getUint16(0, !0);
  }
  readUInt32LE() {
    const e = this.readBytes(4);
    return new DataView(e.buffer).getUint32(0, !0);
  }
  readInt16LE() {
    const e = this.readBytes(2);
    return new DataView(e.buffer).getInt16(0, !0);
  }
  readInt32LE() {
    const e = this.readBytes(4);
    return new DataView(e.buffer).getInt32(0, !0);
  }
}
class t {
}
y(t, "SupportedCompanionProtocolVersion", 1), y(t, "SerialFrameTypes", {
  Incoming: 62,
  // ">"
  Outgoing: 60
  // "<"
}), y(t, "Ble", {
  ServiceUuid: "6E400001-B5A3-F393-E0A9-E50E24DCCA9E",
  CharacteristicUuidRx: "6E400002-B5A3-F393-E0A9-E50E24DCCA9E",
  CharacteristicUuidTx: "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"
}), y(t, "CommandCodes", {
  AppStart: 1,
  SendTxtMsg: 2,
  SendChannelTxtMsg: 3,
  GetContacts: 4,
  GetDeviceTime: 5,
  SetDeviceTime: 6,
  SendSelfAdvert: 7,
  SetAdvertName: 8,
  AddUpdateContact: 9,
  SyncNextMessage: 10,
  SetRadioParams: 11,
  SetTxPower: 12,
  ResetPath: 13,
  SetAdvertLatLon: 14,
  RemoveContact: 15,
  ShareContact: 16,
  ExportContact: 17,
  ImportContact: 18,
  Reboot: 19,
  GetBatteryVoltage: 20,
  SetTuningParams: 21,
  // todo
  DeviceQuery: 22,
  ExportPrivateKey: 23,
  ImportPrivateKey: 24,
  SendRawData: 25,
  SendLogin: 26,
  // todo
  SendStatusReq: 27,
  // todo
  GetChannel: 31,
  SetChannel: 32,
  // todo sign commands
  SendTracePath: 36,
  // todo set device pin command
  SetOtherParams: 38,
  SendTelemetryReq: 39
}), y(t, "ResponseCodes", {
  Ok: 0,
  // todo
  Err: 1,
  // todo
  ContactsStart: 2,
  Contact: 3,
  EndOfContacts: 4,
  SelfInfo: 5,
  Sent: 6,
  ContactMsgRecv: 7,
  ChannelMsgRecv: 8,
  CurrTime: 9,
  NoMoreMessages: 10,
  ExportContact: 11,
  BatteryVoltage: 12,
  DeviceInfo: 13,
  PrivateKey: 14,
  Disabled: 15,
  ChannelInfo: 18
}), y(t, "PushCodes", {
  Advert: 128,
  // when companion is set to auto add contacts
  PathUpdated: 129,
  SendConfirmed: 130,
  MsgWaiting: 131,
  RawData: 132,
  LoginSuccess: 133,
  LoginFail: 134,
  // not usable yet
  StatusResponse: 135,
  LogRxData: 136,
  TraceData: 137,
  NewAdvert: 138,
  // when companion is set to manually add contacts
  TelemetryResponse: 139
}), y(t, "ErrorCodes", {
  UnsupportedCmd: 1,
  NotFound: 2,
  TableFull: 3,
  BadState: 4,
  FileIoError: 5,
  IllegalArg: 6
}), y(t, "AdvType", {
  None: 0,
  Chat: 1,
  Repeater: 2,
  Room: 3
}), y(t, "SelfAdvertTypes", {
  ZeroHop: 0,
  Flood: 1
}), y(t, "TxtTypes", {
  Plain: 0,
  CliData: 1,
  SignedPlain: 2
});
class L {
  constructor() {
    this.eventListenersMap = /* @__PURE__ */ new Map();
  }
  on(e, s) {
    this.eventListenersMap.has(e) || this.eventListenersMap.set(e, []), this.eventListenersMap.get(e).push(s);
  }
  off(e, s) {
    if (this.eventListenersMap.has(e)) {
      const o = this.eventListenersMap.get(e).filter((n) => n !== s);
      this.eventListenersMap.set(e, o);
    }
  }
  once(e, s) {
    const o = (...n) => {
      this.off(e, o), setTimeout(() => s(...n), 0);
    };
    this.on(e, o);
  }
  emit(e, ...s) {
    if (this.eventListenersMap.has(e))
      for (const o of this.eventListenersMap.get(e))
        setTimeout(() => o(...s), 0);
  }
}
class w {
  static bytesToHex(e) {
    return Array.from(e).map((s) => s.toString(16).padStart(2, "0")).join("");
  }
  static hexToBytes(e) {
    return Uint8Array.from(e.match(/.{1,2}/g).map((s) => parseInt(s, 16)));
  }
  static base64ToBytes(e) {
    return Uint8Array.from(atob(e), (s) => s.charCodeAt(0));
  }
  static areBuffersEqual(e, s) {
    if (e.length !== s.length)
      return !1;
    for (let o = 0; o < e.length; o++)
      if (e[o] !== s[o])
        return !1;
    return !0;
  }
}
const i = class i {
  // custom packet as raw bytes, for applications with custom encryption, payloads, etc
  constructor(e, s, o) {
    this.header = e, this.path = s, this.payload = o, this.route_type = this.getRouteType(), this.route_type_string = this.getRouteTypeString(), this.payload_type = this.getPayloadType(), this.payload_type_string = this.getPayloadTypeString(), this.payload_version = this.getPayloadVer(), this.is_marked_do_not_retransmit = this.isMarkedDoNotRetransmit();
  }
  static fromBytes(e) {
    const s = new l(e), o = s.readByte(), n = s.readInt8(), a = s.readBytes(n), r = s.readRemainingBytes();
    return new i(o, a, r);
  }
  getRouteType() {
    return this.header & i.PH_ROUTE_MASK;
  }
  getRouteTypeString() {
    switch (this.getRouteType()) {
      case i.ROUTE_TYPE_FLOOD:
        return "FLOOD";
      case i.ROUTE_TYPE_DIRECT:
        return "DIRECT";
      default:
        return null;
    }
  }
  isRouteFlood() {
    return this.getRouteType() === i.ROUTE_TYPE_FLOOD;
  }
  isRouteDirect() {
    return this.getRouteType() === i.ROUTE_TYPE_DIRECT;
  }
  getPayloadType() {
    return this.header >> i.PH_TYPE_SHIFT & i.PH_TYPE_MASK;
  }
  getPayloadTypeString() {
    switch (this.getPayloadType()) {
      case i.PAYLOAD_TYPE_REQ:
        return "REQ";
      case i.PAYLOAD_TYPE_RESPONSE:
        return "RESPONSE";
      case i.PAYLOAD_TYPE_TXT_MSG:
        return "TXT_MSG";
      case i.PAYLOAD_TYPE_ACK:
        return "ACK";
      case i.PAYLOAD_TYPE_ADVERT:
        return "ADVERT";
      case i.PAYLOAD_TYPE_GRP_TXT:
        return "GRP_TXT";
      case i.PAYLOAD_TYPE_GRP_DATA:
        return "GRP_DATA";
      case i.PAYLOAD_TYPE_ANON_REQ:
        return "ANON_REQ";
      case i.PAYLOAD_TYPE_PATH:
        return "PATH";
      case i.PAYLOAD_TYPE_TRACE:
        return "TRACE";
      case i.PAYLOAD_TYPE_RAW_CUSTOM:
        return "RAW_CUSTOM";
      default:
        return null;
    }
  }
  getPayloadVer() {
    return this.header >> i.PH_VER_SHIFT & i.PH_VER_MASK;
  }
  markDoNotRetransmit() {
    this.header = 255;
  }
  isMarkedDoNotRetransmit() {
    return this.header === 255;
  }
  parsePayload() {
    switch (this.getPayloadType()) {
      case i.PAYLOAD_TYPE_PATH:
        return this.parsePayloadTypePath();
      case i.PAYLOAD_TYPE_REQ:
        return this.parsePayloadTypeReq();
      case i.PAYLOAD_TYPE_RESPONSE:
        return this.parsePayloadTypeResponse();
      case i.PAYLOAD_TYPE_TXT_MSG:
        return this.parsePayloadTypeTxtMsg();
      case i.PAYLOAD_TYPE_ACK:
        return this.parsePayloadTypeAck();
      case i.PAYLOAD_TYPE_ANON_REQ:
        return this.parsePayloadTypeAnonReq();
      default:
        return null;
    }
  }
  parsePayloadTypePath() {
    const e = new l(this.payload), s = e.readByte();
    return {
      src: e.readByte(),
      dest: s
    };
  }
  parsePayloadTypeReq() {
    const e = new l(this.payload), s = e.readByte(), o = e.readByte(), n = e.readRemainingBytes();
    return {
      src: o,
      dest: s,
      encrypted: n
    };
  }
  parsePayloadTypeResponse() {
    const e = new l(this.payload), s = e.readByte();
    return {
      src: e.readByte(),
      dest: s
    };
  }
  parsePayloadTypeTxtMsg() {
    const e = new l(this.payload), s = e.readByte();
    return {
      src: e.readByte(),
      dest: s
    };
  }
  parsePayloadTypeAck() {
    return {
      ack_code: this.payload
    };
  }
  parsePayloadTypeAnonReq() {
    const e = new l(this.payload), s = e.readByte();
    return {
      src: e.readBytes(32),
      dest: s
    };
  }
};
// Packet::header values
y(i, "PH_ROUTE_MASK", 3), // 2-bits
y(i, "PH_TYPE_SHIFT", 2), y(i, "PH_TYPE_MASK", 15), // 4-bits
y(i, "PH_VER_SHIFT", 6), y(i, "PH_VER_MASK", 3), // 2-bits
y(i, "ROUTE_TYPE_RESERVED1", 0), // FUTURE
y(i, "ROUTE_TYPE_FLOOD", 1), // flood mode, needs 'path' to be built up (max 64 bytes)
y(i, "ROUTE_TYPE_DIRECT", 2), // direct route, 'path' is supplied
y(i, "ROUTE_TYPE_RESERVED2", 3), // FUTURE
y(i, "PAYLOAD_TYPE_REQ", 0), // request (prefixed with dest/src hashes, MAC) (enc data: timestamp, blob)
y(i, "PAYLOAD_TYPE_RESPONSE", 1), // response to REQ or ANON_REQ (prefixed with dest/src hashes, MAC) (enc data: timestamp, blob)
y(i, "PAYLOAD_TYPE_TXT_MSG", 2), // a plain text message (prefixed with dest/src hashes, MAC) (enc data: timestamp, text)
y(i, "PAYLOAD_TYPE_ACK", 3), // a simple ack
y(i, "PAYLOAD_TYPE_ADVERT", 4), // a node advertising its Identity
y(i, "PAYLOAD_TYPE_GRP_TXT", 5), // an (unverified) group text message (prefixed with channel hash, MAC) (enc data: timestamp, "name: msg")
y(i, "PAYLOAD_TYPE_GRP_DATA", 6), // an (unverified) group datagram (prefixed with channel hash, MAC) (enc data: timestamp, blob)
y(i, "PAYLOAD_TYPE_ANON_REQ", 7), // generic request (prefixed with dest_hash, ephemeral pub_key, MAC) (enc data: ...)
y(i, "PAYLOAD_TYPE_PATH", 8), // returned path (prefixed with dest/src hashes, MAC) (enc data: path, extra)
y(i, "PAYLOAD_TYPE_TRACE", 9), // trace a path, collecting SNR for each hop
y(i, "PAYLOAD_TYPE_RAW_CUSTOM", 15);
let E = i;
class A {
  static getRandomInt(e, s) {
    return e = Math.ceil(e), s = Math.floor(s), Math.floor(Math.random() * (s - e + 1)) + e;
  }
}
class T extends L {
  async onConnected() {
    try {
      await this.deviceQuery(t.SupportedCompanionProtocolVersion);
    } catch {
    }
    this.emit("connected");
  }
  onDisconnected() {
    this.emit("disconnected");
  }
  async close() {
    throw new Error("This method must be implemented by the subclass.");
  }
  async sendToRadioFrame(e) {
    throw new Error("This method must be implemented by the subclass.");
  }
  async sendCommandAppStart() {
    const e = new h();
    e.writeByte(t.CommandCodes.AppStart), e.writeByte(1), e.writeBytes(new Uint8Array(6)), e.writeString("test"), await this.sendToRadioFrame(e.toBytes());
  }
  async sendCommandSendTxtMsg(e, s, o, n, a) {
    const r = new h();
    r.writeByte(t.CommandCodes.SendTxtMsg), r.writeByte(e), r.writeByte(s), r.writeUInt32LE(o), r.writeBytes(n.slice(0, 6)), r.writeString(a), await this.sendToRadioFrame(r.toBytes());
  }
  async sendCommandSendChannelTxtMsg(e, s, o, n) {
    const a = new h();
    a.writeByte(t.CommandCodes.SendChannelTxtMsg), a.writeByte(e), a.writeByte(s), a.writeUInt32LE(o), a.writeString(n), await this.sendToRadioFrame(a.toBytes());
  }
  async sendCommandGetContacts(e) {
    const s = new h();
    s.writeByte(t.CommandCodes.GetContacts), e && s.writeUInt32LE(e), await this.sendToRadioFrame(s.toBytes());
  }
  async sendCommandGetDeviceTime() {
    const e = new h();
    e.writeByte(t.CommandCodes.GetDeviceTime), await this.sendToRadioFrame(e.toBytes());
  }
  async sendCommandSetDeviceTime(e) {
    const s = new h();
    s.writeByte(t.CommandCodes.SetDeviceTime), s.writeUInt32LE(e), await this.sendToRadioFrame(s.toBytes());
  }
  async sendCommandSendSelfAdvert(e) {
    const s = new h();
    s.writeByte(t.CommandCodes.SendSelfAdvert), s.writeByte(e), await this.sendToRadioFrame(s.toBytes());
  }
  async sendCommandSetAdvertName(e) {
    const s = new h();
    s.writeByte(t.CommandCodes.SetAdvertName), s.writeString(e), await this.sendToRadioFrame(s.toBytes());
  }
  async sendCommandAddUpdateContact(e, s, o, n, a, r, d, p, m) {
    const c = new h();
    c.writeByte(t.CommandCodes.AddUpdateContact), c.writeBytes(e), c.writeByte(s), c.writeByte(o), c.writeByte(n), c.writeBytes(a), c.writeCString(r, 32), c.writeUInt32LE(d), c.writeUInt32LE(p), c.writeUInt32LE(m), await this.sendToRadioFrame(c.toBytes());
  }
  async sendCommandSyncNextMessage() {
    const e = new h();
    e.writeByte(t.CommandCodes.SyncNextMessage), await this.sendToRadioFrame(e.toBytes());
  }
  async sendCommandSetRadioParams(e, s, o, n) {
    const a = new h();
    a.writeByte(t.CommandCodes.SetRadioParams), a.writeUInt32LE(e), a.writeUInt32LE(s), a.writeByte(o), a.writeByte(n), await this.sendToRadioFrame(a.toBytes());
  }
  async sendCommandSetTxPower(e) {
    const s = new h();
    s.writeByte(t.CommandCodes.SetTxPower), s.writeByte(e), await this.sendToRadioFrame(s.toBytes());
  }
  async sendCommandResetPath(e) {
    const s = new h();
    s.writeByte(t.CommandCodes.ResetPath), s.writeBytes(e), await this.sendToRadioFrame(s.toBytes());
  }
  async sendCommandSetAdvertLatLon(e, s) {
    const o = new h();
    o.writeByte(t.CommandCodes.SetAdvertLatLon), o.writeInt32LE(e), o.writeInt32LE(s), await this.sendToRadioFrame(o.toBytes());
  }
  async sendCommandRemoveContact(e) {
    const s = new h();
    s.writeByte(t.CommandCodes.RemoveContact), s.writeBytes(e), await this.sendToRadioFrame(s.toBytes());
  }
  async sendCommandShareContact(e) {
    const s = new h();
    s.writeByte(t.CommandCodes.ShareContact), s.writeBytes(e), await this.sendToRadioFrame(s.toBytes());
  }
  // provide a public key to export that contact
  // not providing a public key will export local identity as a contact instead
  async sendCommandExportContact(e = null) {
    const s = new h();
    s.writeByte(t.CommandCodes.ExportContact), e && s.writeBytes(e), await this.sendToRadioFrame(s.toBytes());
  }
  async sendCommandImportContact(e) {
    const s = new h();
    s.writeByte(t.CommandCodes.ImportContact), s.writeBytes(e), await this.sendToRadioFrame(s.toBytes());
  }
  async sendCommandReboot() {
    const e = new h();
    e.writeByte(t.CommandCodes.Reboot), e.writeString("reboot"), await this.sendToRadioFrame(e.toBytes());
  }
  async sendCommandGetBatteryVoltage() {
    const e = new h();
    e.writeByte(t.CommandCodes.GetBatteryVoltage), await this.sendToRadioFrame(e.toBytes());
  }
  async sendCommandDeviceQuery(e) {
    const s = new h();
    s.writeByte(t.CommandCodes.DeviceQuery), s.writeByte(e), await this.sendToRadioFrame(s.toBytes());
  }
  async sendCommandExportPrivateKey() {
    const e = new h();
    e.writeByte(t.CommandCodes.ExportPrivateKey), await this.sendToRadioFrame(e.toBytes());
  }
  async sendCommandImportPrivateKey(e) {
    const s = new h();
    s.writeByte(t.CommandCodes.ImportPrivateKey), s.writeBytes(e), await this.sendToRadioFrame(s.toBytes());
  }
  async sendCommandSendRawData(e, s) {
    const o = new h();
    o.writeByte(t.CommandCodes.SendRawData), o.writeByte(e.length), o.writeBytes(e), o.writeBytes(s), await this.sendToRadioFrame(o.toBytes());
  }
  async sendCommandSendLogin(e, s) {
    const o = new h();
    o.writeByte(t.CommandCodes.SendLogin), o.writeBytes(e), o.writeString(s), await this.sendToRadioFrame(o.toBytes());
  }
  async sendCommandSendStatusReq(e) {
    const s = new h();
    s.writeByte(t.CommandCodes.SendStatusReq), s.writeBytes(e), await this.sendToRadioFrame(s.toBytes());
  }
  async sendCommandSendTelemetryReq(e) {
    const s = new h();
    s.writeByte(t.CommandCodes.SendTelemetryReq), s.writeByte(0), s.writeByte(0), s.writeByte(0), s.writeBytes(e), await this.sendToRadioFrame(s.toBytes());
  }
  async sendCommandGetChannel(e) {
    const s = new h();
    s.writeByte(t.CommandCodes.GetChannel), s.writeByte(e), await this.sendToRadioFrame(s.toBytes());
  }
  async sendCommandSetChannel(e, s, o) {
    const n = new h();
    n.writeByte(t.CommandCodes.SetChannel), n.writeByte(e), n.writeCString(s, 32), n.writeBytes(o), await this.sendToRadioFrame(n.toBytes());
  }
  async sendCommandSendTracePath(e, s, o) {
    const n = new h();
    n.writeByte(t.CommandCodes.SendTracePath), n.writeUInt32LE(e), n.writeUInt32LE(s), n.writeByte(0), n.writeBytes(o), await this.sendToRadioFrame(n.toBytes());
  }
  async sendCommandSetOtherParams(e) {
    const s = new h();
    s.writeByte(t.CommandCodes.SetOtherParams), s.writeByte(e), await this.sendToRadioFrame(s.toBytes());
  }
  onFrameReceived(e) {
    this.emit("rx", e);
    const s = new l(e), o = s.readByte();
    o === t.ResponseCodes.Ok ? this.onOkResponse(s) : o === t.ResponseCodes.Err ? this.onErrResponse(s) : o === t.ResponseCodes.SelfInfo ? this.onSelfInfoResponse(s) : o === t.ResponseCodes.CurrTime ? this.onCurrTimeResponse(s) : o === t.ResponseCodes.NoMoreMessages ? this.onNoMoreMessagesResponse(s) : o === t.ResponseCodes.ContactMsgRecv ? this.onContactMsgRecvResponse(s) : o === t.ResponseCodes.ChannelMsgRecv ? this.onChannelMsgRecvResponse(s) : o === t.ResponseCodes.ContactsStart ? this.onContactsStartResponse(s) : o === t.ResponseCodes.Contact ? this.onContactResponse(s) : o === t.ResponseCodes.EndOfContacts ? this.onEndOfContactsResponse(s) : o === t.ResponseCodes.Sent ? this.onSentResponse(s) : o === t.ResponseCodes.ExportContact ? this.onExportContactResponse(s) : o === t.ResponseCodes.BatteryVoltage ? this.onBatteryVoltageResponse(s) : o === t.ResponseCodes.DeviceInfo ? this.onDeviceInfoResponse(s) : o === t.ResponseCodes.PrivateKey ? this.onPrivateKeyResponse(s) : o === t.ResponseCodes.Disabled ? this.onDisabledResponse(s) : o === t.ResponseCodes.ChannelInfo ? this.onChannelInfoResponse(s) : o === t.PushCodes.Advert ? this.onAdvertPush(s) : o === t.PushCodes.PathUpdated ? this.onPathUpdatedPush(s) : o === t.PushCodes.SendConfirmed ? this.onSendConfirmedPush(s) : o === t.PushCodes.MsgWaiting ? this.onMsgWaitingPush(s) : o === t.PushCodes.RawData ? this.onRawDataPush(s) : o === t.PushCodes.LoginSuccess ? this.onLoginSuccessPush(s) : o === t.PushCodes.StatusResponse ? this.onStatusResponsePush(s) : o === t.PushCodes.LogRxData ? this.onLogRxDataPush(s) : o === t.PushCodes.TelemetryResponse ? this.onTelemetryResponsePush(s) : o === t.PushCodes.TraceData ? this.onTraceDataPush(s) : o === t.PushCodes.NewAdvert ? this.onNewAdvertPush(s) : console.log(`unhandled frame: code=${o}`, e);
  }
  onAdvertPush(e) {
    this.emit(t.PushCodes.Advert, {
      publicKey: e.readBytes(32)
    });
  }
  onPathUpdatedPush(e) {
    this.emit(t.PushCodes.PathUpdated, {
      publicKey: e.readBytes(32)
    });
  }
  onSendConfirmedPush(e) {
    this.emit(t.PushCodes.SendConfirmed, {
      ackCode: e.readUInt32LE(),
      roundTrip: e.readUInt32LE()
    });
  }
  onMsgWaitingPush(e) {
    this.emit(t.PushCodes.MsgWaiting, {});
  }
  onRawDataPush(e) {
    this.emit(t.PushCodes.RawData, {
      lastSnr: e.readInt8() / 4,
      lastRssi: e.readInt8(),
      reserved: e.readByte(),
      payload: e.readRemainingBytes()
    });
  }
  onLoginSuccessPush(e) {
    this.emit(t.PushCodes.LoginSuccess, {
      reserved: e.readByte(),
      // reserved
      pubKeyPrefix: e.readBytes(6)
      // 6 bytes of public key this login success is from
    });
  }
  onStatusResponsePush(e) {
    this.emit(t.PushCodes.StatusResponse, {
      reserved: e.readByte(),
      // reserved
      pubKeyPrefix: e.readBytes(6),
      // 6 bytes of public key this status response is from
      statusData: e.readRemainingBytes()
    });
  }
  onLogRxDataPush(e) {
    this.emit(t.PushCodes.LogRxData, {
      lastSnr: e.readInt8() / 4,
      lastRssi: e.readInt8(),
      raw: e.readRemainingBytes()
    });
  }
  onTelemetryResponsePush(e) {
    this.emit(t.PushCodes.TelemetryResponse, {
      reserved: e.readByte(),
      // reserved
      pubKeyPrefix: e.readBytes(6),
      // 6 bytes of public key this telemetry response is from
      lppSensorData: e.readRemainingBytes()
    });
  }
  onTraceDataPush(e) {
    const s = e.readByte(), o = e.readUInt8();
    this.emit(t.PushCodes.TraceData, {
      reserved: s,
      pathLen: o,
      flags: e.readUInt8(),
      tag: e.readUInt32LE(),
      authCode: e.readUInt32LE(),
      pathHashes: e.readBytes(o),
      pathSnrs: e.readBytes(o),
      lastSnr: e.readInt8() / 4
    });
  }
  onNewAdvertPush(e) {
    this.emit(t.PushCodes.NewAdvert, {
      publicKey: e.readBytes(32),
      type: e.readByte(),
      flags: e.readByte(),
      outPathLen: e.readInt8(),
      outPath: e.readBytes(64),
      advName: e.readCString(32),
      lastAdvert: e.readUInt32LE(),
      advLat: e.readUInt32LE(),
      advLon: e.readUInt32LE(),
      lastMod: e.readUInt32LE()
    });
  }
  onOkResponse(e) {
    this.emit(t.ResponseCodes.Ok, {});
  }
  onErrResponse(e) {
    this.emit(t.ResponseCodes.Err, {});
  }
  onContactsStartResponse(e) {
    this.emit(t.ResponseCodes.ContactsStart, {
      count: e.readUInt32LE()
    });
  }
  onContactResponse(e) {
    this.emit(t.ResponseCodes.Contact, {
      publicKey: e.readBytes(32),
      type: e.readByte(),
      flags: e.readByte(),
      outPathLen: e.readInt8(),
      outPath: e.readBytes(64),
      advName: e.readCString(32),
      lastAdvert: e.readUInt32LE(),
      advLat: e.readUInt32LE(),
      advLon: e.readUInt32LE(),
      lastMod: e.readUInt32LE()
    });
  }
  onEndOfContactsResponse(e) {
    this.emit(t.ResponseCodes.EndOfContacts, {
      mostRecentLastmod: e.readUInt32LE()
    });
  }
  onSentResponse(e) {
    this.emit(t.ResponseCodes.Sent, {
      result: e.readInt8(),
      expectedAckCrc: e.readUInt32LE(),
      estTimeout: e.readUInt32LE()
    });
  }
  onExportContactResponse(e) {
    this.emit(t.ResponseCodes.ExportContact, {
      advertPacketBytes: e.readRemainingBytes()
    });
  }
  onBatteryVoltageResponse(e) {
    this.emit(t.ResponseCodes.BatteryVoltage, {
      batteryMilliVolts: e.readUInt16LE()
    });
  }
  onDeviceInfoResponse(e) {
    this.emit(t.ResponseCodes.DeviceInfo, {
      firmwareVer: e.readInt8(),
      reserved: e.readBytes(6),
      // reserved
      firmware_build_date: e.readCString(12),
      // eg. "19 Feb 2025"
      manufacturerModel: e.readString()
      // remainder of frame
    });
  }
  onPrivateKeyResponse(e) {
    this.emit(t.ResponseCodes.PrivateKey, {
      privateKey: e.readBytes(64)
    });
  }
  onDisabledResponse(e) {
    this.emit(t.ResponseCodes.Disabled, {});
  }
  onChannelInfoResponse(e) {
    const s = e.readUInt8(), o = e.readCString(32), n = e.getRemainingBytesCount();
    n === 16 ? this.emit(t.ResponseCodes.ChannelInfo, {
      channelIdx: s,
      name: o,
      secret: e.readBytes(n)
    }) : console.log(`ChannelInfo has unexpected key length: ${n}`);
  }
  onSelfInfoResponse(e) {
    this.emit(t.ResponseCodes.SelfInfo, {
      type: e.readByte(),
      txPower: e.readByte(),
      maxTxPower: e.readByte(),
      publicKey: e.readBytes(32),
      advLat: e.readInt32LE(),
      advLon: e.readInt32LE(),
      reserved: e.readBytes(3),
      manualAddContacts: e.readByte(),
      radioFreq: e.readUInt32LE(),
      radioBw: e.readUInt32LE(),
      radioSf: e.readByte(),
      radioCr: e.readByte(),
      name: e.readString()
    });
  }
  onCurrTimeResponse(e) {
    this.emit(t.ResponseCodes.CurrTime, {
      epochSecs: e.readUInt32LE()
    });
  }
  onNoMoreMessagesResponse(e) {
    this.emit(t.ResponseCodes.NoMoreMessages, {});
  }
  onContactMsgRecvResponse(e) {
    this.emit(t.ResponseCodes.ContactMsgRecv, {
      pubKeyPrefix: e.readBytes(6),
      pathLen: e.readByte(),
      txtType: e.readByte(),
      senderTimestamp: e.readUInt32LE(),
      text: e.readString()
    });
  }
  onChannelMsgRecvResponse(e) {
    this.emit(t.ResponseCodes.ChannelMsgRecv, {
      channelIdx: e.readInt8(),
      // reserved (0 for now, ie. 'public')
      pathLen: e.readByte(),
      // 0xFF if was sent direct, otherwise hop count for flood-mode
      txtType: e.readByte(),
      senderTimestamp: e.readUInt32LE(),
      text: e.readString()
    });
  }
  getSelfInfo(e = null) {
    return new Promise(async (s, o) => {
      this.once(t.ResponseCodes.SelfInfo, (n) => {
        s(n);
      }), e != null && setTimeout(o, e), await this.sendCommandAppStart();
    });
  }
  async sendAdvert(e) {
    return new Promise(async (s, o) => {
      try {
        const n = () => {
          this.off(t.ResponseCodes.Ok, n), this.off(t.ResponseCodes.Err, a), s();
        }, a = () => {
          this.off(t.ResponseCodes.Ok, n), this.off(t.ResponseCodes.Err, a), o();
        };
        this.once(t.ResponseCodes.Ok, n), this.once(t.ResponseCodes.Err, a), await this.sendCommandSendSelfAdvert(e);
      } catch (n) {
        o(n);
      }
    });
  }
  async sendFloodAdvert() {
    return await this.sendAdvert(t.SelfAdvertTypes.Flood);
  }
  async sendZeroHopAdvert() {
    return await this.sendAdvert(t.SelfAdvertTypes.ZeroHop);
  }
  setAdvertName(e) {
    return new Promise(async (s, o) => {
      try {
        const n = () => {
          this.off(t.ResponseCodes.Ok, n), this.off(t.ResponseCodes.Err, a), s();
        }, a = () => {
          this.off(t.ResponseCodes.Ok, n), this.off(t.ResponseCodes.Err, a), o();
        };
        this.once(t.ResponseCodes.Ok, n), this.once(t.ResponseCodes.Err, a), await this.sendCommandSetAdvertName(e);
      } catch (n) {
        o(n);
      }
    });
  }
  setAdvertLatLong(e, s) {
    return new Promise(async (o, n) => {
      try {
        const a = () => {
          this.off(t.ResponseCodes.Ok, a), this.off(t.ResponseCodes.Err, r), o();
        }, r = () => {
          this.off(t.ResponseCodes.Ok, a), this.off(t.ResponseCodes.Err, r), n();
        };
        this.once(t.ResponseCodes.Ok, a), this.once(t.ResponseCodes.Err, r), await this.sendCommandSetAdvertLatLon(e, s);
      } catch (a) {
        n(a);
      }
    });
  }
  setTxPower(e) {
    return new Promise(async (s, o) => {
      try {
        const n = () => {
          this.off(t.ResponseCodes.Ok, n), this.off(t.ResponseCodes.Err, a), s();
        }, a = () => {
          this.off(t.ResponseCodes.Ok, n), this.off(t.ResponseCodes.Err, a), o();
        };
        this.once(t.ResponseCodes.Ok, n), this.once(t.ResponseCodes.Err, a), await this.sendCommandSetTxPower(e);
      } catch (n) {
        o(n);
      }
    });
  }
  setRadioParams(e, s, o, n) {
    return new Promise(async (a, r) => {
      try {
        const d = () => {
          this.off(t.ResponseCodes.Ok, d), this.off(t.ResponseCodes.Err, p), a();
        }, p = () => {
          this.off(t.ResponseCodes.Ok, d), this.off(t.ResponseCodes.Err, p), r();
        };
        this.once(t.ResponseCodes.Ok, d), this.once(t.ResponseCodes.Err, p), await this.sendCommandSetRadioParams(e, s, o, n);
      } catch (d) {
        r(d);
      }
    });
  }
  getContacts() {
    return new Promise(async (e, s) => {
      const o = [], n = (a) => {
        o.push(a);
      };
      this.on(t.ResponseCodes.Contact, n), this.once(t.ResponseCodes.EndOfContacts, () => {
        this.off(t.ResponseCodes.Contact, n), e(o);
      }), await this.sendCommandGetContacts();
    });
  }
  async findContactByName(e) {
    return (await this.getContacts()).find((o) => o.advName === e);
  }
  async findContactByPublicKeyPrefix(e) {
    return (await this.getContacts()).find((o) => {
      const n = o.publicKey.subarray(0, e.length);
      return w.areBuffersEqual(e, n);
    });
  }
  sendTextMessage(e, s, o) {
    return new Promise(async (n, a) => {
      try {
        const r = (C) => {
          this.off(t.ResponseCodes.Sent, r), this.off(t.ResponseCodes.Err, d), n(C);
        }, d = () => {
          this.off(t.ResponseCodes.Sent, r), this.off(t.ResponseCodes.Err, d), a();
        };
        this.once(t.ResponseCodes.Sent, r), this.once(t.ResponseCodes.Err, d);
        const p = o ?? t.TxtTypes.Plain, m = 0, c = Math.floor(Date.now() / 1e3);
        await this.sendCommandSendTxtMsg(p, m, c, e, s);
      } catch (r) {
        a(r);
      }
    });
  }
  sendChannelTextMessage(e, s) {
    return new Promise(async (o, n) => {
      try {
        const a = () => {
          this.off(t.ResponseCodes.Ok, a), this.off(t.ResponseCodes.Err, r), o();
        }, r = () => {
          this.off(t.ResponseCodes.Ok, a), this.off(t.ResponseCodes.Err, r), n();
        };
        this.once(t.ResponseCodes.Ok, a), this.once(t.ResponseCodes.Err, r);
        const d = t.TxtTypes.Plain, p = Math.floor(Date.now() / 1e3);
        await this.sendCommandSendChannelTxtMsg(d, e, p, s);
      } catch (a) {
        n(a);
      }
    });
  }
  syncNextMessage() {
    return new Promise(async (e, s) => {
      const o = (r) => {
        this.off(t.ResponseCodes.ContactMsgRecv, o), this.off(t.ResponseCodes.ChannelMsgRecv, n), this.off(t.ResponseCodes.NoMoreMessages, a), e({
          contactMessage: r
        });
      }, n = (r) => {
        this.off(t.ResponseCodes.ContactMsgRecv, o), this.off(t.ResponseCodes.ChannelMsgRecv, n), this.off(t.ResponseCodes.NoMoreMessages, a), e({
          channelMessage: r
        });
      }, a = () => {
        this.off(t.ResponseCodes.ContactMsgRecv, o), this.off(t.ResponseCodes.ChannelMsgRecv, n), this.off(t.ResponseCodes.NoMoreMessages, a), e(null);
      };
      this.once(t.ResponseCodes.ContactMsgRecv, o), this.once(t.ResponseCodes.ChannelMsgRecv, n), this.once(t.ResponseCodes.NoMoreMessages, a), await this.sendCommandSyncNextMessage();
    });
  }
  async getWaitingMessages() {
    const e = [];
    for (; ; ) {
      const s = await this.syncNextMessage();
      if (!s)
        break;
      e.push(s);
    }
    return e;
  }
  getDeviceTime() {
    return new Promise(async (e, s) => {
      try {
        const o = (a) => {
          this.off(t.ResponseCodes.CurrTime, o), this.off(t.ResponseCodes.Err, n), e(a);
        }, n = () => {
          this.off(t.ResponseCodes.CurrTime, o), this.off(t.ResponseCodes.Err, n), s();
        };
        this.once(t.ResponseCodes.CurrTime, o), this.once(t.ResponseCodes.Err, n), await this.sendCommandGetDeviceTime();
      } catch (o) {
        s(o);
      }
    });
  }
  setDeviceTime(e) {
    return new Promise(async (s, o) => {
      try {
        const n = (r) => {
          this.off(t.ResponseCodes.Ok, n), this.off(t.ResponseCodes.Err, a), s(r);
        }, a = () => {
          this.off(t.ResponseCodes.Ok, n), this.off(t.ResponseCodes.Err, a), o();
        };
        this.once(t.ResponseCodes.Ok, n), this.once(t.ResponseCodes.Err, a), await this.sendCommandSetDeviceTime(e);
      } catch (n) {
        o(n);
      }
    });
  }
  async syncDeviceTime() {
    await this.setDeviceTime(Math.floor(Date.now() / 1e3));
  }
  importContact(e) {
    return new Promise(async (s, o) => {
      try {
        const n = (r) => {
          this.off(t.ResponseCodes.Ok, n), this.off(t.ResponseCodes.Err, a), s(r);
        }, a = () => {
          this.off(t.ResponseCodes.Ok, n), this.off(t.ResponseCodes.Err, a), o();
        };
        this.once(t.ResponseCodes.Ok, n), this.once(t.ResponseCodes.Err, a), await this.sendCommandImportContact(e);
      } catch (n) {
        o(n);
      }
    });
  }
  exportContact(e = null) {
    return new Promise(async (s, o) => {
      try {
        const n = (r) => {
          this.off(t.ResponseCodes.ExportContact, n), this.off(t.ResponseCodes.Err, a), s(r);
        }, a = () => {
          this.off(t.ResponseCodes.ExportContact, n), this.off(t.ResponseCodes.Err, a), o();
        };
        this.once(t.ResponseCodes.ExportContact, n), this.once(t.ResponseCodes.Err, a), await this.sendCommandExportContact(e);
      } catch (n) {
        o(n);
      }
    });
  }
  shareContact(e) {
    return new Promise(async (s, o) => {
      try {
        const n = (r) => {
          this.off(t.ResponseCodes.Ok, n), this.off(t.ResponseCodes.Err, a), s(r);
        }, a = () => {
          this.off(t.ResponseCodes.Ok, n), this.off(t.ResponseCodes.Err, a), o();
        };
        this.once(t.ResponseCodes.Ok, n), this.once(t.ResponseCodes.Err, a), await this.sendCommandShareContact(e);
      } catch (n) {
        o(n);
      }
    });
  }
  removeContact(e) {
    return new Promise(async (s, o) => {
      try {
        const n = () => {
          this.off(t.ResponseCodes.Ok, n), this.off(t.ResponseCodes.Err, a), s();
        }, a = () => {
          this.off(t.ResponseCodes.Ok, n), this.off(t.ResponseCodes.Err, a), o();
        };
        this.once(t.ResponseCodes.Ok, n), this.once(t.ResponseCodes.Err, a), await this.sendCommandRemoveContact(e);
      } catch (n) {
        o(n);
      }
    });
  }
  addOrUpdateContact(e, s, o, n, a, r, d, p, m) {
    return new Promise(async (c, C) => {
      try {
        const R = () => {
          this.off(t.ResponseCodes.Ok, R), this.off(t.ResponseCodes.Err, u), c();
        }, u = () => {
          this.off(t.ResponseCodes.Ok, R), this.off(t.ResponseCodes.Err, u), C();
        };
        this.once(t.ResponseCodes.Ok, R), this.once(t.ResponseCodes.Err, u), await this.sendCommandAddUpdateContact(e, s, o, n, a, r, d, p, m);
      } catch (R) {
        C(R);
      }
    });
  }
  setContactPath(e, s) {
    return new Promise(async (o, n) => {
      try {
        const d = new Uint8Array(64);
        for (var a = 0; a < s.length && a < 64; a++)
          d[a] = s[a];
        return e.outPathLen = s.length, e.outPath = d, await this.addOrUpdateContact(e.publicKey, e.type, e.flags, e.outPathLen, e.outPath, e.advName, e.lastAdvert, e.advLat, e.advLon);
      } catch (r) {
        n(r);
      }
    });
  }
  resetPath(e) {
    return new Promise(async (s, o) => {
      try {
        const n = () => {
          this.off(t.ResponseCodes.Ok, n), this.off(t.ResponseCodes.Err, a), s();
        }, a = () => {
          this.off(t.ResponseCodes.Ok, n), this.off(t.ResponseCodes.Err, a), o();
        };
        this.once(t.ResponseCodes.Ok, n), this.once(t.ResponseCodes.Err, a), await this.sendCommandResetPath(e);
      } catch (n) {
        o(n);
      }
    });
  }
  reboot() {
    return new Promise(async (e, s) => {
      try {
        const o = () => {
          this.off(t.ResponseCodes.Err, o), s();
        };
        setTimeout(() => {
          this.off(t.ResponseCodes.Err, o), e();
        }, 1e3), this.once(t.ResponseCodes.Err, o), await this.sendCommandReboot();
      } catch (o) {
        s(o);
      }
    });
  }
  getBatteryVoltage() {
    return new Promise(async (e, s) => {
      try {
        const o = (a) => {
          this.off(t.ResponseCodes.BatteryVoltage, o), this.off(t.ResponseCodes.Err, n), e(a);
        }, n = () => {
          this.off(t.ResponseCodes.BatteryVoltage, o), this.off(t.ResponseCodes.Err, n), s();
        };
        this.once(t.ResponseCodes.BatteryVoltage, o), this.once(t.ResponseCodes.Err, n), await this.sendCommandGetBatteryVoltage();
      } catch (o) {
        s(o);
      }
    });
  }
  deviceQuery(e) {
    return new Promise(async (s, o) => {
      try {
        const n = (r) => {
          this.off(t.ResponseCodes.DeviceInfo, n), this.off(t.ResponseCodes.Err, a), s(r);
        }, a = () => {
          this.off(t.ResponseCodes.DeviceInfo, n), this.off(t.ResponseCodes.Err, a), o();
        };
        this.once(t.ResponseCodes.DeviceInfo, n), this.once(t.ResponseCodes.Err, a), await this.sendCommandDeviceQuery(e);
      } catch (n) {
        o(n);
      }
    });
  }
  exportPrivateKey() {
    return new Promise(async (e, s) => {
      try {
        const o = (r) => {
          this.off(t.ResponseCodes.PrivateKey, o), this.off(t.ResponseCodes.Err, n), this.off(t.ResponseCodes.Disabled, a), e(r);
        }, n = () => {
          this.off(t.ResponseCodes.PrivateKey, o), this.off(t.ResponseCodes.Err, n), this.off(t.ResponseCodes.Disabled, a), s();
        }, a = () => {
          this.off(t.ResponseCodes.PrivateKey, o), this.off(t.ResponseCodes.Err, n), this.off(t.ResponseCodes.Disabled, a), s("disabled");
        };
        this.once(t.ResponseCodes.PrivateKey, o), this.once(t.ResponseCodes.Err, n), this.once(t.ResponseCodes.Disabled, a), await this.sendCommandExportPrivateKey();
      } catch (o) {
        s(o);
      }
    });
  }
  importPrivateKey(e) {
    return new Promise(async (s, o) => {
      try {
        const n = (d) => {
          this.off(t.ResponseCodes.Ok, n), this.off(t.ResponseCodes.Err, a), this.off(t.ResponseCodes.Disabled, r), s(d);
        }, a = () => {
          this.off(t.ResponseCodes.Ok, n), this.off(t.ResponseCodes.Err, a), this.off(t.ResponseCodes.Disabled, r), o();
        }, r = () => {
          this.off(t.ResponseCodes.Ok, n), this.off(t.ResponseCodes.Err, a), this.off(t.ResponseCodes.Disabled, r), o("disabled");
        };
        this.once(t.ResponseCodes.Ok, n), this.once(t.ResponseCodes.Err, a), this.once(t.ResponseCodes.Disabled, r), await this.sendCommandImportPrivateKey(e);
      } catch (n) {
        o(n);
      }
    });
  }
  login(e, s, o = 1e3) {
    return new Promise(async (n, a) => {
      try {
        const d = e.subarray(0, 6);
        var r = null;
        const p = (C) => {
          this.once(t.ResponseCodes.Err, c);
          const R = C.estTimeout + o;
          r = setTimeout(() => {
            a("timeout");
          }, R);
        }, m = (C) => {
          if (!w.areBuffersEqual(d, C.pubKeyPrefix)) {
            console.log("onLoginSuccess is not for this login request, ignoring...");
            return;
          }
          clearTimeout(r), this.off(t.ResponseCodes.Err, c), this.off(t.ResponseCodes.Sent, p), this.off(t.PushCodes.LoginSuccess, m), n(C);
        }, c = () => {
          clearTimeout(r), this.off(t.ResponseCodes.Err, c), this.off(t.ResponseCodes.Sent, p), this.off(t.PushCodes.LoginSuccess, m), a();
        };
        this.once(t.ResponseCodes.Err, c), this.once(t.ResponseCodes.Sent, p), this.once(t.PushCodes.LoginSuccess, m), await this.sendCommandSendLogin(e, s);
      } catch (d) {
        a(d);
      }
    });
  }
  getStatus(e, s = 1e3) {
    return new Promise(async (o, n) => {
      try {
        const r = e.subarray(0, 6);
        var a = null;
        const d = (c) => {
          this.once(t.ResponseCodes.Err, m);
          const C = c.estTimeout + s;
          a = setTimeout(() => {
            n("timeout");
          }, C);
        }, p = (c) => {
          if (!w.areBuffersEqual(r, c.pubKeyPrefix)) {
            console.log("onStatusResponsePush is not for this status request, ignoring...");
            return;
          }
          clearTimeout(a), this.off(t.ResponseCodes.Err, m), this.off(t.ResponseCodes.Sent, d), this.off(t.PushCodes.StatusResponse, p);
          const C = new l(c.statusData), R = {
            batt_milli_volts: C.readUInt16LE(),
            // uint16_t batt_milli_volts;
            curr_tx_queue_len: C.readUInt16LE(),
            // uint16_t curr_tx_queue_len;
            curr_free_queue_len: C.readUInt16LE(),
            // uint16_t curr_free_queue_len;
            last_rssi: C.readInt16LE(),
            // int16_t  last_rssi;
            n_packets_recv: C.readUInt32LE(),
            // uint32_t n_packets_recv;
            n_packets_sent: C.readUInt32LE(),
            // uint32_t n_packets_sent;
            total_air_time_secs: C.readUInt32LE(),
            // uint32_t total_air_time_secs;
            total_up_time_secs: C.readUInt32LE(),
            // uint32_t total_up_time_secs;
            n_sent_flood: C.readUInt32LE(),
            // uint32_t n_sent_flood
            n_sent_direct: C.readUInt32LE(),
            // uint32_t n_sent_direct
            n_recv_flood: C.readUInt32LE(),
            // uint32_t n_recv_flood
            n_recv_direct: C.readUInt32LE(),
            // uint32_t n_recv_direct
            n_full_events: C.readUInt16LE(),
            // uint16_t n_full_events
            last_snr: C.readInt16LE(),
            // int16_t last_snr
            n_direct_dups: C.readUInt16LE(),
            // uint16_t n_direct_dups
            n_flood_dups: C.readUInt16LE()
            // uint16_t n_flood_dups
          };
          o(R);
        }, m = () => {
          clearTimeout(a), this.off(t.ResponseCodes.Err, m), this.off(t.ResponseCodes.Sent, d), this.off(t.PushCodes.StatusResponse, p), n();
        };
        this.once(t.ResponseCodes.Err, m), this.once(t.ResponseCodes.Sent, d), this.once(t.PushCodes.StatusResponse, p), await this.sendCommandSendStatusReq(e);
      } catch (r) {
        n(r);
      }
    });
  }
  getTelemetry(e, s = 1e3) {
    return new Promise(async (o, n) => {
      try {
        const r = e.subarray(0, 6);
        var a = null;
        const d = (c) => {
          this.once(t.ResponseCodes.Err, m);
          const C = c.estTimeout + s;
          a = setTimeout(() => {
            n("timeout");
          }, C);
        }, p = (c) => {
          if (!w.areBuffersEqual(r, c.pubKeyPrefix)) {
            console.log("onTelemetryResponsePush is not for this telemetry request, ignoring...");
            return;
          }
          clearTimeout(a), this.off(t.ResponseCodes.Err, m), this.off(t.ResponseCodes.Sent, d), this.off(t.PushCodes.TelemetryResponse, p), o(c);
        }, m = () => {
          clearTimeout(a), this.off(t.ResponseCodes.Err, m), this.off(t.ResponseCodes.Sent, d), this.off(t.PushCodes.TelemetryResponse, p), n();
        };
        this.once(t.ResponseCodes.Err, m), this.once(t.ResponseCodes.Sent, d), this.once(t.PushCodes.TelemetryResponse, p), await this.sendCommandSendTelemetryReq(e);
      } catch (r) {
        n(r);
      }
    });
  }
  pingRepeaterZeroHop(e, s) {
    return new Promise(async (o, n) => {
      try {
        const r = new h();
        r.writeUInt32LE(Date.now()), r.writeBytes([112, 105, 110, 103]), r.writeBytes(e.subarray(0, 2));
        const d = r.toBytes();
        var a = Date.now();
        const p = (c) => {
          const R = Date.now() - a, u = E.fromBytes(c.raw);
          u.payload_type === E.PAYLOAD_TYPE_RAW_CUSTOM && w.areBuffersEqual(u.payload, d) && (this.off(t.ResponseCodes.Err, m), this.off(t.PushCodes.LogRxData, p), o({
            rtt: R,
            snr: c.lastSnr,
            rssi: c.lastRssi
          }));
        }, m = () => {
          this.off(t.ResponseCodes.Err, m), this.off(t.PushCodes.LogRxData, p), n();
        };
        this.once(t.ResponseCodes.Err, m), this.on(t.PushCodes.LogRxData, p), s != null && setTimeout(() => {
          this.off(t.ResponseCodes.Err, m), this.off(t.PushCodes.LogRxData, p), n("timeout");
        }, s), await this.sendCommandSendRawData([
          // we set the repeater we want to ping as the path
          // it should repeat our packet, and we can listen for it
          e.subarray(0, 1)
        ], d);
      } catch (r) {
        n(r);
      }
    });
  }
  getChannel(e) {
    return new Promise(async (s, o) => {
      try {
        const n = (r) => {
          this.off(t.ResponseCodes.ChannelInfo, n), this.off(t.ResponseCodes.Err, a), s(r);
        }, a = () => {
          this.off(t.ResponseCodes.ChannelInfo, n), this.off(t.ResponseCodes.Err, a), o();
        };
        this.once(t.ResponseCodes.ChannelInfo, n), this.once(t.ResponseCodes.Err, a), await this.sendCommandGetChannel(e);
      } catch (n) {
        o(n);
      }
    });
  }
  setChannel(e, s, o) {
    return new Promise(async (n, a) => {
      try {
        const r = () => {
          this.off(t.ResponseCodes.Ok, r), this.off(t.ResponseCodes.Err, d), n();
        }, d = () => {
          this.off(t.ResponseCodes.Ok, r), this.off(t.ResponseCodes.Err, d), a();
        };
        this.once(t.ResponseCodes.Ok, r), this.once(t.ResponseCodes.Err, d), await this.sendCommandSetChannel(e, s, o);
      } catch (r) {
        a(r);
      }
    });
  }
  async deleteChannel(e) {
    return await this.setChannel(e, "", new Uint8Array(16));
  }
  getChannels() {
    return new Promise(async (e, s) => {
      var o = 0;
      const n = [];
      for (; ; ) {
        try {
          const a = await this.getChannel(o);
          n.push(a);
        } catch {
          break;
        }
        o++;
      }
      return e(n);
    });
  }
  async findChannelByName(e) {
    return (await this.getChannels()).find((o) => (console.log(o), o.name === e));
  }
  async findChannelBySecret(e) {
    return (await this.getChannels()).find((o) => w.areBuffersEqual(e, o.secret));
  }
  tracePath(e) {
    return new Promise(async (s, o) => {
      try {
        const n = A.getRandomInt(0, 4294967295), a = (d) => {
          if (d.tag !== n) {
            console.log("ignoring trace data for a different trace request");
            return;
          }
          this.off(t.PushCodes.TraceData, a), this.off(t.ResponseCodes.Err, r), s(d);
        }, r = () => {
          this.off(t.PushCodes.TraceData, a), this.off(t.ResponseCodes.Err, r), o();
        };
        this.on(t.PushCodes.TraceData, a), this.once(t.ResponseCodes.Err, r), await this.sendCommandSendTracePath(n, 0, e);
      } catch (n) {
        o(n);
      }
    });
  }
  setOtherParams(e) {
    return new Promise(async (s, o) => {
      try {
        const n = () => {
          this.off(t.ResponseCodes.Ok, n), this.off(t.ResponseCodes.Err, a), s();
        }, a = () => {
          this.off(t.ResponseCodes.Ok, n), this.off(t.ResponseCodes.Err, a), o();
        };
        this.once(t.ResponseCodes.Ok, n), this.once(t.ResponseCodes.Err, a), await this.sendCommandSetOtherParams(e);
      } catch (n) {
        o(n);
      }
    });
  }
  async setAutoAddContacts() {
    return await this.setOtherParams(!1);
  }
  async setManualAddContacts() {
    return await this.setOtherParams(!0);
  }
}
class g extends T {
  constructor(e) {
    super(), this.bleDevice = e, this.gattServer = null, this.rxCharacteristic = null, this.txCharacteristic = null, this.init();
  }
  static async open() {
    if (!navigator.bluetooth) {
      alert("Web Bluetooth is not supported in this browser");
      return;
    }
    const e = await navigator.bluetooth.requestDevice({
      filters: [
        {
          services: [
            t.Ble.ServiceUuid.toLowerCase()
          ]
        }
      ]
    });
    return e ? new g(e) : null;
  }
  async init() {
    this.bleDevice.addEventListener("gattserverdisconnected", () => {
      this.onDisconnected();
    }), this.gattServer = await this.bleDevice.gatt.connect();
    const s = await (await this.gattServer.getPrimaryService(t.Ble.ServiceUuid.toLowerCase())).getCharacteristics();
    this.rxCharacteristic = s.find((o) => o.uuid.toLowerCase() === t.Ble.CharacteristicUuidRx.toLowerCase()), this.txCharacteristic = s.find((o) => o.uuid.toLowerCase() === t.Ble.CharacteristicUuidTx.toLowerCase()), await this.txCharacteristic.startNotifications(), this.txCharacteristic.addEventListener("characteristicvaluechanged", (o) => {
      const n = new Uint8Array(o.target.value.buffer);
      this.onFrameReceived(n);
    }), await this.onConnected();
  }
  async close() {
    var e;
    try {
      (e = this.gattServer) == null || e.disconnect(), this.gattServer = null;
    } catch {
    }
  }
  async write(e) {
    try {
      await this.rxCharacteristic.writeValue(e);
    } catch (s) {
      console.log("failed to write to ble device", s);
    }
  }
  async sendToRadioFrame(e) {
    this.emit("tx", e), await this.write(e);
  }
}
class P extends T {
  constructor() {
    if (super(), this.readBuffer = [], this.constructor === P)
      throw new Error("SerialConnection is an abstract class and can't be instantiated.");
  }
  async write(e) {
    throw new Error("Not Implemented: write must be implemented by SerialConnection sub class.");
  }
  async writeFrame(e, s) {
    const o = new h();
    o.writeByte(e), o.writeUInt16LE(s.length), o.writeBytes(s), await this.write(o.toBytes());
  }
  async sendToRadioFrame(e) {
    this.emit("tx", e), await this.writeFrame(60, e);
  }
  async onDataReceived(e) {
    this.readBuffer = [
      ...this.readBuffer,
      ...e
    ];
    const s = 3;
    for (; this.readBuffer.length >= s; )
      try {
        const o = new l(this.readBuffer.slice(0, s)), n = o.readByte();
        if (n !== t.SerialFrameTypes.Incoming && n !== t.SerialFrameTypes.Outgoing) {
          this.readBuffer = this.readBuffer.slice(1);
          continue;
        }
        const a = o.readUInt16LE();
        if (!a) {
          this.readBuffer = this.readBuffer.slice(1);
          continue;
        }
        const r = s + a;
        if (this.readBuffer.length < r)
          break;
        const d = this.readBuffer.slice(s, r);
        this.readBuffer = this.readBuffer.slice(r), this.onFrameReceived(d);
      } catch (o) {
        console.error("Failed to process frame", o);
        break;
      }
  }
}
class B extends P {
  constructor(e) {
    super(), this.serialPort = e, this.reader = e.readable.getReader(), this.writable = e.writable, this.readLoop(), this.serialPort.addEventListener("disconnect", () => {
      this.onDisconnected();
    }), setTimeout(async () => {
      await this.onConnected();
    }, 0);
  }
  static async open() {
    if (!navigator.serial)
      return alert("Web Serial is not supported in this browser"), null;
    const e = await navigator.serial.requestPort({
      filters: []
    });
    return await e.open({
      baudRate: 115200
    }), new B(e);
  }
  async close() {
    try {
      this.reader.releaseLock();
    } catch {
    }
    try {
      await this.serialPort.close();
    } catch {
    }
  }
  /* override */
  async write(e) {
    const s = this.writable.getWriter();
    try {
      await s.write(new Uint8Array(e));
    } finally {
      s.releaseLock();
    }
  }
  async readLoop() {
    try {
      for (; ; ) {
        const { value: e, done: s } = await this.reader.read();
        if (s)
          break;
        await this.onDataReceived(e);
      }
    } catch (e) {
      if (e instanceof TypeError)
        return;
      console.error("Error reading from serial port: ", e);
    } finally {
      this.reader.releaseLock();
    }
  }
}
export {
  g as WebBleConnection,
  B as WebSerialConnection
};
