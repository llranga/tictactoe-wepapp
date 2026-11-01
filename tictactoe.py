from player import Player
from combination import Combination
from cell import Cell
import random

import player


# initializing cells
c1 = Cell(1, "", 3)
c2 = Cell(2, "", 4)
c3 = Cell(3, "", 3)
c4 = Cell(4, "", 4)
c5 = Cell(5, "", 3)
c6 = Cell(6, "", 4)
c7 = Cell(7, "", 6)
c8 = Cell(8, "", 6)
c9 = Cell(9, "", 6)
c10 = Cell(10, "", 4)
c11 = Cell(11, "", 3)
c12 = Cell(12, "", 6)
c13 = Cell(13, "", 8)
c14 = Cell(14, "", 6)
c15 = Cell(15, "", 3)
c16 = Cell(16, "", 4)
c17 = Cell(17, "", 6)
c18 = Cell(18, "", 6)
c19 = Cell(19, "", 6)
c20 = Cell(20, "", 4)
c21 = Cell(21, "", 3)
c22 = Cell(22, "", 4)
c23 = Cell(23, "", 3)
c24 = Cell(24, "", 4)
c25 = Cell(25, "", 3)

cell_list = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12,
             c13, c14, c15, c16, c17, c18, c19, c20, c21, c22, c23, c24, c25]

# winning combinations
# possible winning combinations


co1 = Combination(1, [c17, c18, c19, c20])
co2 = Combination(2, [c10, c15, c20, c25])
co3 = Combination(3, [c7, c12, c17, c22])
co4 = Combination(4, [c1, c2, c3, c4])
co5 = Combination(5, [c2, c3, c4, c5])
co6 = Combination(6, [c1, c6, c11, c16])
co7 = Combination(7, [c9, c13, c17, c21])
co8 = Combination(8, [c10, c14, c18, c22])
co9 = Combination(9, [c7, c13, c19, c25])
co10 = Combination(10, [c2, c8, c14, c20])
co11 = Combination(11, [c2, c7, c12, c17])
co12 = Combination(12, [c3, c8, c13, c18])
co13 = Combination(13, [c21, c22, c23, c24])
co14 = Combination(14, [c11, c12, c13, c14])
co15 = Combination(15, [c8, c13, c18, c23])
co16 = Combination(16, [c1, c7, c13, c19])
co17 = Combination(17, [c4, c8, c12, c16])
co18 = Combination(18, [c4, c9, c14, c19])
co19 = Combination(19, [c22, c23, c24, c25])
co20 = Combination(20, [c12, c13, c14, c15])
co21 = Combination(21, [c9, c14, c19, c24])
co22 = Combination(22, [c6, c11, c16, c21])
co23 = Combination(23, [c5, c9, c13, c17])
co24 = Combination(24, [c16, c17, c18, c19])
co25 = Combination(24, [c5, c10, c15, c20])
co26 = Combination(26, [c6, c12, c18, c24])
co27 = Combination(27, [c7, c8, c9, c10])
co28 = Combination(27, [c6, c7, c8, c9])

combination_list = [co1, co2, co3, co4, co5, co6, co7, co8, co9, co10, co11, co12, co13,
                    co14, co15, co16, co17, co18, co19, co20, co21, co22, co23, co24, co25, co26, co27, co28]


# players
player1 = Player("Gagani", "O", 1)
player2 = Player("Vihangi", "X", 2)
# human or computer
opponenant_type="human"


# deside ist player
def decide_first_player(p1: Player, p2: Player):
    if p1.get_priority() > p2.get_priority():
        return p2
    else:
        return p1


active_player = decide_first_player(player1, player2)
counter = 0

# swap active player after each move
def swap_active_player(p1, p2):
    if active_player == p1:
        return p2
    else:
        return p1


# game logic
# check geme draw status
def status_draw():
    empty_cell_count=0
    status="draw"
    for cell in cell_list:
        if str(cell)=="":
            empty_cell_count+=1
    if empty_cell_count==0:
        return status


# check player is win? return 1 if win , 0 otherwise
def status_win():
    number = 0
    for item in combination_list:
        if item.count(active_player.get_sign()) == 4:
            number = 1
            break
    return number

# return combination which is already won in form of array of cell ids
def get_win_combination():
    for item in combination_list:
        if item.count(active_player.get_sign()) == 4:
            cell_list = item.get_combination()
            cell_indexes = [cell.get_cell_id() for cell in cell_list]
            break
    return cell_indexes

# reset the game board
def reset_board():
    for i in cell_list:
        i.set_status("") 
    #decide defulat first player
    global active_player
    active_player = decide_first_player(player1, player2)
    global counter
    counter = 0

    #check if the computer is the first player and make its move
    if opponenant_type == "computer" and player2.get_priority() == 1:
        cell_index=get_comuter_first_move()
        #print(cell_index)
        sign = player2.get_sign()
        print(sign)
        active_player = swap_active_player(player1, player2)  # Switch back to human for the next round
        print(active_player.get_sign())
        print("Active player after settings update:", active_player.get_name())
        return {"status": "success", "sign": sign, "active_player_name": active_player.get_name(), "cell_index": cell_index}
    else:        
        return {"status": "success", "active_player_name": active_player.get_name()}

