import pandas as pd
import mysql.connector

# 加载CSV文件
file_path = 'MySQL\豆瓣读书Top250.csv'
df = pd.read_csv(file_path)

# 重命名列以匹配数据库表的列名
df.rename(columns={
    '书名': 'title',
    '豆瓣链接': 'link',
    '作者': 'author',
    '译者': 'translator',
    '出版社': 'publisher',
    '出版日期': 'publish_date',
    '价格': 'price',
    '评分': 'rating',
    '评分人数': 'rating_count',
    '一句话评价': 'summary'
}, inplace=True)

# 填充NaN值
df.fillna(value={
    'title': '',
    'link': '',
    'author': '',
    'translator': '',
    'publisher': '',
    'publish_date': '',
    'price': '',
    'rating': 0.0,
    'rating_count': 0,
    'summary': ''
}, inplace=True)

# 连接到MySQL服务器
conn = mysql.connector.connect(
    host='localhost',
    user='root',
    password='yj811025',
    database='douban_books_db'
)
cursor = conn.cursor()

# 插入数据
for _, row in df.iterrows():
    cursor.execute("""
        INSERT INTO books (title, link, author, translator, publisher, publish_date, price, rating, rating_count, summary)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        row['title'], row['link'], row['author'], row['translator'], row['publisher'], 
        row['publish_date'], row['price'], row['rating'], row['rating_count'], row['summary']
    ))

# 提交事务并关闭连接
conn.commit()
cursor.close()
conn.close()
