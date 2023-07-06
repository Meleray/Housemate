const serverAddress = 'http://localhost:5001'
export const ApiFindSpace = `${serverAddress}/api/find-space`
export const ApiFindSpacesByUserId = `${serverAddress}/api/find-spaces-by-userid`
export const ApiCreateSpaceAndMember = `${serverAddress}/api/create-space-and-member`
export const ApiDeleteSpaceMember = `${serverAddress}/api/delete-space-member`
export const ApiJoinSpace = `${serverAddress}/api/join-space`

export const ApiFindChatsBySpaceAndUserId = `${serverAddress}/api/find-chats-by-space-and-userid`
export const ApiFindChatMembers = `${serverAddress}/api/find-chat-members`
export const ApiCreateChatAndMember = `${serverAddress}/api/create-chat-and-member`
export const ApiAddChatMember = `${serverAddress}/api/add-chat-member`
export const ApiGetInviteCode = `${serverAddress}/api/get-invite-code`
export const ApiChangeInviteCode = `${serverAddress}/api/change-invite-code`


export const ApiSendMessage = `${serverAddress}/api/send-message`
export const ApiLoadMessageChunk = `${serverAddress}/api/load-message-chunk`
