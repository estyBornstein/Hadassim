import os
import re
import heapq
from collections import Counter

def split_log_file(input_file, max_lines=100000):
    file_index = 1
    buffer = []
    # יצירת תיקיה לאחסון הקבצים המחולקים
    output_folder = 'log_parts'
    os.makedirs(output_folder, exist_ok=True)

    with open(input_file, 'r', encoding='utf-8') as log:
        for entry in log:
            if entry.strip():  # אם השורה אינה ריקה
                buffer.append(entry.strip())  # הוספת השורה לרשימה

            if len(buffer) >= max_lines:  # אם הגענו ל-100,000 שורות
                with open(os.path.join(output_folder, f'log_part_{file_index}.txt'), 'w', encoding='utf-8') as out_put:
                    out_put.write("\n".join(buffer))  # מחבר את הרשימה עם ירידת שורה
                print(f'נוצר קובץ: log_part_{file_index}.txt')
                file_index += 1
                buffer = []  # ניקוי הרשימה

    # כתיבת שארית השורות אם נותרו
    if buffer:
        with open(os.path.join(output_folder, f'log_part_{file_index}.txt'), 'w', encoding='utf-8') as output:
            output.writelines(line + "\n" for line in buffer)
        print(f'נוצר קובץ: log_part_{file_index}.txt')
def count_error_codes(file_part, error_counts):
    with open(file_part, 'r', encoding='utf-8') as log:
        for entry in log:
            match = re.search(r'Error: (\w+_\d+)', entry)  # מציאת קוד שגיאה עם רגולרי
            if match:
                error_code = match.group(1)
                error_counts[error_code] += 1  # העלאת הספירה

    return error_counts  # מחזיר את מילון השכיחויות
def get_top_n_errors(n, error_counts):
    top_errors = heapq.nlargest(n, error_counts.items(), key=lambda x: x[1])
    return top_errors

def main():
    file_path = 'logs1.txt'
    split_log_file(file_path)
    error_counts = Counter()
    folder_path = 'log_parts'
    part = 1

    while True:
        file_name = os.path.join(folder_path, f"log_part_{part}.txt")  # מחבר את השם של התיקיה ושם הקובץ
        if os.path.exists(file_name):  # בודק אם הקובץ קיים בתיקיה הספציפית
            count_error_codes(file_name, error_counts)  # ספירת השגיאות בכל קובץ
            part += 1  # מעבר לחלק הבא
        else:
            break  # אם הקובץ לא קיים, עוצרים


    # עכשיו שברשותנו את כל קודי השגיאה מכל הקבצים, נשלוף את ה-N השגיאות השכיחות ביותר
    n = 5  # מספר השגיאות השכיחות ביותר
    top_errors = get_top_n_errors(n, error_counts)
    print(top_errors)


if __name__ == '__main__':
    main()



#סיבוכיות זמן
#קריאת כל הקובץ כאשר N מספר השורות בקובץ logs1 =o(N)
#קריאת כל השורות בכל הקבצים ומציאת קוד השגיאה כאשר L אורך השורה בדר"כ זניח(o(N)= o(L*N
#מיון n השגיאות השכיחות ביותר ע"י מיון ערימה סיבוכיות  כאשר k מספר השגיאות הקימותo(klogn)
#o(n)בנית ערימה  לכאורה זניח
#לכן סה"כ סיבוכיות זמן o(N+klogn+n)


#סיבוכיות מקום
#של הפונקציה split_log_file=O(min(N, max_lines))=o(max_lines)
#count_error_codes=מספר קודי השגיאות השונות במקרה הגרוע o(N)
#get_top_n_errors=o(n) כאשר n מספר השגיאות השכיחות ביותר שאני רוצים למצוא
#לכן סה"כ סיבוכיות מקום o(N+L+n) כאשר N מספר השגיאות השונות בקובץ L ערך המשתנה max_lines
#N=וn מספר השגיאות שאני רוצה למצוא במקרה הגרוע כל השגיאות לכן זניח
#סה"כ o(N+L)


