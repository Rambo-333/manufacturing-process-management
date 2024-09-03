import pickle

from flask import Flask, redirect, render_template, request, url_for, jsonify, make_response
import base64
import os
from app.models.cut import NewCut
from app.models.addcut import AddCut
from app.models.sp import SP
from app.models.vi import VIS
import settings
import json

app = Flask(__name__, template_folder='../../templates', static_folder='../../static')

#----------------------------------------------------------------------
class WebServer(object):
    def start(self, debug=False):
        app.run(host='192.168.11.3', port=settings.PORT, ssl_context=('ssl.crt', 'ssl.key'), threaded=True, debug=debug)

# class WebServer(object):
#     def start():
#         app.run()

#----------------------------------------------------------------------

server = WebServer()


@app.route("/")
def index():
    return render_template('index.html')


#  cut_process
# ###########################################
# 新規カット工程
@app.route("/cut", methods=['GET', 'POST'])
def cut():
    if request.method == 'POST':
        # リクエストフォーム処理
        data_list = request.form
        NewCut.get_or_create(data_list)
        return render_template('cut.html')
    elif request.method == 'GET' and request.args.get('input'):
        nocheck = request.args.get('input')
        if nocheck == 'showData':
            c_list, data = NewCut.read_data()
        else:
            c_list, data = NewCut.read_data_one(nocheck)
        return jsonify({'result1': c_list, 'result2': data})
    return render_template('cut.html')


# 追加カット工程
@app.route("/add_cut", methods=['GET', 'POST'])
def add_cut():
    if request.method == 'POST':
        # リクエストフォーム処理
        data_list = request.form
        AddCut.get_or_create(data_list)
        return render_template('add_cut.html')
    elif request.method == 'GET' and request.args.get('input'):
        nocheck = request.args.get('input')
        if nocheck == 'showData':
            c_list, data = AddCut.read_data()
        else:
            c_list, data = AddCut.read_data_one(nocheck)
        return jsonify({'result1': c_list, 'result2': data})
    return render_template('add_cut.html')


# セグメントカット工程
# ###########################################


# SP工程
# ###########################################
@app.route("/sp", methods=['GET', 'POST'])
def sp():
    if request.method == 'POST' and not(request.args.get('spNo')):
        # リクエストフォーム処理
        data_list = request.form
        SP.get_or_create(data_list)
        return render_template('sp.html')
    elif request.method == 'POST' and request.args.get('spNo'):
        # 一時データ保存
        idNo = request.args.get("spNo")
        tempData = request.form
        SP.temp_data(idNo, tempData)
        return render_template('sp.html')
    elif request.method == 'GET' and request.args.get('input'):
        nocheck = request.args.get('input')
        if nocheck == 'showData':
            # 履歴取得
            c_list, data = SP.read_data()
            return jsonify({'result1': c_list, 'result2': data})
        elif int(nocheck) > 3:
            data1, data2 = SP.read_data_one(nocheck)
            return jsonify({'result1': data1, 'result2': data2})
        else:
            # 一時データ取得
            c_list, data = SP.temp_read_data(nocheck)
            return jsonify({'result1': c_list, 'result2': data})
    return render_template('sp.html')


@app.route("/sd")
def sd():
    return render_template('sd.html')


@app.route("/sc")
def sc():
    return render_template('sc.html')


@app.route("/sh")
def sh():
    return render_template('sh.html')


@app.route("/seg")
def seg():
    return render_template('seg.html')


@app.route("/vi", methods=['GET', 'POST'])
def vi():
    if request.method == 'POST':
        # リクエストフォーム処理
        if 'image' in request.form:
            data_url = request.form['image']
            username = request.form['lotno']
            # データURLからヘッダーを取り除く
            header, encoded = data_url.split(",", 1)
            data = base64.b64decode(encoded)
            # 保存先のフォルダを指定
            save_dir = 'c:/Users/Development/deployCheck/visImage'
            #save_dir = 'c:/Users/Development/webapp/visImage'
            # ファイル名を指定（ここではユーザーネームを使用）
            filename = f'{username}.jpg'
            # ファイルを保存
            with open(os.path.join(save_dir, filename), 'wb') as f:
                f.write(data)
        data_list = request.form
        VIS.get_or_create(data_list)
        return render_template('vi.html')
    elif request.method == 'GET' and request.args.get('input'):
        nocheck = request.args.get('input')
        if nocheck == 'showData':
            c_list, data = VIS.read_data()
        else:
            c_list, data = VIS.read_data_one(nocheck)
        return jsonify({'result1': c_list, 'result2': data})
    return render_template('vi.html')



@app.route("/get_workers", methods=['GET'])
def get_workers():
    filename = 'workers.txt'
    with open(filename, 'r', encoding='utf-8') as f:
        workers = [line.strip() for line in f]
    response = make_response(jsonify(workers))
    response.headers['Cache-Control'] = 'no-store, must-revalidate'
    return response

@app.route("/get_workers2", methods=['GET'])
def get_workers2():
    filename = 'workers2.txt'
    with open(filename, 'r', encoding='utf-8') as f:
        workers = [line.strip() for line in f]
    response = make_response(jsonify(workers))
    response.headers['Cache-Control'] = 'no-store, must-revalidate'
    return response