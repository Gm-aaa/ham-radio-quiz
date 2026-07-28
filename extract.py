#!/usr/bin/env python3
"""Extract questions from CRAC 2025 amateur radio question bank PDFs."""

import json
import re
import fitz

BASE = "/home/gmaaa/Downloads/业余无线电题库2025/"


def extract_text(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text


def extract_question_numbers(pdf_path):
    text = extract_text(pdf_path)
    return set(re.findall(r'\[I\]MC\d+-(\d{4})', text))


def parse_questions(text):
    blocks = re.split(r'(?=\[J\])', text)
    questions = []

    for block in blocks:
        block = block.strip()
        if not block.startswith('[J]'):
            continue

        # Remove page numbers (standalone lines that are just digits)
        lines = block.split('\n')
        lines = [l for l in lines if not re.match(r'^\d{1,3}$', l.strip())]
        block = '\n'.join(lines)

        old_id_m = re.search(r'\[J\](\S+)', block)
        section_m = re.search(r'\[P\](\S+)', block)
        new_id_m = re.search(r'\[I\]MC(\d+)-(\d{4})', block)
        question_m = re.search(r'\[Q\](.*?)(?=\[T\])', block, re.DOTALL)
        answer_m = re.search(r'\[T\]([A-D]+)', block)

        if not new_id_m or not question_m or not answer_m:
            continue

        # Extract options
        options = {}
        for letter in 'ABCD':
            opt_m = re.search(
                rf'\[{letter}\](.*?)(?=\[[A-D]\]|\[T\]|$)', block, re.DOTALL
            )
            if opt_m:
                opt_text = opt_m.group(1).strip()
                opt_text = re.sub(r'\s+', ' ', opt_text)
                if opt_text:
                    options[letter] = opt_text

        if not options:
            continue

        question_text = question_m.group(1).strip()
        question_text = re.sub(r'\s+', ' ', question_text)

        q = {
            "id": new_id_m.group(2),
            "oldId": old_id_m.group(1) if old_id_m else "",
            "section": section_m.group(1) if section_m else "",
            "type": f"MC{new_id_m.group(1)}",
            "question": question_text,
            "answer": answer_m.group(1),
            "options": options,
            "explanation": "",
            "categories": [],
        }
        questions.append(q)

    return questions


def main():
    a_nums = extract_question_numbers(BASE + "A类题库.pdf")
    b_nums = extract_question_numbers(BASE + "B类题库.pdf")
    c_nums = extract_question_numbers(BASE + "C类题库.pdf")

    total_text = extract_text(BASE + "总题库.pdf")
    questions = parse_questions(total_text)

    for q in questions:
        cats = []
        if q["id"] in a_nums:
            cats.append("A")
        if q["id"] in b_nums:
            cats.append("B")
        if q["id"] in c_nums:
            cats.append("C")
        q["categories"] = cats

    # Stats
    a_count = sum(1 for q in questions if "A" in q["categories"])
    b_count = sum(1 for q in questions if "B" in q["categories"])
    c_count = sum(1 for q in questions if "C" in q["categories"])
    no_cat = sum(1 for q in questions if not q["categories"])

    print(f"Total: {len(questions)}")
    print(f"A: {a_count}, B: {b_count}, C: {c_count}")
    print(f"No category: {no_cat}")

    # Check for questions with missing options
    incomplete = [q for q in questions if len(q["options"]) < 2]
    if incomplete:
        print(f"WARNING: {len(incomplete)} questions with <2 options")
        for q in incomplete[:5]:
            print(f"  {q['id']}: {q['question'][:40]}...")

    with open("/home/gmaaa/ham-radio-quiz/data/questions.json", "w", encoding="utf-8") as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)

    print("Written to data/questions.json")


if __name__ == "__main__":
    main()
