from app.controllers.guide import server
import settings

if __name__ == '__main__':
    server.start(debug=settings.DEBUG)

# from app.controllers.guide import app
# import settings
#
# if __name__ == '__main__':
#     app.run()
