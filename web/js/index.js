let showGrid = true // Flag to toggle the grid on/off
let zoomLevel = 1 // Zoom level for scaling the grid and objects
let gridSpacing = 50 // Base grid spacing (1 unit equals 50px)

const hajo = ["raven", "genesis", "star", "marduc", "perilous", "executor", "invader"]
const height = document.body.clientHeight
const width = document.body.clientWidth

// Array of user-defined objects (celestial bodies)
const userDefinedObjects = [{
        color: 'red',
        x: 8.25,
        y: 22.54,
        name: 'Mars'
    },
    {
        color: 'blue',
        x: 15.67,
        y: 7.24,
        name: 'HR 2061 Alpha Orionis'
    },
    {
        color: 'yellow',
        x: 18.84,
        y: 22.56,
        name: 'Jupiter'
    },
    {
        color: 'orange',
        x: 14.8,
        y: 16.33,
        name: 'Aldebaran'
    },
    {
        color: 'purple',
        x: 14.89,
        y: 22.49,
        name: 'Alioth'
    },
    {
        color: 'cyan',
        x: 15.61,
        y: 19.21,
        name: 'Polaris'
    },
    {
        color: 'cyan',
        x: 14.99,
        y: 23.11,
        name: 'Alkaid'
    },
    {
        color: 'cyan',
        x: 14.37,
        y: 14.48,
        name: 'Vega'
    },
    {
        color: 'cyan',
        x: 9.63,
        y: -1.58,
        name: 'Neptune'
    },
    {
        color: 'cyan',
        x: 14.38,
        y: -23.29,
        name: 'Formalhaut'
    },
]

// Ship data including their paths
const ships = [{
        name: 'HMS Raven',
        from: {
            x: 14.8,
            y: 16.33
        },
        to: {
            x: 14.8,
            y: 16.33
        }
    }, // Aldebaran
    {
        name: 'BS Genesis',
        from: {
            x: 14.8,
            y: 16.33
        },
        to: {
            x: 14.37,
            y: -29.29
        }
    }, // Aldebaran to Formalhaut
    {
        name: 'BS Marduk',
        from: {
            x: 14.8,
            y: 16.33
        },
        to: {
            x: 14.37,
            y: -29.29
        }
    }, // Aldebaran to Formalhaut
    {
        name: 'BC Star Talon',
        from: {
            x: 14.37,
            y: -29.29
        },
        to: {
            x: 8.25,
            y: 22.54
        }
    }, // Formalhaut to Mars
    {
        name: 'ISS Perilous',
        from: {
            x: 14.8,
            y: 16.33
        },
        to: {
            x: 14.37,
            y: 38.48
        }
    }, // Aldebaran to Vega
    {
        name: 'BC Executor',
        from: {
            x: 14.37,
            y: 38.48
        },
        to: {
            x: 14.89,
            y: 55.49
        }
    }, // Vega to Alioth
    {
        name: 'BS Invader',
        from: {
            x: 14.89,
            y: 55.49
        },
        to: {
            x: 9.63,
            y: -1.58
        }
    }, // Alioth to Neptune
    {
        name: 'ISS Perilous',
        from: {
            x: 14.37,
            y: 38.48
        },
        to: {
            x: 9.63,
            y: -1.58
        }
    }, // Vega to Neptune
    {
        name: 'BS Invader',
        from: {
            x: 14.89,
            y: 55.49
        },
        to: {
            x: 9.63,
            y: -1.58
        }
    }, // Alioth to Neptune
    {
        name: 'BS Invader',
        from: {
            x: 9.63,
            y: -1.58
        },
        to: {
            x: 0,
            y: 0
        }
    }, // Neptune to Earth
    {
        name: 'ISS Perilous',
        from: {
            x: 9.63,
            y: -1.58
        },
        to: {
            x: 0,
            y: 0
        }
    }, // Neptune to Earth
]

// Function to draw the grid
/**
 * Draws the grid on the canvas.
 *
 * @param {CanvasRenderingContext2D} c1 - The 2D rendering context of the canvas.
 * @param {number} width - The width of the canvas.
 * @param {number} height - The height of the canvas.
 * @returns {void} This function does not return any value.
 */
function drawGrid(c1, width, height) {
    const scaledGridSpacing = gridSpacing * zoomLevel
    c1.strokeStyle = 'lightgray'
    c1.lineWidth = 0.5

    // Draw vertical lines
    for (let x = 0; x <= width; x += scaledGridSpacing) {
        c1.beginPath()
        c1.moveTo(x, 0)
        c1.lineTo(x, height)
        c1.stroke()
    }

    // Draw horizontal lines
    for (let y = 0; y <= height; y += scaledGridSpacing) {
        c1.beginPath()
        c1.moveTo(0, y)
        c1.lineTo(width, y)
        c1.stroke()
    }

    // Draw the x and y axes
    c1.strokeStyle = 'white'
    c1.lineWidth = 1

    // Y-axis
    c1.beginPath()
    c1.moveTo(width / 2, 0)
    c1.lineTo(width / 2, height)
    c1.stroke()

    // X-axis
    c1.beginPath()
    c1.moveTo(0, height / 2)
    c1.lineTo(width, height / 2)
    c1.stroke()
}