def update_settings(data):
    opponant_t = data.get("opponent")
    who_plays_first = data.get("who_plays_first")
    p1_name = data.get("p1_name")
    p2_name = data.get("p2_name")
    opponent_sign = data.get("opponent_sign")

    #uodate the global opponant_type variable
    global opponenant_type
    global player1, player2, active_player
    opponenant_type = (opponant_t)
    # Update player settings
    player1.set_name(p1_name)
    player2.set_name(p2_name)
    player2.set_sign(opponent_sign)

    #set player1 sign based on player2 sign
    if opponent_sign == "X":
        player1.set_sign("O")
    else:
        player1.set_sign("X")

    #set who plays first
    if who_plays_first == "player1":
        player1.set_priority(1)
        player2.set_priority(2)
    else:
        player1.set_priority(2)
        player2.set_priority(1)

    active_player = decide_first_player(player1, player2)
    print("Active player after settings update:", active_player.get_name())
    #reset_board
    for i in cell_list:
            i.set_status("")
    global counter
    counter = 0

    #check if the computer is the first player and make its move
    if opponenant_type == "computer" and player2.get_priority() == 1:
        cell_index=get_comuter_first_move()
        #print(cell_index)
        sign = player2.get_sign()
        print(sign)
        active_player = swap_active_player(player1, player2)  # Switch back to human for the next round
        print(active_player.get_sign())
        print("Active player after settings update:", active_player.get_name())
        return {"status": "success", "sign": sign, "active_player_name": active_player.get_name(), "cell_index": cell_index}
    else:
        return {"status": "success", "active_player_name": active_player.get_name()}

     

  
       
def get_comuter_first_move():
    if opponenant_type=="computer" and player2.get_priority()==1:
            #active_player = player2
            #active_player.set_name("agnAp")
            
            # cell decided by the computer
            cell_index=other_move(player2.get_sign(),player1.get_sign())
            cell_list[(cell_index-1)].set_status(player2.get_sign())
            return (cell_index)
            
            

      
# game logic

def other_move(player_piece: str, opponant_piece: str):
    # make player wining move
    c_id=0
    move_status = True
    for item in combination_list:
        if item.count(player_piece) == 3 and item.count(opponant_piece) == 0:
            cell_id = item.get_highest_probability_empty_cell_id()
            print(cell_id)
            c_id=cell_id
            cell_list[(cell_id-1)].set_status(player_piece)
            move_status = False
            break
    # prevent opponant's wining move
    if move_status == True:
        for item in combination_list:
            if item.count(opponant_piece) == 3 and item.count(player_piece) == 0:
                cell_id = item.get_highest_probability_empty_cell_id()
                print(cell_id)
                c_id=cell_id
                cell_list[(cell_id-1)].set_status(player_piece)
                move_status = False
                break
    # defence move when opponenant got 2 cells ------- addition
    if move_status == True:
        tempory_cell_list = []
        for item in combination_list:
            if item.count(player_piece) == 0 and item.count(opponant_piece) == 2:
                cell_id = item.get_highest_probability_empty_cell_id()
                # tempory list with highest possibility winnng cells from each relavant combinations
                tempory_cell_list.append(cell_list[(cell_id-1)])
        higest_prob = 0
        # if tempory list is empty
        if not tempory_cell_list:
            move_status = True
        else:
            for item in tempory_cell_list:
                if item.get_probability() >= higest_prob:
                    higest_prob = item.get_probability()
        # might be more than one cell having same highest probability
            h_p_list = []
            for item in tempory_cell_list:
                if item.get_probability() == higest_prob:
                    h_p_list.append(item)
            # getting random choise from cells having same probability
            cell = random.choice(h_p_list)
            cell.set_status(player_piece)
            print(cell.get_cell_id())
            c_id=cell.get_cell_id()
            move_status = False
    # end of defencemove (additon)
    # making player 2nd best move
    if move_status == True:
        tempory_cell_list = []
        for item in combination_list:
            if item.count(player_piece) == 2 and item.count(opponant_piece) == 0:
                cell_id = item.get_highest_probability_empty_cell_id()
                # tempory list with highest possibility winnng cells from each relavant combinations
                tempory_cell_list.append(cell_list[(cell_id-1)])
        higest_prob = 0
        # if tempory list is empty
        if not tempory_cell_list:
            move_status = True
        else:
            for item in tempory_cell_list:
                if item.get_probability() >= higest_prob:
                    higest_prob = item.get_probability()
        # might be more than one cell having same highest probability
            h_p_list = []
            for item in tempory_cell_list:
                if item.get_probability() == higest_prob:
                    h_p_list.append(item)
            # getting random choise from cells having same probability
            cell = random.choice(h_p_list)
            cell.set_status(player_piece)
            print(cell.get_cell_id())
            c_id=cell.get_cell_id()
            move_status = False
    # making 3rd best move
    if move_status == True:
        tempory_cell_list = []
        for item in combination_list:
            if item.count(player_piece) == 1 and item.count(opponant_piece) == 0:
                cell_id = item.get_highest_probability_empty_cell_id()
                tempory_cell_list.append(cell_list[(cell_id-1)])
        higest_prob = 0
        # if tempory list is empty
        if not tempory_cell_list:
            move_status = True
        else:
            for item in tempory_cell_list:
                if item.get_probability() >= higest_prob:
                    higest_prob = item.get_probability()
        # might be more than one cell having same highest probability
            h_p_list = []
            for item in tempory_cell_list:
                if item.get_probability() == higest_prob:
                    h_p_list.append(item)
            # getting random choise from cells having same probability
            cell = random.choice(h_p_list)
            cell.set_status(player_piece)
            print(cell.get_cell_id())
            c_id=cell.get_cell_id()
            move_status = False
    # making the first move
    if move_status == True:
        tempory_cell_list = []
        for item in combination_list:
            if item.count(player_piece) == 0 and item.count(opponant_piece) == 0:
                cell_id = item.get_highest_probability_empty_cell_id()
                tempory_cell_list.append(cell_list[(cell_id-1)])
        higest_prob = 0
        # if tempory list is empty
        if not tempory_cell_list:
            move_status = True
        else:
            for item in tempory_cell_list:
                if item.get_probability() >= higest_prob:
                    higest_prob = item.get_probability()
        # might be more than one cell having same highest probability
            h_p_list = []
            for item in tempory_cell_list:
                if item.get_probability() == higest_prob:
                    h_p_list.append(item)
            # getting random choise from cells having same probability
            cell = random.choice(h_p_list)
            cell.set_status(player_piece)
            print(cell.get_cell_id())
            c_id=cell.get_cell_id()
            move_status = False
    #making moves (no chance of wining. game will be draw. no more wining combinations available)
    if move_status == True:
        tempory_cell_list = []
        for item in cell_list:
            if str(item)=="":
                tempory_cell_list.append(cell_list[item.get_cell_id()-1])
        if not tempory_cell_list:
            move_status=False
            # no more empty cells
        else:
            cell=random.choice(tempory_cell_list)
            cell.set_status(player_piece)
            print(cell.get_cell_id())
            c_id=cell.get_cell_id()
            move_status = False

    return c_id
 # end of game logic    

