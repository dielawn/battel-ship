
const { Game,} = require('./script')

    describe('Game class, creates 2 players, setPlayer toggles players, isHit matches coords to other players occupied coords', () => {
        const testGame = new Game()
        test('player2 exists is named, and has 5 ships', () => {
            expect(testGame.player2.name).toBe('player2')
            expect(testGame.player2.ships.length).toBe(5)
        })
        test('setPlayer initializes game to player1 then toggles between players', () => {            
            expect(testGame.setPlayer()).toBe(testGame.currentPlayer)
            expect(testGame.currentPlayer).toBe(testGame.player1)
            expect(testGame.setPlayer()).not.toBe(testGame.otherPlayer)
            expect(testGame.currentPlayer).toBe(testGame.player2)
        })

        describe('Player class has a name, 2 grids, and a fleet of ships', () => {
            const testPlayer = testGame.player1
            test(`test player name: ${testPlayer.name}`, () => {
                expect(testPlayer.name).toBe('player1')
            })
            test('player revealed board occupied coordinates set', () => {
                expect(testPlayer.setShipLocation(0, ['a1', 'a2', 'a3', 'a4', 'a5'])).toBe(testPlayer.occupiedCoordinates[0])
            })
            // test('player hidden board choosen coordinates')
            
            
            describe('the Ship class keeps track of hits, sets isSunk', () => {
                const carrier = testPlayer.ships[0]
                test('decrease hit count until ship is sunk', () => {
                    expect(carrier.isSunk).toBeFalsy()
                    expect(carrier.hit()).toBe(4)
                    expect(carrier.hit()).toBe(3)
                    expect(carrier.hit()).toBe(2)
                    expect(carrier.hit()).toBe(1)
                    expect(carrier.hit()).toBe(0)
                    expect(carrier.isSunk).toBeTruthy()
                })
            })
        }) 
        describe('10 x 10 grid, where every square has coordinates and a grid index', () => {
            const testGrid = testGame.player1.revealedBoard
            test('checks for a grid length of 100', () => {
                expect(testGrid.grid.length).toBe(100)
            })
            
            test('findIndex returns a grid index from x y coordinates', () => {
                expect(testGrid.findIndex('a1')).toBe(testGrid.grid[0])
                expect(testGrid.findIndex('j10')).toBe(testGrid.grid[99])
            })
            test('isValid checks if board coordinates are truthy', () => {
                expect(testGrid.isValid('a1')).toBeTruthy()
                expect(testGrid.isValid('a11')).toBeFalsy()
            })
            // test('set player should set player 1 to initialize then toggle players')
           
            
        })
    })


