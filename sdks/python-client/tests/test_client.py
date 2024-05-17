import os
import unittest

from dify_client.client import ChatClient, CompletionClient, DifyClient

API_KEY = os.environ.get("API_KEY")
APP_ID = os.environ.get("APP_ID")


class TestChatClient(unittest.TestCase):
    def setUp(self):
        """        Set up the chat client with the provided API key.

        Args:
            API_KEY (str): The API key for the chat client.
        """

        self.chat_client = ChatClient(API_KEY)

    def test_create_chat_message(self):
        """        Test the creation of a chat message.

        This function tests the creation of a chat message by sending a request to the chat client with the provided message
        and user information.

        Args:
            self: The test case instance.


        Raises:
            AssertionError: If the response does not contain the expected "answer" attribute.
        """

        response = self.chat_client.create_chat_message({}, "Hello, World!", "test_user")
        self.assertIn("answer", response.text)

    def test_create_chat_message_with_vision_model_by_remote_url(self):
        """        Test creating a chat message using a vision model with an image from a remote URL.

        This function tests the creation of a chat message using a vision model to describe an image
        obtained from a remote URL.


        Raises:
            AssertionError: If the 'answer' key is not present in the response text.
        """

        files = [{
            "type": "image",
            "transfer_method": "remote_url",
            "url": "your_image_url"
        }]
        response = self.chat_client.create_chat_message({}, "Describe the picture.", "test_user", files=files)
        self.assertIn("answer", response.text)

    def test_create_chat_message_with_vision_model_by_local_file(self):
        """        Test creating a chat message using a vision model with a local file.

        This function tests the creation of a chat message using a vision model with a local file as input. It creates a chat message with the provided parameters and checks if the response contains the 'answer' key.

        Args:
            self: The object instance.


        Raises:
            AssertionError: If the response does not contain the 'answer' key.
        """

        files = [{
            "type": "image",
            "transfer_method": "local_file",
            "upload_file_id": "your_file_id"
        }]
        response = self.chat_client.create_chat_message({}, "Describe the picture.", "test_user", files=files)
        self.assertIn("answer", response.text)

    def test_get_conversation_messages(self):
        """        Test the function to get conversation messages.

        This function tests the functionality of the get_conversation_messages method by making a request to the chat client
        with a test user and conversation ID, and then asserts that the response contains the "answer" key.

        Args:
            self: The instance of the test case.


        Raises:
            AssertionError: If the response does not contain the "answer" key.
        """

        response = self.chat_client.get_conversation_messages("test_user", "your_conversation_id")
        self.assertIn("answer", response.text)

    def test_get_conversations(self):
        """        Test the get_conversations method of the chat client.

        This method tests the functionality of the get_conversations method by making a request to retrieve conversations
        for a specific user and then asserts that the response contains the 'data' attribute.

        Args:
            self: Instance of the test case.


        Raises:
            AssertionError: If the response does not contain the 'data' attribute.
        """

        response = self.chat_client.get_conversations("test_user")
        self.assertIn("data", response.text)


class TestCompletionClient(unittest.TestCase):
    def setUp(self):
        """        Set up the completion client with the provided API key.

        This method initializes the completion client with the given API key.

        Args:
            API_KEY (str): The API key for the completion client.
        """

        self.completion_client = CompletionClient(API_KEY)

    def test_create_completion_message(self):
        """        Test the creation of a completion message.

        This function tests the creation of a completion message by sending a query, specifying the type of message, and the user.

        Args:
            self: The object itself.


        Raises:
            AssertionError: If the 'answer' key is not present in the response text.
        """

        response = self.completion_client.create_completion_message({"query": "What's the weather like today?"},
                                                                    "blocking", "test_user")
        self.assertIn("answer", response.text)

    def test_create_completion_message_with_vision_model_by_remote_url(self):
        """        Test the creation of a completion message using a vision model with a remote URL.

        This function tests the creation of a completion message using a vision model with a remote URL by providing
        the necessary parameters and asserting the presence of the 'answer' key in the response text.


        Raises:
            AssertionError: If the 'answer' key is not present in the response text.
        """

        files = [{
            "type": "image",
            "transfer_method": "remote_url",
            "url": "your_image_url"
        }]
        response = self.completion_client.create_completion_message(
            {"query": "Describe the picture."}, "blocking", "test_user", files)
        self.assertIn("answer", response.text)

    def test_create_completion_message_with_vision_model_by_local_file(self):
        """        Test the creation of a completion message using a vision model with a local file.

        This function tests the creation of a completion message using a vision model with a local file
        by sending a query to describe the picture and checking if the response contains an answer.

        Args:
            self: The object itself.


        Raises:
            AssertionError: If the response does not contain an answer.
        """

        files = [{
            "type": "image",
            "transfer_method": "local_file",
            "upload_file_id": "your_file_id"
        }]
        response = self.completion_client.create_completion_message(
            {"query": "Describe the picture."}, "blocking", "test_user", files)
        self.assertIn("answer", response.text)


class TestDifyClient(unittest.TestCase):
    def setUp(self):
        """        Set up the DifyClient instance with the provided API key.

        This method initializes the DifyClient instance with the provided API key.

        Args:
            self: The object instance.
        """

        self.dify_client = DifyClient(API_KEY)

    def test_message_feedback(self):
        """        Test the message feedback functionality.

        This function tests the message feedback functionality by sending a 'like' feedback for a specific message to a test user.


        Raises:
            AssertionError: If the response does not contain the expected 'success' message.
        """

        response = self.dify_client.message_feedback("your_message_id", 'like', "test_user")
        self.assertIn("success", response.text)

    def test_get_application_parameters(self):
        """        Test the get_application_parameters method of the DifyClient class.

        This method tests the functionality of the get_application_parameters method by making a request to
        retrieve application parameters for a specific user and asserting that the response contains the "user_input_form" key.


        Raises:
            AssertionError: If the "user_input_form" key is not present in the response.
        """

        response = self.dify_client.get_application_parameters("test_user")
        self.assertIn("user_input_form", response.text)

    def test_file_upload(self):
        """        Test the file upload functionality.

        This function tests the file upload functionality by uploading a file to the server and checking for the response.

        Args:
            self: The object instance.


        Raises:
            AssertionError: If the response does not contain the expected "name" attribute.
        """

        file_path = "your_image_file_path"
        file_name = "panda.jpeg"
        mime_type = "image/jpeg"

        with open(file_path, "rb") as file:
            files = {
                "file": (file_name, file, mime_type)
            }
            response = self.dify_client.file_upload("test_user", files)
            self.assertIn("name", response.text)


if __name__ == "__main__":
    unittest.main()
