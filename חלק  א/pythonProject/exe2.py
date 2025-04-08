import pandas as pd
import os
import csv
from datetime import datetime
from collections import defaultdict

#מורידה שגיאות וכפולים מחשבת ממוצעים וכותבת לcsv חדש
def health_checks_and_calculate(file, output_csv):
    try:
        file_ext = os.path.splitext(file)[1].lower()

        if file_ext not in ['.csv', '.parquet']:
            print(" סוג קובץ לא נתמך (רק .csv או .parquet)")
            return

        # טעינת הנתונים
        if file_ext == '.csv':
            df = pd.read_csv(file, dtype={'timestamp': str})
            df['timestamp'] = pd.to_datetime(df['timestamp'], format="%d/%m/%Y %H:%M", errors='coerce', dayfirst=True)
        else:
            df = pd.read_parquet(file)
            df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce')

        # שמירה על הערך לפי סוג הקובץ
        value_col = 'value' if 'value' in df.columns else 'mean_value'
        df['value'] = pd.to_numeric(df[value_col], errors='coerce')

        # ניקוי נתונים: הסרת ערכים ותאריכים לא תקינים, כפילויות לפי timestamp
        df = df.dropna(subset=['timestamp', 'value'])
        df = df.drop_duplicates(subset=['timestamp'])

        # עדכון הקובץ המקורי
        df_to_save = df[['timestamp', 'value']]
        if file_ext == '.csv':
            df_to_save.to_csv(file, index=False, encoding='utf-8')
        else:
            df_to_save.to_parquet(file, index=False)

        # יצירת עמודות עזר לחישוב ממוצע
        df['date'] = df['timestamp'].dt.date
        df['hour'] = df['timestamp'].dt.hour

        # חישוב ממוצעים
        hourly_avg = df.groupby(['date', 'hour'])['value'].mean().reset_index()

        # כתיבה ל-output
        with open(output_csv, 'w', newline='', encoding='utf-8') as out_file:
            writer = csv.writer(out_file)
            writer.writerow(["ממוצע", "שעה", "תאריך"])
            for _, row in hourly_avg.iterrows():
                writer.writerow([row['date'].strftime("%d/%m/%Y"), f"{int(row['hour']):02d}:00", round(row['value'], 2)])

        # סטטיסטיקות סיכום
        print(f"✔ סך השורות בקובץ המקורי לאחר סינון: {len(df)}")
        print(f"✔ הממוצעים נכתבו לקובץ: {output_csv}")
        print(f"✔ סך שורות בקובץ הממוצעים: {len(hourly_avg)}")

    except Exception as e:
        print(f"שגיאה במהלך ביצוע הפונקציה: {e}")

#מנקה את השגיאות והכפולים ושומרת לCsv חדש
def clean_and_deduplicate(input_file, output_csv):
    try:
        file_ext = os.path.splitext(input_file)[1].lower()
        if file_ext == '.csv':
            df = pd.read_csv(input_file, dtype={'timestamp': str})
            value_column = 'value'
        elif file_ext == '.parquet':
            df = pd.read_parquet(input_file)
            value_column = 'mean_value'
        else:
            print(" סוג קובץ לא נתמך (רק .csv או .parquet)")
            return

        total_lines = len(df)
        print(f"סך השורות בקובץ: {total_lines}")

        # המרת timestamp לתאריך-שעה תקף (ימחק שגויים אוטומטית)
        df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce', dayfirst=True)
        df = df.dropna(subset=['timestamp', value_column])

        # המרת ערכים למספרים וסינון NaN
        df[value_column] = pd.to_numeric(df[value_column], errors='coerce')
        df = df.dropna(subset=[value_column])

        # המרה לפורמט אחיד בתצוגה
        df['timestamp_str'] = df['timestamp'].dt.strftime('%d/%m/%Y %H:%M')
        df[value_column] = df[value_column].astype(str)

        # שמירה על שורות ייחודיות לפי timestamp_str בלבד
        df_unique = df.drop_duplicates(subset=['timestamp_str'])

        # שמירה לקובץ
        df_to_save = df_unique[['timestamp_str', value_column]].rename(columns={'timestamp_str': 'timestamp', value_column: 'value'})
        df_to_save.to_csv(output_csv, index=False, encoding='utf-8')

        print(f"✔ סך השורות התקינות שנשמרו: {len(df_to_save)}")

    except Exception as e:
        print(f"שגיאה במהלך ביצוע הפונקציה: {e}")

#מחלקת לפי ימים
def split_by_day(input_file):
    data_by_day = defaultdict(list)

    # קריאת הקובץ
    df = pd.read_csv(input_file)

    try:
        # ניסוי להמיר לפורמט של parquet קודם
        df['timestamp'] = pd.to_datetime(df['timestamp'], format="%Y-%m-%d %H:%M:%S", errors='raise')
    except ValueError:
        # אם המרה כזו נכשלת, המרה לפורמט של CSV
        df['timestamp'] = pd.to_datetime(df['timestamp'], format="%d/%m/%Y %H:%M", errors='coerce')

    df = df.dropna(subset=['timestamp'])

    # עיבוד השורות
    for index, row in df.iterrows():
        date_time_str = row['timestamp']
        value = row['value']

        if isinstance(date_time_str, pd.Timestamp):
            date_time_str = date_time_str.strftime('%d/%m/%Y %H:%M')

        try:
            dt = datetime.strptime(date_time_str, "%d/%m/%Y %H:%M")
        except ValueError:
            dt = datetime.strptime(date_time_str, "%Y-%m-%d %H:%M:%S")

        data_by_day[dt.date()].append((dt, value))

    return data_by_day

