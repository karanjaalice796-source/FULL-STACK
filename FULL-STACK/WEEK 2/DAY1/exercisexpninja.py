#call history
class Phone:
    def __init__(self, phone_number):
        self.phone_number = phone_number
        self.call_history = []
        self.messages = []

    def call(self, other_phone):
        call_detail = f"{self.phone_number} called {other_phone.phone_number}"
        print(call_detail)
        self.call_history.append(call_detail)

    def show_call_history(self):
        print(f"\n--- Call History for {self.phone_number} ---")
        if not self.call_history:
            print("No call history.")
        for record in self.call_history:
            print(record)

    def send_message(self, other_phone, content):
        message_data = {
            "to": other_phone.phone_number,
            "from": self.phone_number,
            "content": content
        }
        # Save message in both sender's and receiver's history
        self.messages.append(message_data)
        other_phone.messages.append(message_data)
        print(f"Message sent from {self.phone_number} to {other_phone.phone_number}")

    def show_outgoing_messages(self):
        print(f"\n--- Outgoing Messages from {self.phone_number} ---")
        outgoing = [m for m in self.messages if m["from"] == self.phone_number]
        if not outgoing:
            print("No outgoing messages.")
        for m in outgoing:
            print(f"To {m['to']}: {m['content']}")

    def show_incoming_messages(self):
        print(f"\n--- Incoming Messages for {self.phone_number} ---")
        incoming = [m for m in self.messages if m["to"] == self.phone_number]
        if not incoming:
            print("No incoming messages.")
        for m in incoming:
            print(f"From {m['from']}: {m['content']}")

    def show_messages_from(self, other_phone):
        print(f"\n--- Messages from {other_phone.phone_number} to {self.phone_number} ---")
        filtered = [
            m for m in self.messages 
            if m["from"] == other_phone.phone_number and m["to"] == self.phone_number
        ]
        if not filtered:
            print("No messages found from this sender.")
        for m in filtered:
            print(f"Content: {m['content']}")


# Testing the Phone Class
phone_a = Phone("123-456-7890")
phone_b = Phone("987-654-3210")

# 1. Calls
phone_a.call(phone_b)
phone_b.call(phone_a)
phone_a.show_call_history()

# 2. Messaging
phone_a.send_message(phone_b, "Hey, are we still meeting today?")
phone_b.send_message(phone_a, "Yes! See you at 3 PM.")
phone_a.send_message(phone_b, "Great, bring the notes.")

# 3. Message Filtering Methods
phone_a.show_outgoing_messages()
phone_a.show_incoming_messages()
phone_a.show_messages_from(phone_b)