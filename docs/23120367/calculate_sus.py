#!/usr/bin/env python3
"""
calculate_sus.py
Script xử lý và kiểm chứng dữ liệu khảo sát Usability Testing (Task 2 - HW03)
Hệ thống: EShop SUT
Tác giả: Trần Ngọc Diễm Thúy (23120367)
"""

import csv
import math
import sys
import urllib.request

SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1nSYYvo6tOrltxSdoChTR1D403YjWw_7VKamyNYWDrOE/export?format=csv"

def fetch_data(csv_path=None):
    if csv_path:
        with open(csv_path, mode='r', encoding='utf-8') as f:
            reader = csv.reader(f)
            return list(reader)
    else:
        req = urllib.request.Request(
            SHEET_CSV_URL, 
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        with urllib.request.urlopen(req) as resp:
            lines = [line.decode('utf-8') for line in resp.readlines()]
            reader = csv.reader(lines)
            return list(reader)

def mask_phone(phone_str):
    phone_clean = phone_str.strip()
    if len(phone_clean) >= 6:
        return phone_clean[:3] + '*' * (len(phone_clean) - 6) + phone_clean[-3:]
    return phone_clean

def get_grade(sus):
    if sus >= 80.3:
        return 'A'
    elif sus >= 74.0:
        return 'B'
    elif sus >= 68.0:
        return 'C'
    elif sus >= 51.0:
        return 'D'
    else:
        return 'F'

def get_adjective(sus):
    if sus >= 85.0:
        return "Excellent"
    elif sus >= 71.4:
        return "Good"
    elif sus >= 52.0:
        return "OK"
    elif sus >= 39.0:
        return "Poor"
    else:
        return "Awful / Worst Imaginable"

def get_acceptability(sus):
    if sus >= 70.0:
        return "Acceptable"
    elif sus >= 50.0:
        return "Marginal"
    else:
        return "Not Acceptable"

def main():
    csv_file = sys.argv[1] if len(sys.argv) > 1 else '/tmp/survey_data.csv'
    try:
        rows = fetch_data(csv_file)
    except Exception:
        rows = fetch_data()

    header = rows[0]
    data_rows = rows[1:]
    
    participants = []
    for idx, r in enumerate(data_rows, 1):
        pid = f"P{idx:02d}"
        name = r[1]
        phone_raw = r[2]
        phone_masked = mask_phone(phone_raw)
        job = r[3]
        video = r[4]
        q_raw = [int(r[i]) for i in range(5, 15)]
        
        # Odd Q: score - 1; Even Q: 5 - score
        q_conv = []
        for i, val in enumerate(q_raw):
            if (i + 1) % 2 == 1:
                q_conv.append(val - 1)
            else:
                q_conv.append(5 - val)
        
        tot_conv = sum(q_conv)
        sus = tot_conv * 2.5
        
        participants.append({
            'pid': pid,
            'name': name,
            'phone': phone_masked,
            'job': job,
            'video': video,
            'q_raw': q_raw,
            'q_conv': q_conv,
            'tot_conv': tot_conv,
            'sus': sus,
            'grade': get_grade(sus),
            'adjective': get_adjective(sus),
            'acceptability': get_acceptability(sus),
            'probes': [r[i] for i in range(15, 20)]
        })

    sus_list = [p['sus'] for p in participants]
    n = len(sus_list)
    mean_sus = sum(sus_list) / n
    sample_sd = math.sqrt(sum((x - mean_sus) ** 2 for x in sus_list) / (n - 1))
    pop_sd = math.sqrt(sum((x - mean_sus) ** 2 for x in sus_list) / n)
    sorted_sus = sorted(sus_list)
    median_sus = (sorted_sus[n//2 - 1] + sorted_sus[n//2]) / 2 if n % 2 == 0 else sorted_sus[n//2]
    min_sus = min(sus_list)
    max_sus = max(sus_list)

    print("=========================================================================================")
    print(f"BÁO CÁO KẾT QUẢ ĐO LƯỜNG HỆ THỐNG SUS (N = {n})")
    print("=========================================================================================")
    print(f"Mean (Trung bình cộng):     {mean_sus:.2f}")
    print(f"Sample SD (Độ lệch chuẩn):   {sample_sd:.2f}")
    print(f"Population SD:               {pop_sd:.2f}")
    print(f"Median (Trung vị):          {median_sus:.2f}")
    print(f"Min (Thấp nhất):            {min_sus:.2f}")
    print(f"Max (Cao nhất):             {max_sus:.2f}")
    print(f"Chuẩn ngành (Benchmark):    68.00")
    print(f"Chênh lệch so với chuẩn:    {mean_sus - 68.0:.2f} điểm")
    print("-----------------------------------------------------------------------------------------")
    for p in participants:
        print(f"{p['pid']} | {p['name']:<22} | {p['phone']} | {p['job']:<20} | SUS: {p['sus']:5.1f} | Grade: {p['grade']} | {p['adjective']:<12} | {p['acceptability']}")
    print("=========================================================================================")

if __name__ == '__main__':
    main()
