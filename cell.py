class Cell:

    # constructor
    def __init__(self, name: int, status: str, probability: int):
        self.name = name
        self.status = status
        self.probability = probability

    # set status of the cell
    def set_status(self, status: str):
        self.status = status

    # get status of the cell
    def __str__(self):
        return self.status

    # get the winning probability of the cell
    def get_probability(self):
        return self.probability
    # return cell id

    def get_cell_id(self):
        return self.name
