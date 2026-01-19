#!/usr/bin/env python3
"""
Tetris Game - Classic Tetris implementation in Python
Developed as part of personal website project
"""

import random
import time
import os
import sys

# Game constants
MAX_DEMO_MOVES = 100

# Tetromino shapes defined as 2D arrays
SHAPES = {
    'I': [[1, 1, 1, 1]],
    'O': [[1, 1],
          [1, 1]],
    'T': [[0, 1, 0],
          [1, 1, 1]],
    'S': [[0, 1, 1],
          [1, 1, 0]],
    'Z': [[1, 1, 0],
          [0, 1, 1]],
    'J': [[1, 0, 0],
          [1, 1, 1]],
    'L': [[0, 0, 1],
          [1, 1, 1]]
}

# Colors for terminal display (ANSI codes)
COLORS = {
    'I': '\033[96m',  # Cyan
    'O': '\033[93m',  # Yellow
    'T': '\033[95m',  # Magenta
    'S': '\033[92m',  # Green
    'Z': '\033[91m',  # Red
    'J': '\033[94m',  # Blue
    'L': '\033[33m',  # Orange
    'RESET': '\033[0m',
    'BOLD': '\033[1m'
}

class Tetris:
    def __init__(self, width=10, height=20):
        self.width = width
        self.height = height
        self.board = [[0 for _ in range(width)] for _ in range(height)]
        self.score = 0
        self.level = 1
        self.lines_cleared = 0
        self.game_over = False
        self.current_piece = None
        self.current_x = 0
        self.current_y = 0
        self.current_shape_name = ''
        self.spawn_piece()

    def spawn_piece(self):
        """Spawn a new tetromino at the top of the board"""
        self.current_shape_name = random.choice(list(SHAPES.keys()))
        self.current_piece = [row[:] for row in SHAPES[self.current_shape_name]]
        self.current_x = self.width // 2 - len(self.current_piece[0]) // 2
        self.current_y = 0
        
        if self.check_collision():
            self.game_over = True

    def check_collision(self, offset_x=0, offset_y=0, piece=None):
        """Check if the piece collides with the board or boundaries"""
        if piece is None:
            piece = self.current_piece
        
        for y, row in enumerate(piece):
            for x, cell in enumerate(row):
                if cell:
                    new_x = self.current_x + x + offset_x
                    new_y = self.current_y + y + offset_y
                    
                    if new_x < 0 or new_x >= self.width or new_y >= self.height:
                        return True
                    
                    if new_y >= 0 and self.board[new_y][new_x]:
                        return True
        return False

    def rotate_piece(self):
        """Rotate the current piece 90 degrees clockwise"""
        rotated = [[self.current_piece[y][x] 
                   for y in range(len(self.current_piece) - 1, -1, -1)]
                   for x in range(len(self.current_piece[0]))]
        
        if not self.check_collision(piece=rotated):
            self.current_piece = rotated
            return True
        return False

    def move_piece(self, dx, dy):
        """Move the current piece by dx, dy"""
        if not self.check_collision(dx, dy):
            self.current_x += dx
            self.current_y += dy
            return True
        return False

    def lock_piece(self):
        """Lock the current piece into the board"""
        for y, row in enumerate(self.current_piece):
            for x, cell in enumerate(row):
                if cell:
                    board_y = self.current_y + y
                    board_x = self.current_x + x
                    if board_y >= 0:
                        self.board[board_y][board_x] = self.current_shape_name

    def clear_lines(self):
        """Clear completed lines and update score"""
        lines_to_clear = []
        for y in range(self.height):
            if all(self.board[y]):
                lines_to_clear.append(y)
        
        for y in lines_to_clear:
            del self.board[y]
            self.board.insert(0, [0 for _ in range(self.width)])
        
        num_lines = len(lines_to_clear)
        if num_lines > 0:
            self.lines_cleared += num_lines
            # Scoring: 1 line = 100, 2 = 300, 3 = 500, 4 = 800
            points = [0, 100, 300, 500, 800]
            self.score += points[min(num_lines, 4)] * self.level
            self.level = 1 + self.lines_cleared // 10

    def drop_piece(self):
        """Move piece down one step"""
        if not self.move_piece(0, 1):
            self.lock_piece()
            self.clear_lines()
            self.spawn_piece()

    def hard_drop(self):
        """Drop piece to the bottom instantly"""
        while self.move_piece(0, 1):
            pass
        self.lock_piece()
        self.clear_lines()
        self.spawn_piece()

    def get_display_board(self):
        """Get board with current piece for display"""
        display = [row[:] for row in self.board]
        
        for y, row in enumerate(self.current_piece):
            for x, cell in enumerate(row):
                if cell:
                    board_y = self.current_y + y
                    board_x = self.current_x + x
                    if 0 <= board_y < self.height and 0 <= board_x < self.width:
                        display[board_y][board_x] = self.current_shape_name
        
        return display

    def render(self):
        """Render the game board to terminal"""
        os.system('clear' if os.name == 'posix' else 'cls')
        
        # Build header text and calculate padding
        header_text = f"TETRIS - Score: {self.score} | Level: {self.level} | Lines: {self.lines_cleared}"
        padding = self.width * 2 - len(header_text)
        
        print(f"{COLORS['BOLD']}{COLORS['Z']}╔{'═' * (self.width * 2)}╗{COLORS['RESET']}")
        print(f"{COLORS['BOLD']}{COLORS['Z']}║{COLORS['RESET']} " + 
              f"{COLORS['BOLD']}{header_text}{COLORS['RESET']}" + 
              " " * padding +
              f"{COLORS['BOLD']}{COLORS['Z']}║{COLORS['RESET']}")
        print(f"{COLORS['BOLD']}{COLORS['Z']}╠{'═' * (self.width * 2)}╣{COLORS['RESET']}")
        
        display = self.get_display_board()
        
        for row in display:
            print(f"{COLORS['BOLD']}{COLORS['Z']}║{COLORS['RESET']}", end='')
            for cell in row:
                if cell:
                    print(f"{COLORS[cell]}██{COLORS['RESET']}", end='')
                else:
                    print('  ', end='')
            print(f"{COLORS['BOLD']}{COLORS['Z']}║{COLORS['RESET']}")
        
        print(f"{COLORS['BOLD']}{COLORS['Z']}╚{'═' * (self.width * 2)}╝{COLORS['RESET']}")
        print(f"\n{COLORS['BOLD']}Controls:{COLORS['RESET']}")
        print("  A/D - Move Left/Right | W - Rotate | S - Soft Drop | Space - Hard Drop | Q - Quit")

