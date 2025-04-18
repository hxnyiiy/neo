from sqlalchemy import *
from sqlalchemy.orm import sessionmaker
import os.path
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.relpath("./")))
secret_file = os.path.join(BASE_DIR, '../../secret.json')

with open(secret_file) as f:
    secrets= json.loads(f.read())

def get_secret(setting, secrets=secrets):
    try:
        return secrets[setting]
    except KeyError:
        errorMsg = "Set the {} environment variable.".format(setting)
        return errorMsg

HOSTNAME = get_secret("Mysql_Hostname")
PORT = get_secret("Mysql_Port")
USER = get_secret("MYsql_User")
PASSWORD = get_secret("Mysql_Password")
DB_NAME = get_secret("Mysql_DBname")

DB_URI = f"mysql+pymysql://{USER}:{PASSWORD}@{HOSTNAME}:{PORT}/{DBname}"

class db_conn:
    def __init__(self):
        self.engine = create_engine(DB_URL, pool_recycle=500)

        def sessionmaker(self):
            Session = sessionmaker(bind=self.engine)
            session = Session()
            return session

        def connection(self):
            return self.engine.connect()
            return conn