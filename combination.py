
class Combination:
    def __init__(self, id: int, combination: list):
        self.combination = combination
        self.id = id

    def count(self, sign: str):
        count = 0
        for cell in self.combination:
            if str(cell) == sign:
                count += 1
        return count

    # return combination ID
    def get_combination_id(self):
        return self.id

    # returning empty cell ID with higest winning probability
    def get_highest_probability_empty_cell_id(self):
        pr = 0
        for point in self.combination:
            if str(point) == "":
                local_pr = point.get_probability()
                if pr <= local_pr:
                    pr = local_pr
                    local_id = point.get_cell_id()
        return local_id

    def get_first_mem_combination(self):
        return self.combination[0]

    def get_second_mem_combination(self):
        return self.combination[1]

    def get_third_mem_combination(self):
        return self.combination[2]

    def get_fourth_mem_combination(self):
        return self.combination[3]
    def get_combination(self):
        return self.combination
