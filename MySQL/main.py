import requests  # 发送请求
from bs4 import BeautifulSoup  # 解析网页
import pandas as pd  # 存取csv
from time import sleep  # 等待时间
import random  # 添加随机延时

book_name = []
book_url = []
book_star = []
book_star_people = []
book_author = []
book_translater = []
book_publisher = []
book_pub_year = []
book_price = []
book_comment = []
book_cover = []  # 新增图书封面URL列表


def get_book_info(url, headers):
    res = requests.get(url, headers=headers)
    soup = BeautifulSoup(res.text, 'html.parser')
    for book in soup.select('.item'):
        name = book.select('.pl2 a')[0]['title']  # 书名
        book_name.append(name)
        bkurl = book.select('.pl2 a')[0]['href']  # 书籍链接
        book_url.append(bkurl)
        star = book.select('.rating_nums')[0].text  # 书籍评分
        book_star.append(star)
        star_people = book.select('.pl')[1].text  # 评分人数
        star_people = star_people.strip().replace(' ', '').replace('人评价', '').replace('(\n', '').replace('\n)', '')  # 数据清洗
        book_star_people.append(star_people)
        
        # 获取图书封面URL（添加错误处理）
        try:
            cover_img = book.find('img')  # 使用find方法查找第一个img标签
            if cover_img and 'src' in cover_img.attrs:
                cover_url = cover_img['src']
            else:
                cover_url = None
            book_cover.append(cover_url)
        except Exception as e:
            print(f"获取封面URL时出错: {str(e)}")
            book_cover.append(None)
        
        if book.select('.quote span'):
            book_comment.append(book.select('.quote span')[0].text)
        else:
            book_comment.append(None)

        info = book.select('.pl')[0].text.split('/')
        if len(info) == 5:
            book_author.append(info[0])
            book_translater.append(info[1])
            book_publisher.append(info[2])
            book_pub_year.append(info[3])
            book_price.append(str(info[4]))
        elif len(info) == 4:
            book_author.append(info[0])
            book_translater.append(None)
            book_publisher.append(info[1])
            book_pub_year.append(info[2])
            book_price.append(str(info[3]))
        elif len(info) == 6:
            book_author.append(info[0])
            book_translater.append(info[1])
            book_publisher.append(info[2])
            book_pub_year.append(info[3])
            book_price.append(str(info[4]) + '/' + str(info[5]))
        elif len(info) == 3:
            book_author.append(None)
            book_translater.append(None)
            book_publisher.append(info[0])
            book_pub_year.append(info[1])
            book_price.append(str(info[2]))
        else:
            pass


def save_to_csv(csv_name):
    """
    数据保存到csv
    :return: None
    """
    df = pd.DataFrame()  # 初始化一个DataFrame对象
    df['书名'] = book_name
    df['豆瓣链接'] = book_url
    df['封面URL'] = book_cover  # 新增封面URL列
    df['作者'] = book_author
    df['译者'] = book_translater
    df['出版社'] = book_publisher
    df['出版日期'] = book_pub_year
    df['价格'] = book_price
    df['评分'] = book_star
    df['评分人数'] = book_star_people
    df['一句话评价'] = book_comment
    df.to_csv(csv_name, encoding='utf8')  # 将数据保存到csv文件


if __name__ == "__main__":
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.343.3112 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Connection': 'keep-alive'
    }
    for i in range(10):
        page_url = 'https://book.douban.com/top250?start={}'.format(str(i * 25))
        print('开始爬取第{}页，地址是{}'.format(str(i + 1), page_url))
        get_book_info(page_url, headers)
        sleep_time = random.uniform(1, 3)  # 随机延时1-3秒
        sleep(sleep_time)
    save_to_csv(csv_name="豆瓣读书Top250.csv")
