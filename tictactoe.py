from player import Player
from combination import Combination
from cell import Cell
import random


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
# val=1 human player, val=2 computer player
opponenant_type=1


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


# Tuple with cellobject, int x int y coordinates. (cell object, x, y)
board = [(c1, 0, 0), (c2, 0, 1), (c3, 0, 2), (c4, 0, 3), (c5, 0, 4),
         (c6, 1, 0), (c7, 1, 1), (c8, 1, 2), (c9, 1, 3), (c10, 1, 4),
         (c11, 2, 0), (c12, 2, 1), (c13, 2, 2), (c14, 2, 3), (c15, 2, 4),
         (c16, 3, 0), (c17, 3, 1), (c18, 3, 2), (c19, 3, 3), (c20, 3, 4),
         (c21, 4, 0), (c22, 4, 1), (c23, 4, 2), (c24, 4, 3), (c25, 4, 4)]


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
    return {"status": "continue", "active_player": active_player.get_name()} 

def update_settings(data):
    opponant_t = data.get("opponent")
    who_plays_first = data.get("who_plays_first")
    p1_name = data.get("p1_name")
    p2_name = data.get("p2_name")
    opponent_sign = data.get("opponent_sign")

    #uodate the global opponant_type variable
    global opponenant_type
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

    player = decide_first_player(player1, player2)

    #reset_board
    for i in cell_list:
            i.set_status("")
    global counter
    counter = 0

    print(opponenant_type)
    #print(who_plays_first)
    #print(player.get_name())
    return {"status": "success", "active_player_name": player.get_name()}
  
       
def com_first_move():
    if opponenant_type==2 and player2.get_priority()==1:
            active_player = player2
            player2.set_name("agnAp")
            
            # cell decided by the computer
            c=other_move(player2.get_sign(),player1.get_sign())
            cell_list[(c-1)].set_status(player2.get_sign())
            print(c)
            
            

# event handling
def update_setting(opponant_type,who_play_first,my_name,opponat_name,my_sign):
        player1
        player2
        global opponenant_type
        global active_player
        print(opponant_type)
        if opponant_type==1:
            opponenant_type=1
        else:
            opponenant_type=2

        
        if who_play_first==3:
            #print(who_play_first)
            player1.set_priority(1)
            player2.set_priority(2)
        else:
            #print(who_play_first)
            player1.set_priority(2)
            player2.set_priority(1)
        #print(my_name)
        player1.set_name(my_name)
        #print(opponat_name)
        if opponant_type==1:
            player2.set_name(opponat_name)
        else:
            player2.set_name("agnAp")
        #print(my_sign)
        if my_sign=="X":
            player1.set_sign("X")
            player2.set_sign("O")
        else:
            player1.set_sign("O")
            player2.set_sign("X")

        active_player = decide_first_player(player1,player2)
        print(opponenant_type)
        if opponenant_type==2 and player2.get_priority()==1:
            active_player = player2
            player2.set_name("agnAp")
            
            # cell decided by the computer
            c=other_move(player2.get_sign(),player1.get_sign())
            cell_list[(c-1)].set_status(player2.get_sign())
            print(c)
            # cell decided by computer is marked on the board
            l_x = (board[c-1])[1]
            l_y = (board[c-1])[2]
            

        
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
        sign = active_player.get_sign()
        counter += 1

        # Check for win or draw
        if status_win() == 1:
            return {"status": "win", "sign": sign, "combination": get_win_combination(),"active_player": active_player.get_name()}
        elif status_draw() == "draw":
            return {"status": "draw","sign": sign}
        else:
            # Swap active player
            active_player = swap_active_player(player1, player2)
        return {"status": "continue", "active_player": active_player.get_name(), "sign": sign}   
        
            


        