#שומרת לפי ימין
def save_daily_files(data_by_day, output_folder):
    os.makedirs(output_folder, exist_ok=True)  # יוצר את התיקיה אם היא לא קיימת

    # המרת כל הרשימות ל-DataFrame במכה אחת
    for date, records in data_by_day.items():
        df = pd.DataFrame(records, columns=["timestamp", "value"])

        # המרת עמודת timestamp לפורמט תאריך-שעה
        df['timestamp'] = pd.to_datetime(df['timestamp'])

        # יצירת שם קובץ עם רק התאריך (בלי השעה)
        filename = os.path.join(output_folder, f"{date}.csv")

        # שמירה לקובץ CSV
        df.to_csv(filename, index=False, columns=["timestamp", "value"], date_format="%d/%m/%Y %H:%M", encoding='utf-8')

    print(f"✔ כל הקבצים נשמרו בתיקייה: {output_folder}")

#מחשבת ממוצעים לכל יום(קובץ) וכותבת את התוצאות לcsv
def calculate_hourly_averages_from_files(daily_folder, output_csv):
    daily_averages = []

    # עברו על כל הקבצים בתיקייה
    for filename in os.listdir(daily_folder):
        if filename.endswith(".csv"):
            filepath = os.path.join(daily_folder, filename)

            # קריאת הקובץ עם pandas
            df = pd.read_csv(filepath, encoding='utf-8')

            # המרת עמודת timestamp לתאריך ושעה (אם היא לא כבר בתבנית זו)
            df['timestamp'] = pd.to_datetime(df['timestamp'], format="%d/%m/%Y %H:%M", errors='coerce')

            # הוספת עמודת שעה
            df['hour'] = df['timestamp'].dt.hour

            # חישוב ממוצע לפי תאריך ושעה
            hourly_avg = df.groupby([df['timestamp'].dt.date, 'hour'])['value'].mean().reset_index()

            # לוודא שהעמודה היא בתבנית datetime
            hourly_avg['timestamp'] = pd.to_datetime(hourly_avg['timestamp'], errors='coerce')

            # הכנת הנתונים לפלט
            for _, row in hourly_avg.iterrows():
                date_str = row['timestamp'].strftime("%d/%m/%Y")
                daily_averages.append([date_str, f"{int(row['hour']):02d}:00", round(row['value'], 2)])

    # כתיבת הממוצעים לקובץ CSV
    df_averages = pd.DataFrame(daily_averages, columns=["ממוצע", "שעה", "תאריך"])
    df_averages.to_csv(output_csv, index=False, encoding='utf-8')

    print(f"\n קובץ הממוצעים הסופי נכתב ל: {output_csv}")

def main():
    print("Hellow")
    # קריאה לפונקציה עם קובץ Parquet ונתיב פלט
    #health_checks_and_calculate('time_series.parquet', 'output1.csv')

    # קריאה לפונקציה עם קובץ CSV ונתיב פלט
    #health_checks_and_calculate('time_series.csv', 'output2.csv')


    #   הרצה של קובץ parquet בחלוקה לקבצים
    #clean_and_deduplicate('time_series.parquet', 'time_series_clean.csv')
    #data_by_day = split_by_day('time_series_clean.csv')
    #save_daily_files(data_by_day, 'daily_files1')
    #calculate_hourly_averages_from_files('daily_files1', 'output3.csv')

    #   הרצה של קובץ csv בחלוקה לקבצים
    #clean_and_deduplicate('time_series.csv','time_series_clean.csv')
    #data_by_day=split_by_day('time_series_clean.csv')
    #save_daily_files(data_by_day,'daily_files2')
    #calculate_hourly_averages_from_files('daily_files2','output4.csv')




if __name__ == '__main__':
    main()
#מה אעשה אם הנתונים יגיעו בזרימה בזמן אמת?
#כשנתונים יגיעו בזמן ריצה, אעקוב אחרי כל שעה ואשמור את כמות הנתונים והערך של כל נתון.
# כאשר תעבור שעה עגולה, אחשב את הממוצע של הנתונים שהגיעו בשעה זו
# ואוסיף את הממוצע לקובץ המכיל את כל הממוצעים השעתיים


#יתרונות שימוש בקבצים מסוג parquet

#תופס פחות מקום בדיסק –
# Parquet משתמש בדחיסה אוטומטית ויעילה לפי עמודות, כך שהקובץ קטן משמעותית מקובצי CSV.

#מהיר יותר לקריאה וכתיבה של נתונים – כי הפורמט שומר נתונים לפי עמודות,
# מה שמאפשר לגשת רק לעמודות שצריך במקום לטעון את כל הקובץ.

#תמיכה בטיפוסים מורכבים
#Parquet מאפשר אחסון של טיפוסים מקוננים כמו structs, lists ו-nested objects,
# כך שאם הנתונים שלך מורכבים מאובייקטים עם שדות פנימיים או מערכים,
# הוא יתאים בצורה טבעית ונוחה יותר לעבודה איתם.

#קריאה מקבילית (Parallel Reading)
#הקובץ נשמר במבנה פנימי שמאפשר קריאה בו-זמנית ממספר חלקים.
# זה משפר את הביצועים משמעותית ומאפשר עיבוד מהיר יותר של נתונים
# – במיוחד כשעובדים על שרתים או תשתיות מרובות ליבות.

#מתאים במיוחד לביג דאטה
#  פותח במיוחד לעבודה עם כמויות גדולות של מידע.
#  הוא אידיאלי לסביבות כמו Hadoop, Spark או Presto,
#  ומספק ביצועים אופטימליים גם כאשר הנתונים גדולים במיוחד.