/**
 * Draws the ship routes on the canvas.
 *
 * @param {CanvasRenderingContext2D} c1 - The 2D rendering context of the canvas.
 * @returns {void} This function does not return any value.
 */
function drawShipRoutes(c1) {
    ships.forEach(ship => {
        const startX = -(ship.from.x * 10 / zoomLevel)
        const startY = -(ship.from.y * 10 / zoomLevel)
        const endX = -(ship.to.x * 10 / zoomLevel)
        const endY = -(ship.to.y * 10 / zoomLevel)

        // Set dashed line for the route
        c1.setLineDash([5, 5]) // Dashed line pattern
        c1.strokeStyle = 'white' // Line color
        c1.lineWidth = 1

        c1.beginPath()
        c1.moveTo(startX, startY)
        c1.lineTo(endX, endY)
        c1.stroke()
        c1.setLineDash([])
    })
}

/**
 * Draws the entire scene on the canvas, including the background, grid, Earth,
 * user-defined objects, and ship routes.
 *
 * @returns {void} This function does not return any value.
 */
function draw() {
    const c = document.getElementById("canvas")
    const c1 = c.getContext("2d")

    // Clear the canvas before each draw
    c1.clearRect(0, 0, c.width, c.height)

    // Apply scaling based on zoom level
    c1.save()
    c1.scale(zoomLevel, zoomLevel)

    // Draw background
    c1.fillStyle = "black"
    c1.fillRect(0, 0, c.width, c.height)

    // Optionally draw the coordinate system
    if (showGrid) {
        drawGrid(c1, c.width / zoomLevel, c.height / zoomLevel)
    }

    // Move to the center and draw the green circle (Earth)
    c1.translate((c.width / 2) / zoomLevel, (c.height / 2) / zoomLevel)
    c1.beginPath()
    c1.arc(0, 0, 50, 0, Math.PI * 2, true)
    c1.fillStyle = "green"
    c1.fill()

    // Draw user-defined objects (celestial bodies)
    userDefinedObjects.forEach(obj => {
        const posX = -((obj.x * 10) / zoomLevel)
        const posY = -((obj.y * 10) / zoomLevel)

        // Draw the celestial body
        c1.beginPath()
        c1.arc(posX, posY, 15, 0, Math.PI * 2, true)
        c1.fillStyle = obj.color
        c1.fill()

        // Draw the name above the celestial body
        c1.fillStyle = 'white'
        c1.font = '12px Arial'
        c1.textAlign = 'center'
        c1.fillText(obj.name, posX, posY - 20)
    })

    // Draw ship routes
    drawShipRoutes(c1)

    // Restore canvas state
    c1.restore()
}

/**
 * Handles zooming in and out based on the mouse wheel event.
 * Increases or decreases the zoom level based on the scroll direction.
 *
 * @param {WheelEvent} event - The event object representing the mouse wheel event.
 * @returns {void} This function does not return any value.
 */
function handleZoom(event) {
    if (event.deltaY < 0) {
        zoomLevel *= 1.1 // Zoom in
    } else {
        zoomLevel /= 1.1 // Zoom out
    }
}

/**
 * Listens for keydown events and performs specific actions based on the pressed key.
 * Toggles the visibility of the grid when 'g' is pressed, zooms in when '+' is pressed,
 * and zooms out when '-' is pressed.
 *
 * @param {KeyboardEvent} event - The event object representing the keydown event.
 * @returns {void} This function does not return any value.
 */
document.addEventListener('keydown', (event) => {
    if (event.key === 'g') {
        showGrid = !showGrid // Toggle grid
    } else if (event.key === '+') {
        zoomLevel *= 1.1 // Zoom in with +
    } else if (event.key === '-') {
        zoomLevel /= 1.1 // Zoom out with -
    }
})

// Mouse wheel zoom
document.getElementById("canvas")

