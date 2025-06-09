
import uuid
import time

session_storage = {}

def create_session(user_id):
    session_id = str(uuid.uuid4())
    session_storage[session_id] = {
        "user": user_id,
        "created_at": time.time(),
        "active": True
    }
    return session_id

def terminate_session(session_id):
    if session_id in session_storage:
        session_storage[session_id]['active'] = False
        return True
    return False

def is_session_active(session_id):
    session = session_storage.get(session_id)
    return session and session.get('active', False)