#function to communicate with the flask app
def process_player_move(cell_id):
    global active_player
    global counter
    
    #check if the cell is already marked
    if str(cell_list[cell_id - 1]) != "":
        return {"status": "error", "message": "Cell is already marked."}
    else:
        # Mark the cell with the active player's sign
        cell_list[cell_id - 1].set_status(active_player.get_sign())
        #get the sign of the active player
        human_sign = active_player.get_sign()
        counter += 1

        # Check for win or draw
        if status_win() == 1:
            return {"status": "win", "sign": human_sign, "combination": get_win_combination(),"active_player": active_player.get_name()}
        elif status_draw() == "draw":
            return {"status": "draw","sign": human_sign}
        '''else:
            # Swap active player
            active_player = swap_active_player(player1, player2)
            return {"status": "continue", "active_player": active_player.get_name(), "sign": sign} '''  
    
    #computer move from step 2 if game is not over
    computer_cell_index = None
    computer_sign = None
    
    if opponenant_type == "computer":
    #temporaly switch active player to computer for the move
        active_player = swap_active_player(player1, player2)
        # cell decided by the computer
        computer_cell_index=other_move(player2.get_sign(),player1.get_sign())
        print("Computer chose cell index:", computer_cell_index)
    
        if computer_cell_index is not None:
            computer_sign = player2.get_sign()
            cell_list[(computer_cell_index - 1)].set_status(computer_sign)
            counter += 1

            # Check if computer won or drew on its turn
            if status_win() == 1:
                        return {"status": "win",
                                 "computer_sign": computer_sign,
                                 "sign": human_sign,
                                 "human_cell:": cell_id,
                                 "cell_index": computer_cell_index,
                                   "combination": get_win_combination(),
                                   "active_player": player2.get_name()}
            elif status_draw() == "draw":
                        return {"status": "draw",
                                "sign": human_sign,
                                "computer_sign": computer_sign,
                                "human_cell:": cell_id,
                                "cell_index": computer_cell_index}
    # Switch back to human for the next round
    active_player = swap_active_player(player1, player2)

    # 5. Normal game continuation
    return {
        "status": "continue", 
        "human_cell": cell_id,
        "sign": human_sign,
        "cell_index": computer_cell_index,
        "computer_sign": computer_sign,
        "active_player": active_player.get_name()
    }
    
                       
            
                   
            


        

