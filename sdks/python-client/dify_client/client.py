import requests


class DifyClient:
    def __init__(self, api_key):
        """        Initialize the API client with the provided API key.

        Args:
            api_key (str): The API key to authenticate the client.
        """

        self.api_key = api_key
        self.base_url = "https://api.dify.ai/v1"

    def _send_request(self, method, endpoint, json=None, params=None, stream=False):
        """        Send a request to the specified endpoint using the provided method and parameters.

        Args:
            method (str): The HTTP method to be used for the request.
            endpoint (str): The endpoint to which the request will be sent.
            json (dict?): A JSON object to be sent in the body of the request. Defaults to None.
            params (dict?): Parameters to be sent with the request. Defaults to None.
            stream (bool?): Indicates if the response should be streamed. Defaults to False.

        Returns:
            requests.Response: The response object containing the result of the request.
        """

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        url = f"{self.base_url}{endpoint}"
        response = requests.request(method, url, json=json, params=params, headers=headers, stream=stream)

        return response

    def _send_request_with_files(self, method, endpoint, data, files):
        """        Send a request with files to the specified endpoint using the given HTTP method.

        This method constructs the necessary headers, forms the complete URL, and sends the request with the provided data and files.

        Args:
            method (str): The HTTP method for the request (e.g., 'GET', 'POST').
            endpoint (str): The endpoint to which the request will be sent.
            data (dict): The data to be sent with the request.
            files (dict): The files to be sent with the request.

        Returns:
            requests.Response: The response object containing the server's response to the request.
        """

        headers = {
            "Authorization": f"Bearer {self.api_key}"
        }

        url = f"{self.base_url}{endpoint}"
        response = requests.request(method, url, data=data, headers=headers, files=files)

        return response

    def message_feedback(self, message_id, rating, user):
        """        Send feedback for a specific message.

        This function sends feedback for a specific message by making a POST request to the server.

        Args:
            message_id (int): The ID of the message for which feedback is being provided.
            rating (int): The rating given to the message.
            user (str): The user providing the feedback.

        Returns:
            dict: The response data from the server.
        """

        data = {
            "rating": rating,
            "user": user
        }
        return self._send_request("POST", f"/messages/{message_id}/feedbacks", data)

    def get_application_parameters(self, user):
        """        Get application parameters for a specific user.

        This function sends a GET request to retrieve the application parameters for the specified user.

        Args:
            user (str): The user for whom the application parameters are being requested.

        Returns:
            dict: A dictionary containing the application parameters for the specified user.
        """

        params = {"user": user}
        return self._send_request("GET", "/parameters", params=params)

    def file_upload(self, user, files):
        """        Upload files for a specific user.

        This function sends a POST request to upload files for a specific user.

        Args:
            user (str): The user for whom the files are being uploaded.
            files (dict): A dictionary containing the files to be uploaded.

        Returns:
            dict: The response data from the file upload request.
        """

        data = {
            "user": user
        }
        return self._send_request_with_files("POST", "/files/upload", data=data, files=files)


class CompletionClient(DifyClient):
    def create_completion_message(self, inputs, response_mode, user, files=None):
        """        Create a completion message for a given user with specified inputs and response mode.

        This function creates a completion message for a given user with the provided inputs and response mode. It also allows for optional file attachments.

        Args:
            inputs (str): The input data for the completion message.
            response_mode (str): The mode of response for the completion message.
            user (str): The user for whom the completion message is being created.
            files (list?): A list of file attachments for the completion message.

        Returns:
            str: The completion message created for the user.
        """

        data = {
            "inputs": inputs,
            "response_mode": response_mode,
            "user": user,
            "files": files
        }
        return self._send_request("POST", "/completion-messages", data,
                                  stream=True if response_mode == "streaming" else False)


class ChatClient(DifyClient):
    def create_chat_message(self, inputs, query, user, response_mode="blocking", conversation_id=None, files=None):
        """        Create a chat message and send it to the server.

        This function creates a chat message using the provided inputs, query, user, response mode, conversation ID, and files.

        Args:
            inputs (str): The input message for the chat.
            query (str): The query for the chat message.
            user (str): The user sending the chat message.
            response_mode (str?): The mode for receiving the response. Defaults to "blocking".
            conversation_id (str?): The ID of the conversation. Defaults to None.
            files (list?): A list of files to be sent with the chat message. Defaults to None.

        Returns:
            dict: The response from the server.

        Raises:
            ValueError: If response_mode is not a valid mode.
        """

        data = {
            "inputs": inputs,
            "query": query,
            "user": user,
            "response_mode": response_mode,
            "files": files
        }
        if conversation_id:
            data["conversation_id"] = conversation_id

        return self._send_request("POST", "/chat-messages", data,
                                  stream=True if response_mode == "streaming" else False)

    def get_conversation_messages(self, user, conversation_id=None, first_id=None, limit=None):
        """        Get conversation messages for a user.

        This function retrieves messages for a specific user based on the provided parameters.

        Args:
            user (str): The user for whom the messages are being retrieved.
            conversation_id (str?): The ID of the conversation. Defaults to None.
            first_id (str?): The ID of the first message. Defaults to None.
            limit (int?): The maximum number of messages to retrieve. Defaults to None.

        Returns:
            dict: A dictionary containing the retrieved messages.
        """

        params = {"user": user}

        if conversation_id:
            params["conversation_id"] = conversation_id
        if first_id:
            params["first_id"] = first_id
        if limit:
            params["limit"] = limit

        return self._send_request("GET", "/messages", params=params)

    def get_conversations(self, user, last_id=None, limit=None, pinned=None):
        """        Get conversations for a specific user.

        This function sends a request to retrieve conversations for a specific user based on the provided parameters.

        Args:
            user (str): The user for whom the conversations are to be retrieved.
            last_id (int?): The last conversation ID to start the retrieval from. Defaults to None.
            limit (int?): The maximum number of conversations to retrieve. Defaults to None.
            pinned (bool?): Flag to indicate whether to retrieve pinned conversations. Defaults to None.

        Returns:
            dict: A dictionary containing the retrieved conversations.
        """

        params = {"user": user, "last_id": last_id, "limit": limit, "pinned": pinned}
        return self._send_request("GET", "/conversations", params=params)

    def rename_conversation(self, conversation_id, name, user):
        """        Rename a conversation with a new name and user.

        This function renames a conversation identified by the given conversation_id with the new name and user provided.

        Args:
            conversation_id (str): The unique identifier of the conversation.
            name (str): The new name for the conversation.
            user (str): The user initiating the rename action.

        Returns:
            dict: A dictionary containing the response data from the server.
        """

        data = {"name": name, "user": user}
        return self._send_request("POST", f"/conversations/{conversation_id}/name", data)
