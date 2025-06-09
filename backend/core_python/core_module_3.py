
def evaluate_token_health(token):
    score = 100
    if token.get('mint_authority') == 'open':
        score -= 30
    if token.get('owner_changed_recently'):
        score -= 20
    if not token.get('liquidity_locked', True):
        score -= 25
    if token.get('blacklisted'):
        score -= 50
    return max(score, 0)

def scan_token_batch(token_list):
    return {token['id']: evaluate_token_health(token) for token in token_list}

def rank_tokens(batch_scores):
    return sorted(batch_scores.items(), key=lambda x: x[1], reverse=True)

def generate_token_flags(score):
    if score >= 90:
        return "🟢 Safe"
    elif score >= 60:
        return "🟡 Caution"
    else:
        return "🔴 High Risk"

def batch_with_flags(token_list):
    scores = scan_token_batch(token_list)
    return {tid: {"score": score, "flag": generate_token_flags(score)} for tid, score in scores.items()}
