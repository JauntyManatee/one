import webbrowser

@app.route('/tweetsfeed')
def send_redir():
  Rurl = "http://www.mashable.com"
  webbrowser.open(Rurl)
  return render_template('index.html')