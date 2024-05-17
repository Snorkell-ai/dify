// Types.d.ts
export const BASE_URL: string;

export type RequestMethods = 'GET' | 'POST' | 'PATCH' | 'DELETE';

interface Params {
  [key: string]: any;
}

interface HeaderParams {
  [key: string]: string;
}

interface User {
}

interface ChatMessageConfig {
  inputs: any;
  query: string;
  user: User;
  stream?: boolean;
  conversation_id?: string | null;
  files?: File[] | null;
}

export declare class DifyClient {
  constructor(apiKey: string, baseUrl?: string);

  /**
   * Updates the API key.
   * 
   * @param apiKey The new API key to be set.
   * @throws {Error} Throws an error if the API key update fails.
   */
  updateApiKey(apiKey: string): void;

  /**
   * Sends a request to the specified endpoint using the provided method and data.
   * 
   * @param method The request method (e.g. GET, POST, PUT, DELETE).
   * @param endpoint The endpoint URL to send the request to.
   * @param data Optional data to be sent with the request.
   * @param params Optional parameters to be included in the request URL.
   * @param stream Optional flag to indicate if the response should be streamed.
   * @param headerParams Optional header parameters to be included in the request.
   * @returns A Promise that resolves with the response data from the server.
   * @throws {Error} If the request fails or encounters an error.
   */
  sendRequest(
    method: RequestMethods,
    endpoint: string,
    data?: any,
    params?: Params,
    stream?: boolean,
    headerParams?: HeaderParams
  ): Promise<any>;  

  /**
   * Provides feedback for a message.
   * @param message_id The ID of the message to provide feedback for.
   * @param rating The rating given for the message.
   * @param user The user providing the feedback.
   * @returns A Promise that resolves to any value.
   * @throws Error if the message_id is invalid or if there is an issue providing feedback.
   */
  messageFeedback(message_id: string, rating: number, user: User): Promise<any>;

  /**
   * Retrieves application parameters for the specified user.
   * @param user The user for whom the application parameters are being retrieved.
   * @returns A Promise that resolves to an object containing the application parameters.
   * @throws {Error} If there is an error retrieving the application parameters.
   */
  getApplicationParameters(user: User): Promise<any>;

  /**
   * Uploads a file using the provided FormData.
   * 
   * @param data - The FormData containing the file to be uploaded.
   * @returns A Promise that resolves with the result of the file upload.
   * @throws Error if the file upload fails for any reason.
   */
  fileUpload(data: FormData): Promise<any>;
}

export declare class CompletionClient extends DifyClient {
  /**
   * Creates a completion message.
   * 
   * @param inputs - The inputs for the completion message.
   * @param user - The user for whom the completion message is created.
   * @param stream - Optional parameter to indicate if the message should be streamed.
   * @param files - Optional parameter for any files associated with the completion message.
   * @returns A promise that resolves to any value.
   * @throws Error if there is an issue creating the completion message.
   */
  createCompletionMessage(
    inputs: any,
    user: User,
    stream?: boolean,
    files?: File[] | null
  ): Promise<any>;
}

export declare class ChatClient extends DifyClient {
  /**
   * Creates a chat message using the provided configuration.
   * 
   * @param config The configuration object for the chat message.
   * @returns A Promise that resolves to any value upon successful creation of the chat message.
   * @throws {Error} If there is an error during the creation of the chat message.
   */
  createChatMessage(config: ChatMessageConfig): Promise<any>;

  /**
   * Retrieves conversation messages for a user.
   * 
   * @param user The user for whom to retrieve the conversation messages.
   * @param conversation_id Optional. The ID of the conversation for which to retrieve messages.
   * @param first_id Optional. The ID of the first message in the conversation.
   * @param limit Optional. The maximum number of messages to retrieve.
   * @returns A Promise that resolves with the retrieved conversation messages.
   * @throws Error if the retrieval of conversation messages fails.
   */
  getConversationMessages(
    user: User,
    conversation_id?: string,
    first_id?: string | null,
    limit?: number | null
  ): Promise<any>;

  /**
   * Retrieves conversations for a user.
   * 
   * @param user - The user for whom conversations are to be retrieved.
   * @param first_id - Optional. The ID of the first conversation.
   * @param limit - Optional. The maximum number of conversations to retrieve.
   * @param pinned - Optional. Indicates whether to retrieve pinned conversations.
   * @returns A promise that resolves with the retrieved conversations.
   * @throws Error if the retrieval fails.
   */
  getConversations(user: User, first_id?: string | null, limit?: number | null, pinned?: boolean | null): Promise<any>;

  /**
   * Renames a conversation.
   * @param conversation_id The ID of the conversation to be renamed.
   * @param name The new name for the conversation.
   * @param user The user initiating the rename action.
   * @returns A Promise that resolves to any value upon successful completion.
   * @throws Throws an error if the conversation renaming fails.
   */
  renameConversation(conversation_id: string, name: string, user: User): Promise<any>;

  /**
   * Deletes a conversation with the specified conversation ID for the given user.
   * @param conversation_id The ID of the conversation to be deleted.
   * @param user The user for whom the conversation is to be deleted.
   * @returns A Promise that resolves to any value upon successful deletion.
   * @throws {Error} If the deletion operation encounters an error.
   */
  deleteConversation(conversation_id: string, user: User): Promise<any>;
}