const canvas = document.getElementById('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

setInterval(draw, 100)

/**
 * Sets the visibility of specific user-defined objects (celestial bodies) to "visible".
 * This function iterates through the array of celestial body IDs and sets their CSS visibility property
 * to "visible", effectively making them visible on the canvas.
 *
 * @returns {void} This function does not return any value.
 */
function setVisible() {
    for (var i = 0; i < hajo.length; i++) {
        document.getElementById(hajo[i]).style.visibility = "visible";
    }
}

/**
 * Moves specific user-defined objects (celestial bodies) to a designated position on the canvas.
 * This function iterates through the array of celestial body IDs and sets their CSS top and left properties
 * to position them at specific coordinates based on their names.
 *
 * @returns {void} This function does not return any value.
 */
function move1() {
    setVisible()
    console.log(height, width)
    for (var i = 0; i < hajo.length; i++) {
        console.log(hajo[i])
        document.getElementById(hajo[i]).style.top = height / 2 - (20.79 * 10) + "px"
        document.getElementById(hajo[i]).style.left = width / 2 - (16.33 * 10) + "px"
    }
}

/**
 * Moves specific user-defined objects (celestial bodies) to a designated position on the canvas.
 * This function iterates through the array of celestial body IDs and sets their CSS top and left properties
 * to position them at specific coordinates based on their names.
 *
 * @param {string[]} hajo - An array of celestial body IDs.
 * @param {number} width - The width of the canvas.
 * @param {number} height - The height of the canvas.
 * @returns {void} This function does not return any value.
 */
function move2() {
    for (var i = 0; i < hajo.length; i++) {
        console.log(hajo[i])
        if (hajo[i] == "genesis" || hajo[i] == "marduc" || hajo[i] == "star") {
            document.getElementById(hajo[i]).style.left = width / 2 - (16.37 * 10) + "px"
            document.getElementById(hajo[i]).style.top = (height / 2 + 190) + "px"
        } else {
            document.getElementById(hajo[i]).style.left = width / 2 - (15.37 * 10) + "px"
            document.getElementById(hajo[i]).style.top = (height / 2 - 150) + "px"
        }
    }
}

/**
 * Moves specific user-defined objects (celestial bodies) to a designated position on the canvas.
 * This function iterates through the array of celestial body IDs and sets their CSS top and left properties
 * to position them at specific coordinates based on their names.
 *
 * @param {string[]} hajo - An array of celestial body IDs.
 * @param {number} width - The width of the canvas.
 * @param {number} height - The height of the canvas.
 * @returns {void} This function does not return any value.
 */
function move3() {
    for (var i = 0; i < hajo.length; i++) {
        console.log(hajo[i])
        if (hajo[i] == "genesis" || hajo[i] == "marduc") {
            document.getElementById(hajo[i]).style.left = width / 2 - (15.37 * 10) + "px"
            document.getElementById(hajo[i]).style.top = (height / 2 - 100) + "px"
        } else if (hajo[i] == "executor" || hajo[i] == "Invader") {
            document.getElementById(hajo[i]).style.left = width / 2 - (15.37 * 10) + "px"
            document.getElementById(hajo[i]).style.top = (height / 2 - 250) + "px"
        }
    }
}

/**
 * Moves specific user-defined objects (celestial bodies) to a designated position on the canvas.
 * This function iterates through the array of celestial body IDs and sets their CSS top and left properties
 * to position them at specific coordinates based on their names.
 *
 * @param {string[]} hajo - An array of celestial body IDs.
 * @param {number} width - The width of the canvas.
 * @param {number} height - The height of the canvas.
 * @returns {void} This function does not return any value.
 */
function move4() {
    for (var i = 0; i < hajo.length; i++) {
        console.log(hajo[i])
        if (hajo[i] == "perilous") {
            document.getElementById(hajo[i]).style.left = (width / 2 - 100) + "px"
            document.getElementById(hajo[i]).style.top = (height / 2 - 0) + "px"
        } else if (hajo[i] == "star") {
            document.getElementById(hajo[i]).style.left = (width / 2 - 100) + "px"
            document.getElementById(hajo[i]).style.top = (height / 2 - 260) + "px"
        }
    }
}

/**
 * Moves specific user-defined objects (celestial bodies) to a designated position on the canvas.
 * This function iterates through the array of celestial body IDs and sets their CSS top and left properties
 * to position them at specific coordinates based on their names.
 *
 * @param {string[]} hajo - An array of celestial body IDs.
 * @param {number} width - The width of the canvas.
 * @param {number} height - The height of the canvas.
 * @returns {void} This function does not return any value.
 */
function move5() {
    for (var i = 0; i < hajo.length; i++) {
        console.log(hajo[i])
        if (hajo[i] == "perilous" || hajo[i] == "invader") {
            document.getElementById(hajo[i]).style.left = (width / 2 - 70) + "px"
            document.getElementById(hajo[i]).style.top = (height / 2 - 120) + "px"
        } else if (hajo[i] == "star") {
            document.getElementById(hajo[i]).style.left = (width / 2 - 100) + "px"
            document.getElementById(hajo[i]).style.top = (height / 2 - 260) + "px"
        }
    }
}

/**
 * Moves the user-defined objects (celestial bodies) to the center of the canvas.
 * This function iterates through the array of celestial body IDs and sets their CSS
 * top and left properties to "50%", effectively placing them at the center of the canvas.
 * 
 * @param {string[]} hajo - An array of celestial body IDs.
 * @param {number} width - The width of the canvas.
 * @param {number} height - The height of the canvas.
 * @returns {void} This function does not return any value.
 */
function move6() {
    for (var i = 0; i < hajo.length; i++) {
        console.log(hajo[i])
        document.getElementById(hajo[i]).style.top = "50%"
        document.getElementById(hajo[i]).style.left = "50%"
    }
}