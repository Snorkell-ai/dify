import axios from "axios";
export const BASE_URL = "https://api.dify.ai/v1";

export const routes = {
  application: {
    method: "GET",
    url: () => `/parameters`,
  },
  feedback: {
    method: "POST",
    url: (message_id) => `/messages/${message_id}/feedbacks`,
  },
  createCompletionMessage: {
    method: "POST",
    url: () => `/completion-messages`,
  },
  createChatMessage: {
    method: "POST",
    url: () => `/chat-messages`,
  },
  getConversationMessages: {
    method: "GET",
    url: () => `/messages`,
  },
  getConversations: {
    method: "GET",
    url: () => `/conversations`,
  },
  renameConversation: {
    method: "POST",
    url: (conversation_id) => `/conversations/${conversation_id}/name`,
  },
  deleteConversation: {
    method: "DELETE",
    url: (conversation_id) => `/conversations/${conversation_id}`,
  },
  fileUpload: {
    method: "POST",
    url: () => `/files/upload`,
  },
  runWorkflow: {
    method: "POST",
    url: () => `/workflows/run`,
  },
};

export class DifyClient {
  constructor(apiKey, baseUrl = BASE_URL) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  /**
   * Updates the API key.
   * @param {string} apiKey - The new API key to be set.
   * @throws {Error} If apiKey is not provided.
   */
  updateApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   * Send a request to the specified endpoint using the provided method and data.
   * @param {string} method - The HTTP method for the request (e.g., 'GET', 'POST', 'PUT', 'DELETE').
   * @param {string} endpoint - The endpoint to which the request should be sent.
   * @param {Object|null} data - The data to be sent with the request (default is null).
   * @param {Object|null} params - The query parameters to be sent with the request (default is null).
   * @param {boolean} stream - Whether the response should be treated as a stream (default is false).
   * @param {Object} headerParams - Additional headers to be included in the request (default is an empty object).
   * @returns {Promise} - A promise that resolves with the response from the server.
   * @throws {Error} - If the request fails or encounters an error.
   */
  async sendRequest(
    method,
    endpoint,
    data = null,
    params = null,
    stream = false,
    headerParams = {}
  ) {
    const headers = {
      ...{
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      ...headerParams
    };

    const url = `${this.baseUrl}${endpoint}`;
    let response;
    if (stream) {
      response = await axios({
        method,
        url,
        data,
        params,
        headers,
        responseType: "stream",
      });
    } else {
      response = await axios({
        method,
        url,
        data,
        params,
        headers,
        responseType: "json",
      });
    }

    return response;
  }

  /**
   * Sends feedback message for a specific message.
   * @param {string} message_id - The ID of the message to provide feedback for.
   * @param {number} rating - The rating given for the message.
   * @param {string} user - The user providing the feedback.
   * @throws {Error} If there is an issue with sending the feedback request.
   */
  messageFeedback(message_id, rating, user) {
    const data = {
      rating,
      user,
    };
    return this.sendRequest(
      routes.feedback.method,
      routes.feedback.url(message_id),
      data
    );
  }

  /**
   * Retrieves application parameters for the specified user.
   * 
   * @param {string} user - The user for whom the application parameters are being retrieved.
   * @throws {Error} Throws an error if the request to retrieve application parameters fails.
   * @returns {Promise} A promise that resolves with the application parameters for the specified user.
   */
  getApplicationParameters(user) {
    const params = { user };
    return this.sendRequest(
      routes.application.method,
      routes.application.url(),
      null,
      params
    );
  }

  /**
   * Uploads a file.
   * 
   * @param {Object} data - The data to be uploaded.
   * @throws {Error} If the file upload fails.
   * @returns {Promise} A promise that resolves when the file is successfully uploaded.
   */
  fileUpload(data) {
    return this.sendRequest(
      routes.fileUpload.method,
      routes.fileUpload.url(),
      data,
      null,
      false,
      {
        "Content-Type": 'multipart/form-data'
      }
    );
  }
}

export class CompletionClient extends DifyClient {
  /**
   * Creates a completion message with the given inputs, user, and optional stream and files.
   * 
   * @param {Object} inputs - The inputs for the completion message.
   * @param {Object} user - The user for whom the completion message is created.
   * @param {boolean} [stream=false] - Indicates whether the response mode is streaming or blocking. Default is false.
   * @param {Array|null} [files=null] - Optional files to be included in the completion message.
   * @throws {Error} If there is an issue with sending the request.
   * @returns {Promise} A promise that resolves with the completion message data.
   */
  createCompletionMessage(inputs, user, stream = false, files = null) {
    const data = {
      inputs,
      user,
      response_mode: stream ? "streaming" : "blocking",
      files,
    };
    return this.sendRequest(
      routes.createCompletionMessage.method,
      routes.createCompletionMessage.url(),
      data,
      null,
      stream
    );
  }

