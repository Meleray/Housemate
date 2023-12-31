import axios from "axios";

const router_auth = axios.create({
    withCredentials: true,
    baseURL: "http://localhost:5001/api/"
})

const router_noauth = axios.create({
    baseURL: "http://localhost:5001/api/"
})

export {router_auth, router_noauth};

export const ApiCreateUser = `create-user`

export const ApiFindSpace = `find-space`
export const ApiFindSpacesByUserId = `find-spaces-by-userid`
export const ApiCreateSpace = `create-space`
export const ApiDeleteSpaceMember = `delete-space-member`
export const ApiDeleteSpaceMemberSafe = `delete-space-member-safe`
export const ApiJoinSpace = `join-space`
export const ApiFindSpaceMembers = `find-space-members`

export const ApiFindChatsBySpaceAndUserId = `find-chats-by-space-and-userid`
export const ApiFindChatMembers = `find-chat-members`
export const ApiFindChatMembersAndNotmembers = `find-chat-members-and-notmembers`
export const ApiCreateChat = `create-chat`
export const ApiAddChatMember = `add-chat-member`
export const ApiGetInviteCode = `get-invite-code`
export const ApiChangeInviteCode = `change-invite-code`
export const ApiDeleteChatMember = `delete-chat-member`

export const ApiSendMessage = `send-message`
export const ApiLoadMessageChunk = `load-message-chunk`

export const ApiAddTask = `add-task`
export const ApiFindTasksBySpaceId = `find-tasks-by-spaceid`
export const ApiFindTasksBySpaceAndUserId = `find-tasks-by-space-and-userid`
export const ApiDeleteTask = `delete-task`
export const ApiEditTask = `edit-task`
export const ApiUpdateTaskCompletion = `update-task-completion`

export const ApiFindUserById = `find-user`

export const ApiBillTrackerMainInfo = `get-tracker-mainpage-info`
export const ApiAddBill = `add-bill`
export const ApiGetTransactions = `get-tranaction-list`
export const ApiConfirmTransaction = `confirm-payment`

export const ApiLogin = `/auth/login`
export const ApiLogout = `/auth/logout`

export const ChatUpdateTimeout = 1000  // in milliseconds
