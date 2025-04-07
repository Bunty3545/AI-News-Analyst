import random

def simple_chatbot():
    greetings = ["Hello!", "Hi there!", "Greetings!", "Hey!"]
    farewells = ["Goodbye!", "See you later!", "Bye!", "Have a great day!"]
    positive_responses = ["That's great to hear!", "Awesome!", "Wonderful!", "Glad to know!"]
    negative_responses = ["Oh, I'm sorry to hear that.", "That's unfortunate.", "Hmm, that's not ideal."]
    neutral_responses = ["Interesting.", "Okay.", "Got it.", "I understand."]
    thank_you_responses = ["You're welcome!", "No problem!", "Happy to help!"]
    amritsar_responses = ["Amritsar is a beautiful city!", "Have you visited the Golden Temple?", "The food in Amritsar is delicious!", "It's a vibrant place."]
    food_responses = ["What kind of food are you in the mood for?", "I love talking about food!", "Have you tried the local cuisine?"]
    travel_responses = ["Where are you planning to travel?", "Travel is always exciting!", "Do you need any travel tips?"]
    weather_responses = ["I don't have real-time weather information, but I hope it's pleasant!", "The weather can be unpredictable."]
    help_responses = ["How can I assist you today?", "What do you need help with?"]
    name_responses = ["That's a nice name!", "It's good to meet you."]
    how_are_you_responses = ["As a chatbot, I don't have feelings, but I'm functioning well!", "I'm doing fine, thank you for asking."]
    default_responses = ["Interesting...", "Tell me more.", "Can you elaborate?", "I'm not sure I understand."]

    print(random.choice(greetings))

    while True:
        user_input = input("You: ").lower()

        if "hello" in user_input or "hi" in user_input or "hey" in user_input:
            print("Bot:", random.choice(greetings))
        elif "bye" in user_input or "goodbye" in user_input or "see you" in user_input:
            print("Bot:", random.choice(farewells))
            break
        elif "thank you" in user_input or "thanks" in user_input:
            print("Bot:", random.choice(thank_you_responses))
        elif "how are you" in user_input:
            print("Bot:", random.choice(how_are_you_responses))
        elif "amritsar" in user_input or "punjab" in user_input:
            print("Bot:", random.choice(amritsar_responses))
        elif "food" in user_input or "eat" in user_input:
            print("Bot:", random.choice(food_responses))
        elif "travel" in user_input or "trip" in user_input or "vacation" in user_input:
            print("Bot:", random.choice(travel_responses))
        elif "weather" in user_input:
            print("Bot:", random.choice(weather_responses))
        elif "help" in user_input or "assist" in user_input:
            print("Bot:", random.choice(help_responses))
        elif "my name is" in user_input:
            name = user_input.split("my name is")[-1].strip()
            print("Bot:", random.choice(name_responses), name)
        elif any(word in user_input for word in ["good", "great", "awesome", "wonderful"]):
            print("Bot:", random.choice(positive_responses))
        elif any(word in user_input for word in ["bad", "sad", "terrible", "awful"]):
            print("Bot:", random.choice(negative_responses))
        elif any(word in user_input for word in ["okay", "alright", "hmm", "interesting"]):
            print("Bot:", random.choice(neutral_responses))
        else:
            print("Bot:", random.choice(default_responses))

if __name__ == "__main__":
    simple_chatbot()