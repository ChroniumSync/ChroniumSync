
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

def clear_old_sessions(expiration_sec=3600):
    now = time.time()
    expired = [sid for sid, s in session_storage.items() if now - s['created_at'] > expiration_sec]
    for sid in expired:
        del session_storage[sid]

def count_active_sessions():
    return sum(1 for s in session_storage.values() if s['active'])