  /**
   * Runs a workflow with the given inputs and user.
   * 
   * @param {Object} inputs - The inputs for the workflow.
   * @param {string} user - The user who is running the workflow.
   * @param {boolean} [stream=false] - Indicates whether the response should be streamed.
   * @param {Array} [files=null] - Additional files to be used in the workflow.
   * @throws {Error} If there is an issue with sending the request.
   */
  runWorkflow(inputs, user, stream = false, files = null) {
    const data = {
      inputs,
      user,
      response_mode: stream ? "streaming" : "blocking",
    };
    return this.sendRequest(
      routes.runWorkflow.method,
      routes.runWorkflow.url(),
      data,
      null,
      stream
    );
  }
}

export class ChatClient extends DifyClient {
  /**
   * Creates a chat message with the given inputs, query, user, and optional parameters.
   * @param {Object} inputs - The inputs for the chat message.
   * @param {Object} query - The query for the chat message.
   * @param {Object} user - The user sending the chat message.
   * @param {boolean} [stream=false] - Indicates if the response mode is streaming or blocking. Default is false.
   * @param {string} [conversation_id=null] - The conversation ID for the chat message. Default is null.
   * @param {Array} [files=null] - The files attached to the chat message. Default is null.
   * @throws {Error} If the sendRequest method fails to send the chat message.
   * @returns {Promise} A promise that resolves when the chat message is successfully sent.
   */
  createChatMessage(
    inputs,
    query,
    user,
    stream = false,
    conversation_id = null,
    files = null
  ) {
    const data = {
      inputs,
      query,
      user,
      response_mode: stream ? "streaming" : "blocking",
      files,
    };
    if (conversation_id) data.conversation_id = conversation_id;

    return this.sendRequest(
      routes.createChatMessage.method,
      routes.createChatMessage.url(),
      data,
      null,
      stream
    );
  }

  /**
   * Retrieves conversation messages for a user.
   * @param {string} user - The user for whom to retrieve the conversation messages.
   * @param {string} [conversation_id=""] - The ID of the conversation. Defaults to an empty string.
   * @param {string} [first_id=null] - The ID of the first message. Defaults to null.
   * @param {number} [limit=null] - The maximum number of messages to retrieve. Defaults to null.
   * @throws {Error} If there is an issue with sending the request.
   * @returns {Promise} A promise that resolves with the retrieved conversation messages.
   */
  getConversationMessages(
    user,
    conversation_id = "",
    first_id = null,
    limit = null
  ) {
    const params = { user };

    if (conversation_id) params.conversation_id = conversation_id;

    if (first_id) params.first_id = first_id;

    if (limit) params.limit = limit;

    return this.sendRequest(
      routes.getConversationMessages.method,
      routes.getConversationMessages.url(),
      null,
      params
    );
  }

  /**
   * Retrieves conversations for a user with optional parameters.
   * @param {string} user - The user for whom to retrieve conversations.
   * @param {string} [first_id=null] - The first ID to start retrieving conversations from.
   * @param {number} [limit=null] - The maximum number of conversations to retrieve.
   * @param {boolean} [pinned=null] - Indicates whether to retrieve pinned conversations.
   * @throws {Error} If the request to retrieve conversations fails.
   * @returns {Promise} A promise that resolves with the retrieved conversations.
   */
  getConversations(user, first_id = null, limit = null, pinned = null) {
    const params = { user, first_id: first_id, limit, pinned };
    return this.sendRequest(
      routes.getConversations.method,
      routes.getConversations.url(),
      null,
      params
    );
  }

  /**
   * Renames a conversation with the specified conversation ID.
   * 
   * @param {string} conversation_id - The ID of the conversation to be renamed.
   * @param {string} name - The new name for the conversation.
   * @param {string} user - The user initiating the rename action.
   * @param {boolean} auto_generate - Indicates whether to automatically generate a new name if the provided name is already in use.
   * @throws {Error} Throws an error if the request to rename the conversation fails.
   */
  renameConversation(conversation_id, name, user, auto_generate) {
    const data = { name, user, auto_generate };
    return this.sendRequest(
      routes.renameConversation.method,
      routes.renameConversation.url(conversation_id),
      data
    );
  }

  /**
   * Deletes a conversation with the specified conversation ID for the given user.
   * 
   * @param {string} conversation_id - The ID of the conversation to be deleted.
   * @param {string} user - The user performing the deletion.
   * @throws {Error} If there is an issue with sending the request.
   * @returns {Promise} A promise that resolves with the result of the deletion request.
   */
  deleteConversation(conversation_id, user) {
    const data = { user };
    return this.sendRequest(
      routes.deleteConversation.method,
      routes.deleteConversation.url(conversation_id),
      data
    );
  }
}