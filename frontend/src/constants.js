const serverAddress = 'http://localhost:5001'

export const ApiCreateUser = `${serverAddress}/api/create-user`
export const ApiFindSpace = `${serverAddress}/api/find-space`
export const ApiFindSpacesByUserId = `${serverAddress}/api/find-spaces-by-userid`
export const ApiCreateSpace = `${serverAddress}/api/create-space`
export const ApiDeleteSpaceMember = `${serverAddress}/api/delete-space-member`
export const ApiJoinSpace = `${serverAddress}/api/join-space`

export const ApiFindChatsBySpaceAndUserId = `${serverAddress}/api/find-chats-by-space-and-userid`
export const ApiFindChatMembers = `${serverAddress}/api/find-chat-members`
export const ApiFindChatMembersAndNotmembers = `${serverAddress}/api/find-chat-members-and-notmembers`
export const ApiCreateChat = `${serverAddress}/api/create-chat`
export const ApiAddChatMember = `${serverAddress}/api/add-chat-member`
export const ApiGetInviteCode = `${serverAddress}/api/get-invite-code`
export const ApiChangeInviteCode = `${serverAddress}/api/change-invite-code`
export const ApiDeleteChatMember = `${serverAddress}/api/delete-chat-member`


export const ApiSendMessage = `${serverAddress}/api/send-message`
export const ApiLoadMessageChunk = `${serverAddress}/api/load-message-chunk`

export const ApiAddTask = `${serverAddress}/api/add-task`
export const ApiFindTasksBySpaceId = `${serverAddress}/api/find-tasks-by-spaceid`
export const ApiFindTasksBySpaceAndUserId = `${serverAddress}/api/find-tasks-by-space-and-userid`
export const ApiDeleteTask = `${serverAddress}/api/delete-task`
export const ApiEditTask = `${serverAddress}/api/edit-task`
export const ApiUpdateTaskCompletion = `${serverAddress}/api/update-task-completion`

export const ApiFindUserById = `${serverAddress}/api/find-user`

export const ChatUpdateTimeout = 1000  // in milliseconds
