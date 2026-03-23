import type { UIMessage } from 'ai'

export type MessageRole = UIMessage['role']

export interface Message extends UIMessage {}
