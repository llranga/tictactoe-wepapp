from flask import Flask, render_template, request, jsonify
import os
import player
import tictactoe

app = Flask(__name__)

@app.route("/")
def index():
    # Passing numbers 1 through 25 to the template
    # get the first player to start the game
    player=tictactoe.decide_first_player(tictactoe.player1, tictactoe.player2)
    #pass the active player name to the template
    return render_template("index.html", total_buttons=range(1, 26), active_player=player.get_name())

@app.route("/calculate", methods=["POST"])
def calculate():
    # 1. Get JSON data sent from JavaScript
    data = request.get_json()
    button_index = int(data.get("index", 0))
    
    # 2. Send the data to logic.py and get the result back
    result_data = tictactoe.process_player_move(button_index)
    
    # Return result as JSON
    return jsonify(result_data)

@app.route("/reset", methods=["POST"])
def reset():
    result_data = tictactoe.reset_board()
    return jsonify(result_data)

@app.route("/save-settings", methods=["POST"])
def save_settings():
    # Receive settings from JavaScript, update logic, and reset board
    data = request.get_json()
    result_data = tictactoe.update_settings(data)
    return jsonify(result_data)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)