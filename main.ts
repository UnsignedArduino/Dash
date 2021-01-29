namespace StatusBarKind {
    export const Progress = StatusBarKind.create()
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    jump(sprite_player, constants_gravity, constants_tiles_high_jump)
})
scene.onHitWall(SpriteKind.Player, function (sprite, location) {
    if (sprite.isHittingTile(CollisionDirection.Bottom)) {
        jumps = 0
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    jump(sprite_player, constants_gravity, constants_tiles_high_jump)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`top_spike`, function (sprite, location) {
    sprite.destroy(effects.disintegrate, 100)
})
function win () {
    sprite_player_cam.setVelocity(0, 0)
    won = true
    timer.after(2000, function () {
        game.over(true)
    })
}
function create_status_bar (sprite: Sprite, tilemap_length: number) {
    sprite_progress_bar = statusbars.create(127, 4, StatusBarKind.Progress)
    sprite_progress_bar.setFlag(SpriteFlag.RelativeToCamera, true)
    sprite_progress_bar.left = 4
    sprite_progress_bar.top = 4
    sprite_progress_bar.value = 0
    sprite_progress_bar.max = tilemap_length
    sprite_progress_bar.setColor(7, 12)
    sprite_progress_bar.setBarBorder(1, 12)
    timer.background(function () {
        while (true) {
            sprite_progress_bar.value = sprite.x
            percent_traveled = Math.round(Math.map(sprite.x, 0, tilemap_length, 0, 100))
            if (percent_traveled < 10) {
                sprite_progress_bar.setLabel("" + percent_traveled + "%" + "  ", 15)
            } else if (percent_traveled < 100) {
                sprite_progress_bar.setLabel("" + percent_traveled + "%" + " ", 15)
            } else {
                sprite_progress_bar.setLabel("" + percent_traveled + "%", 15)
            }
            pause(100)
        }
    })
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`flag_bottom`, function (sprite, location) {
    win()
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`flag_top`, function (sprite, location) {
    win()
})
function make_player () {
    sprite_player = sprites.create(assets.image`character`, SpriteKind.Player)
    sprite_player_cam = sprites.create(assets.image`camera_reference`, SpriteKind.Player)
    sprite_player.setFlag(SpriteFlag.AutoDestroy, true)
    sprite_player_cam.setFlag(SpriteFlag.Ghost, true)
    scene.cameraFollowSprite(sprite_player_cam)
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`bottom_spike`, function (sprite, location) {
    sprite.destroy(effects.disintegrate, 100)
})
function jump (sprite: Sprite, gravity: number, tiles2: number) {
    if (jumps < constants_max_jumps) {
        sprite.vy = 0 - Math.sqrt(2 * (gravity * (tiles2 * tiles.tileWidth())))
        jumps += 1
        timer.background(function () {
            timer.throttle("rotate", 100, function () {
                for (let index = 0; index < 36; index++) {
                    transformSprites.changeRotation(sprite_player, 10)
                    pause(10)
                }
            })
        })
    }
}
function fade (_in: boolean, duration: number, block: boolean) {
    if (_in) {
        color.startFade(color.originalPalette, color.Black, duration)
    } else {
        color.startFade(color.Black, color.originalPalette, duration)
    }
    if (block) {
        color.pauseUntilFadeDone()
    }
}
sprites.onDestroyed(SpriteKind.Player, function (sprite) {
    sprite_player_cam.setVelocity(0, 0)
    timer.after(2000, function () {
        game.over(false)
    })
})
function level_1 () {
    tiles.setSmallTilemap(tilemap`level1`)
    scene.setBackgroundColor(13)
    tiles.placeOnRandomTile(sprite_player, assets.tile`start`)
    tiles.placeOnRandomTile(sprite_player_cam, assets.tile`start`)
    tiles.setTileAt(tiles.getTilesByType(assets.tile`start`)[0], assets.tile`transparency8`)
    sprite_player.setVelocity(48, 0)
    sprite_player_cam.setVelocity(48, 0)
    sprite_player.ay = constants_gravity
    create_status_bar(sprite_player, tiles.tilemapColumns() * tiles.tileWidth())
}
let percent_traveled = 0
let sprite_progress_bar: StatusBarSprite = null
let sprite_player_cam: Sprite = null
let sprite_player: Sprite = null
let won = false
let jumps = 0
let constants_max_jumps = 0
let constants_tiles_high_jump = 0
let constants_gravity = 0
color.setPalette(
color.Black
)
constants_gravity = 300
constants_tiles_high_jump = 3
constants_max_jumps = 2
jumps = 0
won = false
make_player()
level_1()
fade(false, 2000, false)
game.onUpdate(function () {
    sprite_player.vx = 48
})
game.onUpdateInterval(100, function () {
    if (!(won)) {
        if (sprite_player.x > sprite_player_cam.x) {
            sprite_player.x += -1
        } else if (sprite_player.x < sprite_player_cam.x) {
            sprite_player.x += 1
        }
    }
})
