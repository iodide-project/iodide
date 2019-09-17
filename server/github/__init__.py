import requests


def get_github_user_data(login):
    r = requests.get(f"https://api.github.com/users/{login}")
    r.raise_for_status()
    return r.json()
