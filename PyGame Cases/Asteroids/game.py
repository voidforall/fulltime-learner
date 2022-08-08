import pygame, sys, os, random, math
from pygame.locals import *

pygame.init()
fps = pygame. time.Clock()

#colors
WHITE = (255,255,255)
RED = (255,0,0)
GREEN = (0,255,0)
BLACK = (0,0,0)

#globals
WIDTH = 800
HEIGHT = 600      
time = 0

#canvas declaration
window = pygame.display.set_mode((WIDTH, HEIGHT), 0, 32)
pygame.display.set_caption('Asteroids')

#load images
bg = pygame.image.load(os.path.join('images','bg.jpg'))
debris = pygame.image.load(os.path.join('images','debris2_brown.png'))
ship = pygame.image.load(os.path.join('images','ship.png'))

ship_x = WIDTH/2 - 50
ship_y = HEIGHT/2 - 50
ship_angle = 0
ship_is_rotating = False
ship_is_forward = False
ship_direction = 0
ship_speed = 0

def rot_center(image, angle):
    """rotate image with some degress"""

    orig_rect = image.get_rect()
    rot_image = pygame.transform.rotate(image, angle)
    rot_rect = orig_rect.copy()
    rot_rect.center = rot_image.get_rect().center
    rot_image = rot_image.subsurface(rot_rect).copy()
    return rot_image

# draw game function
def draw(canvas):
    global time
    canvas.fill(BLACK)
    canvas.blit(bg,(0,0))
    canvas.blit(debris,(time*.3,0))
    canvas.blit(debris,(time*.3-WIDTH,0))
    time = time + 1

    canvas.blit(rot_center(ship, ship_angle), (ship_x, ship_y))

# handle input function
def handle_input():
    global ship_angle, ship_is_rotating, ship_direction
    global ship_x, ship_y, ship_speed, ship_is_forward

    for event in pygame.event.get():
        if event.type == QUIT:
            pygame.quit()
            sys.exit()   
        elif event.type == KEYDOWN:
            if event.key == K_RIGHT:
                ship_is_rotating = True
                ship_direction = 0
            elif event.key == K_LEFT:
                ship_is_rotating = True
                ship_direction = 1
            elif event.key == K_UP:
                ship_is_forward = True
                ship_speed = 10

        elif event.type == KEYUP:
            if event.key == K_LEFT or event.key == K_RIGHT:
                ship_is_rotating = False
            else:
                ship_is_forward = False

        print(ship_angle)

    if ship_is_rotating:
        if ship_direction == 0:
            ship_angle = ship_angle - 10    
        else:
            ship_angle = ship_angle + 10        

    if ship_is_forward or ship_speed > 0:
        ship_x = (ship_x + math.cos(math.radians(ship_angle))*ship_speed )
        ship_y = (ship_y + -math.sin(math.radians(ship_angle))*ship_speed )
        if ship_is_forward == False:
            ship_speed = ship_speed - 0.2

def update_screen():
    pygame.display.update()
    fps.tick(60)

# asteroids game loop
while True:
    draw(window)
    handle_input()
    # game_logic()
    update_screen()