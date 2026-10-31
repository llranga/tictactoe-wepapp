class Player:
    # constructor
    def __init__(self, name: str, sign: str, priority: int):
        self.name = name
        self.sign = sign
        self.priority = priority

    def set_name(self, name: str):
        self.name = name

    def set_sign(self, sign: str):
        self.sign = sign

    def get_name(self):
        return self.name

    def get_sign(self):
        return self.sign

    def set_priority(self, priority: int):
        self.priority = priority

    def get_priority(self):
        return self.priority
