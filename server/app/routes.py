from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from . import mysql
import requests
from flask import jsonify, request, Response, current_app
import json
import os
from flask_mysqldb import MySQL
from werkzeug.utils import secure_filename


main = Blueprint('main', __name__)

@main.route('/books', methods=['GET'])
def get_books():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM books")
    books = cur.fetchall()
    cur.close()
    return jsonify(books)

@main.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = data['password']
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, hashed_password))
    mysql.connection.commit()
    cur.close()
    
    return jsonify({"message": "User registered successfully"}), 201

@main.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cur.fetchone()
    cur.close()

    if user and check_password_hash(user['password'], password):
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 401
    
@main.route('/books-by-decade', methods=['GET'])
def books_by_decade():
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT 
            FLOOR(publish_date / 10) * 10 AS decade, 
            COUNT(*) AS count
        FROM books
        GROUP BY decade
        ORDER BY decade
    """)
    result = cur.fetchall()
    cur.close()
    return jsonify(result)

@main.route('/books-by-year', methods=['GET'])
def books_by_year():
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT 
            publish_date AS year, 
            COUNT(*) AS count
        FROM books
        GROUP BY year
        ORDER BY year
    """)
    result = cur.fetchall()
    cur.close()
    return jsonify(result)

@main.route('/books-by-publisher', methods=['GET'])
def books_by_publisher():
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT 
            publisher, 
            COUNT(*) AS count
        FROM books
        GROUP BY publisher
        ORDER BY count DESC
    """)
    result = cur.fetchall()
    cur.close()

    # 数据处理，只保留较多的几个出版社，其余设置为“其他出版社”
    threshold = 5
    result = [dict(row) for row in result]  
    if len(result) > threshold:
        top_publishers = result[:threshold]
        other_count = sum(item['count'] for item in result[threshold:])
        top_publishers.append({'publisher': '其他出版社', 'count': other_count})
    else:
        top_publishers = result

    return jsonify(top_publishers)

@main.route('/book-summaries', methods=['GET'])
def get_book_summaries():
    cur = mysql.connection.cursor()
    cur.execute("SELECT summary FROM books WHERE summary IS NOT NULL AND summary != ''")
    summaries = cur.fetchall()
    cur.close()
    return jsonify([item['summary'] for item in summaries])

@main.route('/chat', methods=['POST'])
def chat():
    data = request.json
    interviewee_message = data.get('Interviewee_message')

    # Create the prompt based on the messages
    prompt = interviewee_message

    # Call the LLaMA API
    llama_response = requests.post('http://localhost:11434/api/generate', json={
        "model": "llama3",
        "prompt": prompt,
        "stream": True
    }, stream=True)

    def generate():
        for line in llama_response.iter_lines():
            if line:
                decoded_line = line.decode('utf-8')
                json_response = json.loads(decoded_line)
                if 'response' in json_response:
                    yield f"data: {json_response['response']}\n\n"
                if json_response.get('done'):
                    break

    return Response(generate(), mimetype='text/event-stream')

@main.route('/profile', methods=['POST'])
def update_profile():
    data = request.json
    user_id = 1  # Replace with actual user ID logic
    username = data.get('username')
    password = data.get('password')
    bio = data.get('bio')
    avatar = data.get('avatar')

    cursor = mysql.connection.cursor()

    # 检查用户名是否已经存在，并且不是当前用户的用户名
    cursor.execute('SELECT id FROM users WHERE username = %s AND id != %s', (username, user_id))
    existing_user = cursor.fetchone()
    if existing_user:
        cursor.close()
        return jsonify({'error': 'Username already exists'}), 400

    # 更新数据库中的用户信息
    cursor.execute('UPDATE users SET username = %s, password = %s, bio = %s, avatar = %s WHERE id = %s',
                   (username, password, bio, avatar, user_id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({'message': 'Profile updated successfully'})

@main.route('/upload-avatar', methods=['POST'])
def upload_avatar():
    if 'avatar' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['avatar']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        return jsonify({'url': filepath})
    return jsonify({'error': 'File upload failed'}), 500