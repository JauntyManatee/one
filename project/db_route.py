import json

class DB_Route:

    def __init__(self, app):

      #Sign Up
      @app.route('/signup', methods=['POST'])
      def signup():
        data_string = json.loads(request.data.decode('utf-8', 'strict').replace("'", "\""))
        username = data_string['username']
        search_result = session.query(User).filter_by(username=username).all()
       # if search_result[0].username == username:
        if search_result:
          print(search_result)
          return str.encode('User already exists.')
        else:
          new_salt = os.urandom(4)
          password = data_string['password']
          user_pass_hash = scrypt.encrypt(new_salt, password, maxtime=0.001)
          newUser = User(username=username, password=user_pass_hash, salt=new_salt)
          session.add(newUser)
          session.commit()
          return str.encode('User added.')

      #Authenticate on login
      @app.route('/login', methods=['POST'])
      def authenticate():
        data_string = json.loads(request.data.decode('utf-8', 'strict').replace("'", "\""))
        username = data_string['username']
        search_result = session.query(User).filter_by(username=username).all()
         # if search_result[0].username == username:
        if search_result:
          user_salt = search_result[0].salt   
          print(type(user_salt))
          user_password = search_result[0].password
          print(type(user_password))
          password = data_string['password']
          print(type(password))
          user_pass_hash = scrypt.encrypt(user_salt, user_password, maxtime=0.001)
          if search_result:
            print(user_password)
            print(scrypt.decrypt(user_password, password, maxtime=.001) == password)
            return str.encode('Succesful login.')
          else:
            return str.encode('Incorrect login.')
        else:
          print('User does not exist.')
          return str.encode(username + ' user does not exist. Please create a user account.')



