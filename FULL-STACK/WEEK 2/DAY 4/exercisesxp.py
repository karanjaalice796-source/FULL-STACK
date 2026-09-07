import random


def get_words_from_file(file_path):
    try:
        with open(file_path, 'r') as f:
            content = f.read()
        words = content.split()
        return words
    except FileNotFoundError:
        print(f'Error: could not find file "{file_path}".')
        return []


def get_random_sentence(length, file_path='exercisexp.txt'):
    words = get_words_from_file(file_path)
    if not words:
        return ''

    chosen_words = [random.choice(words) for _ in range(length)]
    sentence = ' '.join(chosen_words)
    return sentence.lower()


def main():
    print('This program generates a random, nonsensical sentence '
          'built from words in a word list file.')

    user_input = input('How many words should the sentence contain? (2-20): ')

    try:
        length = int(user_input)
    except ValueError:
        print('Error: please enter a whole number.')
        return

    if not (2 <= length <= 20):
        print('Error: the sentence length must be between 2 and 20 (inclusive).')
        return

    sentence = get_random_sentence(length)
    if sentence:
        print(f'Generated sentence: {sentence}')


if __name__ == '__main__':
    main()

import json
sampleJson = """{
   "company":{
      "employee":{
         "name":"emma",
         "payable":{
            "salary":7000,
            "bonus":800
         }
      }
   }
}"""

# Step 1: Load the JSON string into a Python dictionary
data = json.loads(sampleJson)

# Step 2: Access the nested "salary" key
salary = data['company']['employee']['payable']['salary']
print(f'Salary: {salary}')

# Step 3: Add a new "birth_date" key to the "employee" dictionary
data['company']['employee']['birth_date'] = '1990-05-14'

# Step 4: Save the modified dictionary to a JSON file
with open('employee_data.json', 'w') as f:
    json.dump(data, f, indent=4)

print('Modified JSON saved to employee_data.json')

{
    "company": {
        "employee": {
            "name": "emma",
            "payable": {
                "salary": 7000,
                "bonus": 800
            },
            "birth_date": "1990-05-14"
        }
    }
}