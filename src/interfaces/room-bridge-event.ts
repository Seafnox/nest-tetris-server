export interface RoomBridgeEvent {
    receiverId: string,
    initiatorId: string,
    eventName: string,
    data: object,
}
