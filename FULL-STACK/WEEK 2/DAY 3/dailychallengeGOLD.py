def collect_and_sort():
    people = []

    for i in range(5):
        name = input(f'Enter name #{i + 1}: ')
        age = input(f'Enter age #{i + 1}: ')
        score = input(f'Enter score #{i + 1}: ')
        people.append((name, age, score))

    people.sort(key=lambda person: (person[0], person[1], person[2]))
    return people


if __name__ == '__main__':
    sorted_people = collect_and_sort()
    print(sorted_people)