def main():
    """Main game loop"""
    print(f"{COLORS['BOLD']}{COLORS['Z']}")
    print("=" * 50)
    print(" " * 15 + "TETRIS GAME")
    print("=" * 50)
    print(f"{COLORS['RESET']}\n")
    print("Welcome to Tetris!")
    print("\nThis is a simplified console version.")
    print("Note: For better gameplay, use a proper terminal-based input library.")
    print("\nPress Enter to start...")
    input()
    
    game = Tetris()
    
    print("\nStarting game...")
    print("Note: This version auto-plays for demonstration.")
    print("In a full implementation, you'd use keyboard input libraries.")
    
    # Auto-play demonstration
    moves = 0
    while not game.game_over and moves < MAX_DEMO_MOVES:
        game.render()
        time.sleep(0.3)
        
        # Simple AI: random moves
        action = random.choice(['left', 'right', 'rotate', 'drop'])
        if action == 'left':
            game.move_piece(-1, 0)
        elif action == 'right':
            game.move_piece(1, 0)
        elif action == 'rotate':
            game.rotate_piece()
        
        game.drop_piece()
        moves += 1
    
    game.render()
    print(f"\n{COLORS['BOLD']}{COLORS['Z']}GAME OVER!{COLORS['RESET']}")
    print(f"{COLORS['BOLD']}Final Score: {game.score}{COLORS['RESET']}")
    print(f"{COLORS['BOLD']}Lines Cleared: {game.lines_cleared}{COLORS['RESET']}")
    print(f"{COLORS['BOLD']}Level Reached: {game.level}{COLORS['RESET']}")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n\n{COLORS['BOLD']}Game interrupted. Thanks for playing!{COLORS['RESET']}")
        sys.exit(0)
